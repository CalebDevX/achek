const axios = require('axios');

/**
 * Checks payment status for a user.
 * Replace the logic below with your real payment verification process or API.
 */
module.exports = async function paystatusCommand(sock, chatId, message) {
    // Extract user info (e.g., phone number or transaction ID)
    const senderId = message?.key?.participant || message?.key?.remoteJid;
    let userPhone = senderId ? senderId.replace(/[^0-9]/g, '') : null;

    // Ask user for transaction/reference ID if not provided
    const rawText = message?.message?.conversation || message?.message?.extendedTextMessage?.text || '';
    if (!/ref[\w\d]+|txn[\w\d]+/i.test(rawText)) {
        await sock.sendMessage(chatId, {
            text: `💳 *Achek Payment Status*\n\nPlease reply with your payment reference or transaction ID (e.g., "ref123456" or "txn7890") to check your payment status.`
        });
        return;
    }

    // Extract reference/transaction ID from message
    const refMatch = rawText.match(/ref[\w\d]+|txn[\w\d]+/i);
    const reference = refMatch ? refMatch[0] : null;

    if (!reference) {
        await sock.sendMessage(chatId, {
            text: `❗ Please provide a valid payment reference or transaction ID.`
        });
        return;
    }

    // Call backend payment status API for real verification
    try {
        const apiUrl = process.env.ACHEK_API_URL || 'http://localhost:5000/api/payment-status';
        const response = await axios.post(apiUrl, { transactionId: reference });
        const { success, paymentStatus, data, message } = response.data;
        if (success && data) {
            // Compose WhatsApp receipt message
            const receiptMsg =
                `✅ *Payment Confirmed!*
\nYour payment has been received. Here are your transaction details:\n\n` +
                `*Reference/Transaction ID:* ${data.id || reference}\n` +
                (data.amount ? `*Amount Paid:* ₦${data.amount.toLocaleString()}\n` : '') +
                (data.currency ? `*Currency:* ${data.currency}\n` : '') +
                (data.customer && data.customer.name ? `*Name:* ${data.customer.name}\n` : '') +
                (data.customer && data.customer.email ? `*Email:* ${data.customer.email}\n` : '') +
                (data.customer && data.customer.phone_number ? `*Phone:* ${data.customer.phone_number}\n` : '') +
                (data.status ? `*Status:* ${data.status}\n` : '') +
                (data.payment_type ? `*Payment Type:* ${data.payment_type}\n` : '') +
                (data.created_at ? `*Date:* ${data.created_at}\n` : '') +
                `\nThank you for choosing Achek Digital Solutions! Our team will contact you soon to proceed with your project.`;
            await sock.sendMessage(chatId, { text: receiptMsg });
        } else if (paymentStatus === 'pending') {
            await sock.sendMessage(chatId, {
                text: `⏳ *Payment Pending*\n\nYour payment with reference *${reference}* is still pending. If you have paid, please wait a few minutes and try again, or contact Achek support with your payment details.`
            });
        } else {
            await sock.sendMessage(chatId, {
                text: `❌ *Payment Not Found*\n\n${message || `We could not find a payment with reference *${reference}*.`} Please check your reference/transaction ID and try again, or contact Achek support for help.`
            });
        }
    } catch (error) {
        await sock.sendMessage(chatId, {
            text: `❌ *Error checking payment status.*\n${error?.response?.data?.message || error.message || 'Please try again later or contact Achek support.'}`
        });
    }
};
