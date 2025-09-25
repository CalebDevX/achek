// Command to post status for advertising
module.exports = async function statusCommand(sock, chatId, message, rawText) {
  // Only owner can post status
  const settings = require('../settings');
  const senderId = message.key.participant || message.key.remoteJid;
  if (senderId !== settings.ownerNumber + '@s.whatsapp.net') {
    await sock.sendMessage(chatId, { text: 'Only the bot owner can post status.' });
    return;
  }
  const statusText = rawText.replace(/^\.status\s*/i, '').trim();
  if (!statusText) {
    await sock.sendMessage(chatId, { text: 'Please provide the status text after .status command.' });
    return;
  }
  // Post status (simulate)
  await sock.sendMessage(chatId, { text: `Status posted: ${statusText}` });
  // TODO: Integrate with WhatsApp status API if available
};
