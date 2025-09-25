// Bulk newsletter command: .newsletter <message>
const settings = require('../settings');
const fs = require('fs');

module.exports = async function newsletterCommand(sock, chatId, message, rawText) {
  const senderId = message.key.participant || message.key.remoteJid;
  if (senderId !== settings.ownerNumber + '@s.whatsapp.net') {
    await sock.sendMessage(chatId, { text: 'Only the bot owner can send newsletters.' });
    return;
  }
  const newsletterText = rawText.replace(/^\.newsletter\s*/i, '').trim();
  if (!newsletterText) {
    await sock.sendMessage(chatId, { text: 'Please provide the newsletter message after .newsletter command.' });
    return;
  }
  // Load all user numbers from your user database (simulate)
  let users = [];
  try {
    users = JSON.parse(fs.readFileSync('./data/userGroupData.json', 'utf8'));
  } catch (e) {
    await sock.sendMessage(chatId, { text: 'No user data found.' });
    return;
  }
  let sentCount = 0;
  for (const user of users) {
    try {
      await sock.sendMessage(user.jid, { text: newsletterText });
      sentCount++;
    } catch (e) {
      // Ignore errors to avoid WhatsApp banning
      await new Promise(res => setTimeout(res, 1000)); // Slow down to avoid spam
    }
  }
  await sock.sendMessage(chatId, { text: `Newsletter sent to ${sentCount} users.` });
};
