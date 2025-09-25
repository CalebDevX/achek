// Achek Asset Delivery Command
const fs = require('fs');
const path = require('path');

async function assetCommand(sock, chatId, message) {
    await sock.sendMessage(chatId, { text: 'Here are Achek Digital Solutions assets. Reply with: brochure, pricing, portfolio, logo, businesscard.' });
    // Asset delivery logic will be handled in main.js
}

module.exports = assetCommand;
