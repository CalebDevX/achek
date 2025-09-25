// Security & Compliance Command
async function securityCommand(sock, chatId, message) {
    await sock.sendMessage(chatId, { text: 'AchekBot uses anti-spam, opt-in/out, and GDPR-compliant data handling.' });
}

module.exports = securityCommand;
