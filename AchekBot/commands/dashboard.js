// Admin Dashboard Command (Web Dashboard Placeholder)
async function dashboardCommand(sock, chatId, message) {
    await sock.sendMessage(chatId, { text: 'AchekBot Admin Dashboard coming soon! You will be able to view leads, sessions, and analytics.' });
}

module.exports = dashboardCommand;
