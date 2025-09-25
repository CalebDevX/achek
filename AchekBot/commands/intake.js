// Advanced Intake Flow Command
async function intakeCommand(sock, chatId, message) {
    await sock.sendMessage(chatId, { text: 'Welcome to Achek Digital Solutions intake! What service do you need? (Website, Mobile App, Branding, E-commerce, Other)' });
    // Multi-step intake handled in main.js
}

module.exports = intakeCommand;
