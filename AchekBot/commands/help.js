const settings = require('../settings');
const fs = require('fs');
const path = require('path');

async function helpCommand(sock, chatId, message) {
    const helpMessage = `
╔═══════════════════╗
   *🤖 ${settings.botName || 'AchekBot'}*  
   Version: *${settings.version || '1.0.2'}*
   by ${settings.botOwner || 'Caleb Onuche'}
   Website: https://achek.com.ng
╚═══════════════════╝

*Available Commands:*
╔═══════════════════╗
🌐 .help / .menu — Show this menu
🌐 .ping — Bot status
🌐 .alive — Bot status
🌐 .owner — Bot owner info
🌐 .groupinfo — Group info
🌐 .admins — List admins
🌐 .news — Latest news
🌐 .joke / .quote / .fact — Fun facts
🌐 .tts <text> — Text to speech
🌐 .attp <text> — Sticker text
🌐 .lyrics <song_title> — Song lyrics
🌐 .8ball <question> — Magic 8-ball
🌐 .trt <text> <lang> — Translate
🌐 .ss <link> — Screenshot
🌐 .jid — Show chat ID
╚═══════════════════╝

*Business Commands:*
╔═══════════════════╗
💼 .leadform — Capture business leads
💼 .intake — Start project intake flow
💼 .asset — Get Achek assets
💼 .dashboard — Admin dashboard
💼 .newsletter <msg> — Send newsletter
💼 .status <msg> — Post WhatsApp status
💼 .security — Security & compliance info
💼 .gemini <question> — Ask AI assistant
💼 .gpt <question> — Ask AI assistant
💼 .imagine <prompt> — AI image generator
╚═══════════════════╝

For more, visit Achek Digital Solutions:
Website: https://achek.com.ng
Portfolio: https://achek.com.ng/portfolio
Contact: info@achek.com.ng
`;

    try {
        const achekLogoPath = path.join(__dirname, '../client/public/achek-logo.png');
        if (fs.existsSync(achekLogoPath)) {
            const imageBuffer = fs.readFileSync(achekLogoPath);
            await sock.sendMessage(chatId, {
                image: imageBuffer,
                caption: helpMessage,
                contextInfo: {
                    forwardingScore: 1,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363402198872825@newsletter',
                        newsletterName: 'AchekBot Newsletter',
                        serverMessageId: -1
                    }
                }
            },{ quoted: message });
        } else {
            await sock.sendMessage(chatId, { 
                text: helpMessage,
                contextInfo: {
                    forwardingScore: 1,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363402198872825@newsletter',
                        newsletterName: 'AchekBot Newsletter',
                        serverMessageId: -1
                    } 
                }
            });
        }
    } catch (error) {
        await sock.sendMessage(chatId, { text: helpMessage });
    }
}

module.exports = helpCommand;