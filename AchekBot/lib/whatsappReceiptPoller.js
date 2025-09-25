// AchekBot: WhatsApp receipt automation (polling)
// Add this to main.js or require as needed
const axios = require('axios');
const ACHEK_API_URL = process.env.ACHEK_API_URL || 'http://localhost:5000';

async function pollAndSendReceipts(sock) {
  try {
    const res = await axios.get(`${ACHEK_API_URL}/api/pending-whatsapp-receipts`);
    // Achek team group JID (replace with your group JID)
    const teamGroupJid = process.env.ACHEK_TEAM_GROUP_JID || '120363123456789012@g.us';
    if (res.data && res.data.success && Array.isArray(res.data.receipts)) {
      for (const r of res.data.receipts) {
        if (!r.whatsapp) continue;
        const chatId = r.whatsapp.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
        const userMsg = `✅ *Payment Received!*\n\nHello ${r.name}, your payment for *${r.service}* (${r.package}) has been received. Amount: ₦${r.amount.toLocaleString()}. Our team will contact you soon to begin onboarding. Thank you for choosing Achek!`;
        await sock.sendMessage(chatId, { text: userMsg });
        // Notify Achek team group
        const teamMsg = `🚨 *New Order Received*\n\nName: ${r.name}\nService: ${r.service} (${r.package})\nAmount: ₦${r.amount.toLocaleString()}\nWhatsApp: ${r.whatsapp}\nDate: ${(new Date()).toLocaleString()}`;
        await sock.sendMessage(teamGroupJid, { text: teamMsg });
      }
    }
  } catch (err) {
    // Silent fail
  }
}

module.exports = { pollAndSendReceipts };
