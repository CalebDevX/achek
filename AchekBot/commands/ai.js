const axios = require('axios');
const fetch = require('node-fetch');
const { askGemini } = require('../lib/gemini');

async function aiCommand(sock, chatId, message) {
    try {
        const text = message.message?.conversation || message.message?.extendedTextMessage?.text;
        if (!text) {
            return sock.sendMessage(chatId, { 
                text: "Please provide a question after .gemini\n\nExample: .gemini write a basic html code"
            });
        }

        // Get the command and query
        const parts = text.split(' ');
        const command = parts[0].toLowerCase();
        const query = parts.slice(1).join(' ').trim();

        if (!query) {
            return sock.sendMessage(chatId, { 
                text: "Please provide a question after .gemini"
            });
        }

        // Show processing message
        await sock.sendMessage(chatId, {
            react: { text: '🤖', key: message.key }
        });

        if (command === '.gemini') {
            // Use official Gemini API
            const answer = await askGemini(query);
            await sock.sendMessage(chatId, {
                text: answer
            }, {
                quoted: message
            });
        } else if (command === '.newsletter') {
            // Newsletter info and subscription
            await sock.sendMessage(chatId, {
                text: `Achek Newsletter\nStay updated with our latest news, offers, and digital tips!\nTo subscribe, visit achek.com.ng or reply with your email address.`
            }, {
                quoted: message
            });
            return;
        }
    } catch (error) {
        await sock.sendMessage(chatId, {
            text: `❌ AI error: ${error.message || error}`
        }, {
            quoted: message
        });
    }
}