// Lead Generation Command for AchekBot
const fs = require('fs');
const path = require('path');

async function leadFormCommand(sock, chatId, message) {
    await sock.sendMessage(chatId, { text: 'Let’s get your details for Achek Digital Solutions. Please reply with your name.' });
    // Intake flow will be handled in main.js
}

module.exports = leadFormCommand;
