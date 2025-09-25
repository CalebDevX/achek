// .paylink command for AchekBot: generate payment link with pricing
const axios = require('axios');

// Example: .paylink Website Development
module.exports = async function paylinkCommand(sock, chatId, message) {
    const rawText = message?.message?.conversation || message?.message?.extendedTextMessage?.text || '';
    // Extract service name from message
    const match = rawText.match(/\.paylink\s+(.+)/i);
    const service = match ? match[1].trim() : null;
    if (!service) {
        await sock.sendMessage(chatId, {
            text: `💳 *Achek Payment Link*\n\nPlease use: .paylink <service name> (e.g., .paylink Website Development)`
        });
        return;
    }
    // Fetch pricing from backend or static list
    // For now, use static mapping (sync with pricing.tsx)
    const pricing = {
        'Website Development': 150000,
        'Ecommerce Website': 250000,
        'Business Website': 120000,
        'Standard Hosting': 15000,
        'Advanced Hosting': 40000,
        'Enterprise Hosting': 100000,
        'Standard Domain': 10000,
        'Premium Domain': 15000,
        'Enterprise Domain Portfolio': 20000,
        'Basic Email': 5000,
        'Pro Email': 15000,
        'Enterprise Email': 50000,
        'Basic Maintenance': 15000,
        'Pro Maintenance': 50000,
        'Enterprise Maintenance': 150000,
        'Basic Security': 20000,
        'Pro Security': 60000
    };
    const amount = pricing[service] || null;
    if (!amount) {
        await sock.sendMessage(chatId, {
            text: `❌ Sorry, we could not find pricing for "${service}". Please check the service name or contact Achek support.`
        });
        return;
    }
    // Generate Flutterwave payment link (replace with real integration)
    const paymentLink = `https://flutterwave.com/pay/achek?amount=${amount}&desc=${encodeURIComponent(service)}`;
    await sock.sendMessage(chatId, {
        text: `💳 *Achek Payment Link*\n\nService: *${service}*\nAmount: *₦${amount.toLocaleString()}*\n\nPay securely: ${paymentLink}`
    });
};
