// Bot control commands: .boton and .botoff for admins/owner
const settings = require('../settings');
let botEnabled = true;

function isAdminOrOwner(senderId) {
  return senderId === settings.ownerNumber + '@s.whatsapp.net';
}

module.exports = async function botControl(sock, chatId, message, rawText) {
  const senderId = message.key.participant || message.key.remoteJid;
  if (!isAdminOrOwner(senderId)) {
    await sock.sendMessage(chatId, { text: 'Only the bot owner can use this command.' });
    return;
  }
  if (/^\.boton$/i.test(rawText)) {
    botEnabled = true;
    await sock.sendMessage(chatId, { text: '🤖 Bot is now ENABLED and will respond to chats.' });
    return;
  }
  if (/^\.botoff$/i.test(rawText)) {
    botEnabled = false;
    await sock.sendMessage(chatId, { text: '🤖 Bot is now DISABLED and will not respond to chats.' });
    return;
  }
};

module.exports.isBotEnabled = () => botEnabled;
