// Bot control, status, and advanced AchekBot features
const botControl = require('./commands/botcontrol');
const statusCommand = require('./commands/status');
const newsletterCommand = require('./commands/newsletter');
const paystatusCommand = require('./commands/paystatus');
const leadFormCommand = require('./commands/leadform');
const assetCommand = require('./commands/asset');
const dashboardCommand = require('./commands/dashboard');
const intakeCommand = require('./commands/intake');
const securityCommand = require('./commands/security');
// WhatsApp receipt poller
const { pollAndSendReceipts } = require('./lib/whatsappReceiptPoller');
let receiptPollInterval = null;
const settings = require('./settings');
require('./config.js');
const { isBanned } = require('./lib/isBanned');
const yts = require('yt-search');
const { fetchBuffer } = require('./lib/myfunc');
const fs = require('fs');
const fetch = require('node-fetch');
const ytdl = require('ytdl-core');
const path = require('path');
const axios = require('axios');
const ffmpeg = require('fluent-ffmpeg');
const { addWelcome, delWelcome, isWelcomeOn, addGoodbye, delGoodBye, isGoodByeOn } = require('./lib/index');

// Command imports
// const tagAllCommand = require('./commands/tagall'); // Removed: file does not exist
const helpCommand = require('./commands/help');
const banCommand = require('./commands/ban');
// const { promoteCommand } = require('./commands/promote'); // Removed: file does not exist
// const { demoteCommand } = require('./commands/demote'); // Removed: file does not exist
// Removed all command imports for files that do not exist in ./commands
const aiCommand = require('./commands/ai');
// const { handleSsCommand } = require('./commands/ss'); // Removed: file does not exist
const { addCommandReaction, handleAreactCommand } = require('./lib/reactions');
const imagineCommand = require('./commands/imagine');


// Global settings
global.packname = settings.packname;
global.author = settings.author;
global.channelLink = "https://achek.com.ng";
global.ytch = "Achek Digital Solutions";

// Add this near the top of main.js with other global configurations
const channelInfo = {
    contextInfo: {
        forwardingScore: 1,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363402198872825@newsletter',
            newsletterName: 'AchekBot Newsletter',
            serverMessageId: -1
        }
    }
};
async function handleMessages(sock, messageUpdate, printLog) {
    const paylinkCommand = require('./commands/paylink');
    // Start WhatsApp receipt polling if not already started
    if (!receiptPollInterval) {
        receiptPollInterval = setInterval(() => pollAndSendReceipts(sock), 15000); // every 15s
    }
    // Get raw text
    const message = messageUpdate.messages?.[0];
    const chatId = message?.key?.remoteJid;
    const senderId = message?.key?.participant || message?.key?.remoteJid;
    const rawText = message?.message?.conversation || message?.message?.extendedTextMessage?.text || "";

    // AchekBot advanced features (moved inside async function for correct scope)
    if (/^\.paylink( |$)/i.test(rawText)) {
        await paylinkCommand(sock, chatId, message);
        return;
    }
    if (/^\.leadform$/i.test(rawText)) {
        await leadFormCommand(sock, chatId, message);
        return;
    }
    if (/^\.asset$/i.test(rawText)) {
        await assetCommand(sock, chatId, message);
        return;
    }
    if (/^\.dashboard$/i.test(rawText)) {
        await dashboardCommand(sock, chatId, message);
        return;
    }
    if (/^\.intake$/i.test(rawText)) {
        await intakeCommand(sock, chatId, message);
        return;
    }
    if (/^\.security$/i.test(rawText)) {
        await securityCommand(sock, chatId, message);
        return;
    }
// remove
    // Only respond to chats if bot is enabled
    if (typeof botControl.isBotEnabled === 'function' && !botControl.isBotEnabled()) {
        return;
    }
        // Escalation: .human command
        if (userMessage.startsWith('.human')) {
            await sock.sendMessage(chatId, {
                text: 'A human Achek agent will contact you soon. Please wait for a response.'
            });
            // Optionally, notify admins or log for follow-up
            return;
        }
    try {
        const { messages, type } = messageUpdate;
        if (type !== 'notify') return;

        const message = messages[0];
        if (!message?.message) return;

        // Store message for antidelete feature
        if (message.message) {
            storeMessage(message);
        }

        // Handle message revocation
        if (message.message?.protocolMessage?.type === 0) {
            await handleMessageRevocation(sock, message);
            return;
        }

        const chatId = message.key.remoteJid;
        const senderId = message.key.participant || message.key.remoteJid;
        const isGroup = chatId.endsWith('@g.us');

        // Onboarding: Welcome new users (private chat only)
    const { isNewUser, registerUser, setPendingService, isPendingService, clearPendingService, setIntakeState, getIntakeState, clearIntakeState } = require('./lib/myfunc');
        // Project intake: Website Q&A flow
        const intake = getIntakeState(senderId);
        if (intake && intake.type === 'website') {
            // Step through questions
            const step = intake.step || 0;
            const answers = intake.answers || {};
            if (step === 0) {
                // Ask for website type
                await sock.sendMessage(chatId, { text: 'What type of website do you want? (e.g., Business, E-commerce, Portfolio, Blog, News, Educational, Non-profit, Real Estate, Booking, Directory, Landing Page, Forum, Social Network, Custom, etc.)' });
                setIntakeState(senderId, { type: 'website', step: 1, answers });
                return;
            }
            if (step === 1) {
                answers.websiteType = rawText;
                setIntakeState(senderId, { type: 'website', step: 2, answers });
                await sock.sendMessage(chatId, { text: 'What is your business or organization about?' });
                return;
            }
            if (step === 2) {
                answers.business = rawText;
                setIntakeState(senderId, { type: 'website', step: 3, answers });
                await sock.sendMessage(chatId, { text: 'What features do you want? (e.g., blog, e-commerce, contact form, gallery, booking, etc.)' });
                return;
            }
            if (step === 3) {
                answers.features = rawText;
                setIntakeState(senderId, { type: 'website', step: 4, answers });
                await sock.sendMessage(chatId, { text: 'Do you have a preferred design style or reference websites?' });
                return;
            }
            if (step === 4) {
                answers.design = rawText;
                setIntakeState(senderId, { type: 'website', step: 5, answers });
                await sock.sendMessage(chatId, { text: 'Will you provide your own content (text/images), or do you need help with that?' });
                return;
            }
            if (step === 5) {
                answers.content = rawText;
                setIntakeState(senderId, { type: 'website', step: 6, answers });
                await sock.sendMessage(chatId, { text: 'Any special integrations needed? (e.g., payment, chat, analytics, newsletter, etc.)' });
                return;
            }
            if (step === 6) {
                answers.integrations = rawText;
                setIntakeState(senderId, { type: 'website', step: 7, answers });
                await sock.sendMessage(chatId, { text: 'What is your budget and timeline for this project?' });
                return;
            }
            if (step === 7) {
                answers.budget = rawText;
                // Offer chat or web form
                await sock.sendMessage(chatId, { text: 'Would you like to answer all questions here in chat, or use a web form with all options? Reply CHAT or WEB.' });
                setIntakeState(senderId, { type: 'website', step: 8, answers });
                return;
            }
            if (step === 8) {
                if (/web/i.test(rawText)) {
                    // Generate a link (placeholder)
                    await sock.sendMessage(chatId, { text: 'Please use this link to fill out all website requirements: https://achek.com.ng/project-intake (demo link)' });
                    await sock.sendMessage(chatId, { text: 'Once you submit the form, our team will contact you!' });
                    clearIntakeState(senderId);
                    return;
                }
                // Continue in chat
                // Suggest enhancements
                await sock.sendMessage(chatId, { text: 'Great! For a powerful website, we recommend: SEO optimization, mobile responsiveness, fast loading, security, analytics, and easy content management. Would you like any of these?' });
                setIntakeState(senderId, { type: 'website', step: 9, answers });
                return;
            }
            if (step === 9) {
                answers.enhancements = rawText;
                // Summarize and ask for confirmation/redo
                let summary = `Here’s a summary of your website project:\n\nType: ${answers.websiteType}\nBusiness: ${answers.business}\nFeatures: ${answers.features}\nDesign: ${answers.design}\nContent: ${answers.content}\nIntegrations: ${answers.integrations}\nBudget/Timeline: ${answers.budget}\nEnhancements: ${answers.enhancements}`;
                await sock.sendMessage(chatId, { text: summary });
                // Generate PDF and send to user
                const { generateProjectPDF } = require('./lib/pdf');
                const pdfPath = await generateProjectPDF(senderId, summary, answers);
                const pdfBuffer = require('fs').readFileSync(pdfPath);
                await sock.sendMessage(chatId, { document: pdfBuffer, mimetype: 'application/pdf', fileName: 'Achek-Project-Summary.pdf', caption: 'Here is your project summary as a PDF. Please review.' });
                await sock.sendMessage(chatId, { text: 'Reply CONFIRM to proceed, or REDO to start over or make changes.' });
                setIntakeState(senderId, { type: 'website', step: 10, answers });
                return;
            }
            if (step === 10) {
                if (/redo/i.test(rawText)) {
                    await sock.sendMessage(chatId, { text: 'No problem! Let’s start over. What type of website do you want?' });
                    setIntakeState(senderId, { type: 'website', step: 0, answers: {} });
                    return;
                }
                if (/confirm/i.test(rawText)) {
                    // Check payment status (reuse .paystatus logic)
                    const paystatusCommand = require('./commands/paystatus');
                    await paystatusCommand(sock, chatId, message);
                    await sock.sendMessage(chatId, { text: 'Once payment is confirmed, our team will start building your website and update you with the timeline!' });
                    // Notify admin with PDF
                    const adminNumber = '2348104040841@s.whatsapp.net';
                    const { generateProjectPDF } = require('./lib/pdf');
                    const pdfPath = await generateProjectPDF(senderId, 'Website Project Intake', answers);
                    const pdfBuffer = require('fs').readFileSync(pdfPath);
                    await sock.sendMessage(adminNumber, { document: pdfBuffer, mimetype: 'application/pdf', fileName: `Achek-Project-${senderId}.pdf`, caption: `New website project intake from ${senderId}` });
                    // Email to team
                    const { sendProjectEmail } = require('./lib/email');
                    try {
                        await sendProjectEmail(
                            `New Website Project Intake from ${senderId}`,
                            `A new website project intake has been submitted.\n\nSummary:\nType: ${answers.websiteType}\nBusiness: ${answers.business}\nFeatures: ${answers.features}\nDesign: ${answers.design}\nContent: ${answers.content}\nIntegrations: ${answers.integrations}\nBudget/Timeline: ${answers.budget}\nEnhancements: ${answers.enhancements}`,
                            pdfPath
                        );
                    } catch (e) {
                        console.error('Failed to send project email:', e);
                    }
                    clearIntakeState(senderId);
                    return;
                }
                await sock.sendMessage(chatId, { text: 'Please reply CONFIRM to proceed, or REDO to start over or make changes.' });
                return;
            }
        }
        // Onboarding: Welcome and ask for service
        if (!isGroup && isNewUser(senderId)) {
            registerUser(senderId);
            // Try to extract user's name from the first message
            let userName = '';
            const nameMatch = rawText.match(/my name is ([^.,\n]+)/i);
            if (nameMatch && nameMatch[1]) {
                userName = nameMatch[1].trim();
            }
            let welcomeMsg = `👋 Welcome to Achek Digital Solutions!\n\nAchekBot is your official WhatsApp assistant for all Achek services. Achek is a Nigerian tech company offering web, mobile, branding, e-commerce, and digital solutions for businesses and individuals.\n\nOur assets and services are trusted by hundreds of clients.\n\n`;
            if (userName) {
                welcomeMsg = `👋 Hello ${userName}, welcome to Achek Digital Solutions!\n\nAchekBot is your official WhatsApp assistant for all Achek services. Achek is a Nigerian tech company offering web, mobile, branding, e-commerce, and digital solutions for businesses and individuals.\n\nOur assets and services are trusted by hundreds of clients.\n\n`;
            }
            welcomeMsg += `What service do you need from Achek Digital Solutions? Please reply with details so we can assist you.\n\nLearn more: https://achek.com.ng\nSee our portfolio: https://achek.com.ng/portfolio\nContact: info@achek.com.ng`;
            await sock.sendMessage(chatId, {
                text: welcomeMsg
            });
            setPendingService(senderId);
            return;
        }

        // Collect service request if user is in pending state
        if (!isGroup && isPendingService(senderId)) {
            // Use Gemini to classify service type
            const { askGemini } = require('./lib/gemini');
            let geminiReply = '';
            try {
                geminiReply = await askGemini(`Classify this user request for Achek Digital Solutions. Reply ONLY with one of: website, mobileapp, branding, ecommerce, or other. User message: "${rawText}"`);
            } catch (e) {
                console.error('Gemini error:', e);
            }
            const serviceType = (geminiReply || '').toLowerCase().trim();
            if (serviceType.includes('website')) {
                clearPendingService(senderId);
                await sock.sendMessage(chatId, { text: 'Great! Let’s get started with your website project. What type of website do you want? (Business, E-commerce, Portfolio, Blog, etc.)' });
                setIntakeState(senderId, { type: 'website', step: 0, answers: {} });
                return;
            }
            if (serviceType.includes('mobileapp') || serviceType.includes('mobile app') || serviceType.includes('android') || serviceType.includes('ios')) {
                clearPendingService(senderId);
                await sock.sendMessage(chatId, { text: 'Awesome! Let’s start your mobile app project. What platform do you want? (Android, iOS, Both)' });
                setIntakeState(senderId, { type: 'mobileapp', step: 0, answers: {} });
                return;
            }
            if (serviceType.includes('branding') || serviceType.includes('brand') || serviceType.includes('logo') || serviceType.includes('identity')) {
                clearPendingService(senderId);
                await sock.sendMessage(chatId, { text: 'Let’s help you with branding! What do you need? (Logo, Brand Identity, Guidelines, etc.)' });
                setIntakeState(senderId, { type: 'branding', step: 0, answers: {} });
                return;
            }
            if (serviceType.includes('ecommerce') || serviceType.includes('shop') || serviceType.includes('store') || serviceType.includes('online shop')) {
                clearPendingService(senderId);
                await sock.sendMessage(chatId, { text: 'Let’s build your e-commerce solution! What products/services will you sell?' });
                setIntakeState(senderId, { type: 'ecommerce', step: 0, answers: {} });
                return;
            }
            // If Gemini can't classify, fallback to manual prompt
            await sock.sendMessage(chatId, { text: 'Please specify the service you need (e.g., Website, Mobile App, Branding, E-commerce, Other).' });
            return;
        }
        // Mobile App intake flow
        if (intake && intake.type === 'mobileapp') {
            const step = intake.step || 0;
            const answers = intake.answers || {};
            if (step === 0) {
                answers.platform = rawText;
                setIntakeState(senderId, { type: 'mobileapp', step: 1, answers });
                await sock.sendMessage(chatId, { text: 'What is your app idea or purpose?' });
                return;
            }
            if (step === 1) {
                answers.idea = rawText;
                setIntakeState(senderId, { type: 'mobileapp', step: 2, answers });
                await sock.sendMessage(chatId, { text: 'What features do you want in your app?' });
                return;
            }
            if (step === 2) {
                answers.features = rawText;
                setIntakeState(senderId, { type: 'mobileapp', step: 3, answers });
                await sock.sendMessage(chatId, { text: 'Do you have design preferences or reference apps?' });
                return;
            }
            if (step === 3) {
                answers.design = rawText;
                setIntakeState(senderId, { type: 'mobileapp', step: 4, answers });
                await sock.sendMessage(chatId, { text: 'What is your budget and timeline?' });
                return;
            }
            if (step === 4) {
                answers.budget = rawText;
                let summary = `Mobile App Project Summary:\nPlatform: ${answers.platform}\nIdea: ${answers.idea}\nFeatures: ${answers.features}\nDesign: ${answers.design}\nBudget/Timeline: ${answers.budget}`;
                await sock.sendMessage(chatId, { text: summary });
                // PDF/email logic can be added here
                clearIntakeState(senderId);
                return;
            }
        }
        // Branding intake flow
        if (intake && intake.type === 'branding') {
            const step = intake.step || 0;
            const answers = intake.answers || {};
            if (step === 0) {
                answers.needs = rawText;
                setIntakeState(senderId, { type: 'branding', step: 1, answers });
                await sock.sendMessage(chatId, { text: 'Describe your business and target audience.' });
                return;
            }
            if (step === 1) {
                answers.business = rawText;
                setIntakeState(senderId, { type: 'branding', step: 2, answers });
                await sock.sendMessage(chatId, { text: 'Do you have existing brand assets or ideas?' });
                return;
            }
            if (step === 2) {
                answers.assets = rawText;
                setIntakeState(senderId, { type: 'branding', step: 3, answers });
                await sock.sendMessage(chatId, { text: 'What is your budget and timeline?' });
                return;
            }
            if (step === 3) {
                answers.budget = rawText;
                let summary = `Branding Project Summary:\nNeeds: ${answers.needs}\nBusiness: ${answers.business}\nAssets/Ideas: ${answers.assets}\nBudget/Timeline: ${answers.budget}`;
                await sock.sendMessage(chatId, { text: summary });
                // PDF/email logic can be added here
                clearIntakeState(senderId);
                return;
            }
        }
        // E-commerce intake flow
        if (intake && intake.type === 'ecommerce') {
            const step = intake.step || 0;
            const answers = intake.answers || {};
            if (step === 0) {
                answers.products = rawText;
                setIntakeState(senderId, { type: 'ecommerce', step: 1, answers });
                await sock.sendMessage(chatId, { text: 'What features do you want in your online store?' });
                return;
            }
            if (step === 1) {
                answers.features = rawText;
                setIntakeState(senderId, { type: 'ecommerce', step: 2, answers });
                await sock.sendMessage(chatId, { text: 'Do you have design preferences or reference stores?' });
                return;
            }
            if (step === 2) {
                answers.design = rawText;
                setIntakeState(senderId, { type: 'ecommerce', step: 3, answers });
                await sock.sendMessage(chatId, { text: 'What is your budget and timeline?' });
                return;
            }
            if (step === 3) {
                answers.budget = rawText;
                let summary = `E-commerce Project Summary:\nProducts: ${answers.products}\nFeatures: ${answers.features}\nDesign: ${answers.design}\nBudget/Timeline: ${answers.budget}`;
                await sock.sendMessage(chatId, { text: summary });
                // PDF/email logic can be added here
                clearIntakeState(senderId);
                return;
            }
        }

        let userMessage = message.message?.conversation?.trim().toLowerCase() ||
            message.message?.extendedTextMessage?.text?.trim().toLowerCase() || '';
        userMessage = userMessage.replace(/\.\s+/g, '.').trim();

        // Preserve raw message for commands like .tag that need original casing
        const rawText = message.message?.conversation?.trim() ||
            message.message?.extendedTextMessage?.text?.trim() || '';

        // Only log command usage
        if (userMessage.startsWith('.')) {
            console.log(`📝 Command used in ${isGroup ? 'group' : 'private'}: ${userMessage}`);
        }

        // Payment status command
        if (userMessage.startsWith('.paystatus')) {
            await paystatusCommand(sock, chatId, message);
            return;
        }

        // Check if user is banned (skip ban check for unban command)
        if (isBanned(senderId) && !userMessage.startsWith('.unban')) {
            // Only respond occasionally to avoid spam
            if (Math.random() < 0.1) {
                await sock.sendMessage(chatId, {
                    text: '❌ You are banned from using the bot. Contact an admin to get unbanned.',
                    ...channelInfo
                });
            }
            return;
        }

        // First check if it's a game move
        if (/^[1-9]$/.test(userMessage) || userMessage.toLowerCase() === 'surrender') {
            await handleTicTacToeMove(sock, chatId, senderId, userMessage);
            return;
        }

        /*  // Basic message response in private chat
          if (!isGroup && (userMessage === 'hi' || userMessage === 'hello' || userMessage === 'bot' || userMessage === 'hlo' || userMessage === 'hey' || userMessage === 'bro')) {
              await sock.sendMessage(chatId, {
                  text: 'Hi, How can I help you?\nYou can use .menu for more info and commands.',
                  ...channelInfo
              });
              return;
          } */

        if (!message.key.fromMe) incrementMessageCount(chatId, senderId);

        // Check for bad words FIRST, before ANY other processing
        if (isGroup && userMessage) {
            await handleBadwordDetection(sock, chatId, message, userMessage, senderId);
        }

        // Then check for command prefix
        if (!userMessage.startsWith('.')) {
            if (isGroup) {
                // Process non-command messages first
                await handleChatbotResponse(sock, chatId, message, userMessage, senderId);
                await Antilink(message, sock);
                await handleBadwordDetection(sock, chatId, message, userMessage, senderId);
            } else {
                // Advanced Gemini assistant for private chats
                const { askGemini } = require('./lib/gemini');
                let geminiPrompt = `You are AchekBot, the official WhatsApp AI assistant for Achek Digital Solutions. Always answer as a professional Achek representative.\n\nCompany Info:\nAchek Digital Solutions is a Nigerian tech company specializing in web development, mobile apps, branding, e-commerce, and digital solutions.\nFounder: Caleb O.\nWebsite: https://achek.com.ng\nPortfolio: https://achek.com.ng/portfolio\nContact: info@achek.com.ng\nPricing: https://achek.com.ng/pricing\nServices: https://achek.com.ng/services\n\nCapabilities: Answer FAQs, provide instant quotes, support, branded responses, summarize projects, escalate complex issues. Always use Achek branding and assets. If the user asks about services, pricing, support, or has a general inquiry, answer helpfully and professionally. If the request is too complex or sensitive, say you'll connect to a human Achek agent.`;
                geminiPrompt += `\nUser: ${rawText}`;
                let geminiReply = '';
                try {
                    geminiReply = await askGemini(geminiPrompt);
                } catch (e) {
                    geminiReply = '❌ Gemini API error. Please try again later.';
                }
                await sock.sendMessage(chatId, { text: geminiReply });
            }
            return;
        }

        // List of admin commands
        const adminCommands = ['.mute', '.unmute', '.ban', '.unban', '.promote', '.demote', '.kick', '.tagall', '.antilink'];
        const isAdminCommand = adminCommands.some(cmd => userMessage.startsWith(cmd));

        // List of owner commands
        const ownerCommands = ['.mode', '.autostatus', '.antidelete', '.cleartmp', '.setpp', '.clearsession', '.areact', '.autoreact'];
        const isOwnerCommand = ownerCommands.some(cmd => userMessage.startsWith(cmd));

        let isSenderAdmin = false;
        let isBotAdmin = false;

        // Check admin status only for admin commands in groups
        if (isGroup && isAdminCommand) {
            const adminStatus = await isAdmin(sock, chatId, senderId, message);
            isSenderAdmin = adminStatus.isSenderAdmin;
            isBotAdmin = adminStatus.isBotAdmin;

            if (!isBotAdmin) {
                await sock.sendMessage(chatId, { text: 'Please make the bot an admin to use admin commands.', ...channelInfo }, {quoted: message});
                return;
            }

            if (
                userMessage.startsWith('.mute') ||
                userMessage === '.unmute' ||
                userMessage.startsWith('.ban') ||
                userMessage.startsWith('.unban') ||
                userMessage.startsWith('.promote') ||
                userMessage.startsWith('.demote')
            ) {
                if (!isSenderAdmin && !message.key.fromMe) {
                    await sock.sendMessage(chatId, {
                        text: 'Sorry, only group admins can use this command.',
                        ...channelInfo
                    });
                    return;
                }
            }
        }

        // Check owner status for owner commands
        if (isOwnerCommand) {
            // Check if message is from owner (fromMe) or bot itself
            if (!message.key.fromMe) {
                await sock.sendMessage(chatId, {
                    text: '❌ This command is only available for the owner!',
                    ...channelInfo
                });
                return;
            }
        }

        // Add this near the start of your message handling logic, before processing commands
        try {
            const data = JSON.parse(fs.readFileSync('./data/messageCount.json'));
            // Allow owner to use bot even in private mode
            if (!data.isPublic && !message.key.fromMe) {
                return; // Silently ignore messages from non-owners when in private mode
            }
        } catch (error) {
            console.error('Error checking access mode:', error);
            // Default to public mode if there's an error reading the file
        }

        // Command handlers
        switch (true) {
            case userMessage === '.simage': {
                const quotedMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
                if (quotedMessage?.stickerMessage) {
                    await simageCommand(sock, quotedMessage, chatId);
                } else {
                    await sock.sendMessage(chatId, { text: 'Please reply to a sticker with the .simage command to convert it.', ...channelInfo });
                }
                break;
            }
            case userMessage.startsWith('.kick'):
                const mentionedJidListKick = message.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
                await kickCommand(sock, chatId, senderId, mentionedJidListKick, message);
                break;
            case userMessage.startsWith('.mute'):
                const muteDuration = parseInt(userMessage.split(' ')[1]);
                if (isNaN(muteDuration)) {
                    await sock.sendMessage(chatId, { text: 'Please provide a valid number of minutes.\neg to mute 10 minutes\n.mute 10', ...channelInfo });
                } else {
                    await muteCommand(sock, chatId, senderId, muteDuration);
                }
                break;
            case userMessage === '.unmute':
                await unmuteCommand(sock, chatId, senderId);
                break;
            case userMessage.startsWith('.ban'):
                await banCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.unban'):
                await unbanCommand(sock, chatId, message);
                break;
            case userMessage === '.help' || userMessage === '.menu' || userMessage === '.bot' || userMessage === '.list':
                await helpCommand(sock, chatId, message, global.channelLink);
                break;
            case userMessage === '.sticker' || userMessage === '.s':
                await stickerCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.warnings'):
                const mentionedJidListWarnings = message.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
                await warningsCommand(sock, chatId, mentionedJidListWarnings);
                break;
            case userMessage.startsWith('.warn'):
                const mentionedJidListWarn = message.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
                await warnCommand(sock, chatId, senderId, mentionedJidListWarn, message);
                break;
            case userMessage.startsWith('.tts'):
                const text = userMessage.slice(4).trim();
                await ttsCommand(sock, chatId, text, message);
                break;
            case userMessage === '.delete' || userMessage === '.del':
                await deleteCommand(sock, chatId, message, senderId);
                break;
            case userMessage.startsWith('.attp'):
                await attpCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.mode'):
                // Check if sender is the owner
                if (!message.key.fromMe) {
                    await sock.sendMessage(chatId, { text: 'Only bot owner can use this command!', ...channelInfo });
                    return;
                }
                // Read current data first
                let data;
                try {
                    data = JSON.parse(fs.readFileSync('./data/messageCount.json'));
                } catch (error) {
                    console.error('Error reading access mode:', error);
                    await sock.sendMessage(chatId, { text: 'Failed to read bot mode status', ...channelInfo });
                    return;
                }

                const action = userMessage.split(' ')[1]?.toLowerCase();
                // If no argument provided, show current status
                if (!action) {
                    const currentMode = data.isPublic ? 'public' : 'private';
                    await sock.sendMessage(chatId, {
                        text: `Current bot mode: *${currentMode}*\n\nUsage: .mode public/private\n\nExample:\n.mode public - Allow everyone to use bot\n.mode private - Restrict to owner only`,
                        ...channelInfo
                    });
                    return;
                }

                if (action !== 'public' && action !== 'private') {
                    await sock.sendMessage(chatId, {
                        text: 'Usage: .mode public/private\n\nExample:\n.mode public - Allow everyone to use bot\n.mode private - Restrict to owner only',
                        ...channelInfo
                    });
                    return;
                }

                try {
                    // Update access mode
                    data.isPublic = action === 'public';

                    // Save updated data
                    fs.writeFileSync('./data/messageCount.json', JSON.stringify(data, null, 2));

                    await sock.sendMessage(chatId, { text: `Bot is now in *${action}* mode`, ...channelInfo });
                } catch (error) {
                    console.error('Error updating access mode:', error);
                    await sock.sendMessage(chatId, { text: 'Failed to update bot access mode', ...channelInfo });
                }
                break;
            case userMessage === '.owner':
                await ownerCommand(sock, chatId);
                break;
            case userMessage === '.tagall':
                if (isSenderAdmin || message.key.fromMe) {
                    await tagAllCommand(sock, chatId, senderId, message);
                } else {
                    await sock.sendMessage(chatId, { text: 'Sorry, only group admins can use the .tagall command.', ...channelInfo }, {quoted: message});
                }
                break;
            case userMessage.startsWith('.tag'):
                const messageText = rawText.slice(4).trim();  // use rawText here, not userMessage
                const replyMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage || null;
                await tagCommand(sock, chatId, senderId, messageText, replyMessage);
                break;
            case userMessage.startsWith('.antilink'):
                if (!isGroup) {
                    await sock.sendMessage(chatId, {
                        text: 'This command can only be used in groups.',
                        ...channelInfo
                    });
                    return;
                }
                if (!isBotAdmin) {
                    await sock.sendMessage(chatId, {
                        text: 'Please make the bot an admin first.',
                        ...channelInfo
                    });
                    return;
                }
                await handleAntilinkCommand(sock, chatId, userMessage, senderId, isSenderAdmin);
                break;
            case userMessage === '.meme':
                await memeCommand(sock, chatId, message);
                break;
            case userMessage === '.joke':
                await jokeCommand(sock, chatId, message);
                break;
            case userMessage === '.quote':
                await quoteCommand(sock, chatId, message);
                break;
            case userMessage === '.fact':
                await factCommand(sock, chatId, message, message);
                break;
            case userMessage.startsWith('.weather'):
                const city = userMessage.slice(9).trim();
                if (city) {
                    await weatherCommand(sock, chatId, city);
                } else {
                    await sock.sendMessage(chatId, { text: 'Please specify a city, e.g., .weather London', ...channelInfo });
                }
                break;
            case userMessage === '.news':
                await newsCommand(sock, chatId);
                break;
            case userMessage.startsWith('.ttt') || userMessage.startsWith('.tictactoe'):
                const tttText = userMessage.split(' ').slice(1).join(' ');
                await tictactoeCommand(sock, chatId, senderId, tttText);
                break;
            case userMessage.startsWith('.move'):
                const position = parseInt(userMessage.split(' ')[1]);
                if (isNaN(position)) {
                    await sock.sendMessage(chatId, { text: 'Please provide a valid position number for Tic-Tac-Toe move.', ...channelInfo });
                } else {
                    tictactoeMove(sock, chatId, senderId, position);
                }
                break;
            case userMessage === '.topmembers':
                topMembers(sock, chatId, isGroup);
                break;
            case userMessage.startsWith('.hangman'):
                startHangman(sock, chatId);
                break;
            case userMessage.startsWith('.guess'):
                const guessedLetter = userMessage.split(' ')[1];
                if (guessedLetter) {
                    guessLetter(sock, chatId, guessedLetter);
                } else {
                    sock.sendMessage(chatId, { text: 'Please guess a letter using .guess <letter>', ...channelInfo });
                }
                break;
            case userMessage.startsWith('.trivia'):
                startTrivia(sock, chatId);
                break;
            case userMessage.startsWith('.answer'):
                const answer = userMessage.split(' ').slice(1).join(' ');
                if (answer) {
                    answerTrivia(sock, chatId, answer);
                } else {
                    sock.sendMessage(chatId, { text: 'Please provide an answer using .answer <answer>', ...channelInfo });
                }
                break;
            case userMessage.startsWith('.compliment'):
                await complimentCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.insult'):
                await insultCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.8ball'):
                const question = userMessage.split(' ').slice(1).join(' ');
                await eightBallCommand(sock, chatId, question);
                break;
            case userMessage.startsWith('.lyrics'):
                const songTitle = userMessage.split(' ').slice(1).join(' ');
                await lyricsCommand(sock, chatId, songTitle);
                break;
            case userMessage.startsWith('.simp'):
                const quotedMsg = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
                const mentionedJid = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
                await simpCommand(sock, chatId, quotedMsg, mentionedJid, senderId);
                break;
            case userMessage.startsWith('.stupid') || userMessage.startsWith('.itssostupid') || userMessage.startsWith('.iss'):
                const stupidQuotedMsg = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
                const stupidMentionedJid = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
                const stupidArgs = userMessage.split(' ').slice(1);
                await stupidCommand(sock, chatId, stupidQuotedMsg, stupidMentionedJid, senderId, stupidArgs);
                break;
            case userMessage === '.dare':
                await dareCommand(sock, chatId, message);
                break;
            case userMessage === '.truth':
                await truthCommand(sock, chatId, message);
                break;
            case userMessage === '.clear':
                if (isGroup) await clearCommand(sock, chatId);
                break;
            case userMessage.startsWith('.promote'):
                const mentionedJidListPromote = message.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
                await promoteCommand(sock, chatId, mentionedJidListPromote, message);
                break;
            case userMessage.startsWith('.demote'):
                const mentionedJidListDemote = message.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
                await demoteCommand(sock, chatId, mentionedJidListDemote, message);
                break;
            case userMessage === '.ping':
                await pingCommand(sock, chatId, message);
                break;
            case userMessage === '.alive':
                await aliveCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.blur'):
                const quotedMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
                await blurCommand(sock, chatId, message, quotedMessage);
                break;
            case userMessage.startsWith('.welcome'):
                if (isGroup) {
                    // Check admin status if not already checked
                    if (!isSenderAdmin) {
                        const adminStatus = await isAdmin(sock, chatId, senderId);
                        isSenderAdmin = adminStatus.isSenderAdmin;
                    }

                    if (isSenderAdmin || message.key.fromMe) {
                        await welcomeCommand(sock, chatId, message);
                    } else {
                        await sock.sendMessage(chatId, { text: 'Sorry, only group admins can use this command.', ...channelInfo });
                    }
                } else {
                    await sock.sendMessage(chatId, { text: 'This command can only be used in groups.', ...channelInfo });
                }
                break;
            case userMessage.startsWith('.goodbye'):
                if (isGroup) {
                    // Check admin status if not already checked
                    if (!isSenderAdmin) {
                        const adminStatus = await isAdmin(sock, chatId, senderId);
                        isSenderAdmin = adminStatus.isSenderAdmin;
                    }

                    if (isSenderAdmin || message.key.fromMe) {
                        await goodbyeCommand(sock, chatId, message);
                    } else {
                        await sock.sendMessage(chatId, { text: 'Sorry, only group admins can use this command.', ...channelInfo });
                    }
                } else {
                    await sock.sendMessage(chatId, { text: 'This command can only be used in groups.', ...channelInfo });
                }
                break;
            case userMessage === '.git':
            case userMessage === '.github':
            case userMessage === '.sc':
            case userMessage === '.script':
            case userMessage === '.repo':
                await githubCommand(sock, chatId);
                break;
            case userMessage.startsWith('.antibadword'):
                if (!isGroup) {
                    await sock.sendMessage(chatId, { text: 'This command can only be used in groups.', ...channelInfo });
                    return;
                }

                const adminStatus = await isAdmin(sock, chatId, senderId);
                isSenderAdmin = adminStatus.isSenderAdmin;
                isBotAdmin = adminStatus.isBotAdmin;

                if (!isBotAdmin) {
                    await sock.sendMessage(chatId, { text: '*Bot must be admin to use this feature*', ...channelInfo });
                    return;
                }

                await antibadwordCommand(sock, chatId, message, senderId, isSenderAdmin);
                break;
            case userMessage.startsWith('.chatbot'):
                if (!isGroup) {
                    await sock.sendMessage(chatId, { text: 'This command can only be used in groups.', ...channelInfo });
                    return;
                } 

                // Check if sender is admin or bot owner
                const chatbotAdminStatus = await isAdmin(sock, chatId, senderId);
                if (!chatbotAdminStatus.isSenderAdmin && !message.key.fromMe) {
                    await sock.sendMessage(chatId, { text: '*Only admins or bot owner can use this command*', ...channelInfo });
                    return;
                }

                const match = userMessage.slice(8).trim();
                await handleChatbotCommand(sock, chatId, message, match);
                break;
            case userMessage.startsWith('.take'):
                const takeArgs = userMessage.slice(5).trim().split(' ');
                await takeCommand(sock, chatId, message, takeArgs);
                break;
            case userMessage === '.flirt':
                await flirtCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.character'):
                await characterCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.waste'):
                await wastedCommand(sock, chatId, message);
                break;
            case userMessage === '.ship':
                if (!isGroup) {
                    await sock.sendMessage(chatId, { text: 'This command can only be used in groups!', ...channelInfo });
                    return;
                }
                await shipCommand(sock, chatId, message);
                break;
            case userMessage === '.groupinfo' || userMessage === '.infogp' || userMessage === '.infogrupo':
                if (!isGroup) {
                    await sock.sendMessage(chatId, { text: 'This command can only be used in groups!', ...channelInfo });
                    return;
                }
                await groupInfoCommand(sock, chatId, message);
                break;
            case userMessage === '.resetlink' || userMessage === '.revoke' || userMessage === '.anularlink':
                if (!isGroup) {
                    await sock.sendMessage(chatId, { text: 'This command can only be used in groups!', ...channelInfo });
                    return;
                }
                await resetlinkCommand(sock, chatId, senderId);
                break;
            case userMessage === '.staff' || userMessage === '.admins' || userMessage === '.listadmin':
                if (!isGroup) {
                    await sock.sendMessage(chatId, { text: 'This command can only be used in groups!', ...channelInfo });
                    return;
                }
                await staffCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.emojimix') || userMessage.startsWith('.emix'):
                await emojimixCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.tg') || userMessage.startsWith('.stickertelegram') || userMessage.startsWith('.tgsticker') || userMessage.startsWith('.telesticker'):
                await stickerTelegramCommand(sock, chatId, message);
                break;

            case userMessage === '.vv':
                await viewOnceCommand(sock, chatId, message);
                break;
            case userMessage === '.clearsession' || userMessage === '.clearsesi':
                await clearSessionCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.autostatus'):
                const autoStatusArgs = userMessage.split(' ').slice(1);
                await autoStatusCommand(sock, chatId, message, autoStatusArgs);
                break;
            case userMessage.startsWith('.simp'):
                await simpCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.metallic'):
                await textmakerCommand(sock, chatId, message, userMessage, 'metallic');
                break;
            case userMessage.startsWith('.ice'):
                await textmakerCommand(sock, chatId, message, userMessage, 'ice');
                break;
            case userMessage.startsWith('.snow'):
                await textmakerCommand(sock, chatId, message, userMessage, 'snow');
                break;
            case userMessage.startsWith('.impressive'):
                await textmakerCommand(sock, chatId, message, userMessage, 'impressive');
                break;
            case userMessage.startsWith('.matrix'):
                await textmakerCommand(sock, chatId, message, userMessage, 'matrix');
                break;
            case userMessage.startsWith('.light'):
                await textmakerCommand(sock, chatId, message, userMessage, 'light');
                break;
            case userMessage.startsWith('.neon'):
                await textmakerCommand(sock, chatId, message, userMessage, 'neon');
                break;
            case userMessage.startsWith('.devil'):
                await textmakerCommand(sock, chatId, message, userMessage, 'devil');
                break;
            case userMessage.startsWith('.purple'):
                await textmakerCommand(sock, chatId, message, userMessage, 'purple');
                break;
            case userMessage.startsWith('.thunder'):
                await textmakerCommand(sock, chatId, message, userMessage, 'thunder');
                break;
            case userMessage.startsWith('.leaves'):
                await textmakerCommand(sock, chatId, message, userMessage, 'leaves');
                break;
            case userMessage.startsWith('.1917'):
                await textmakerCommand(sock, chatId, message, userMessage, '1917');
                break;
            case userMessage.startsWith('.arena'):
                await textmakerCommand(sock, chatId, message, userMessage, 'arena');
                break;
            case userMessage.startsWith('.hacker'):
                await textmakerCommand(sock, chatId, message, userMessage, 'hacker');
                break;
            case userMessage.startsWith('.sand'):
                await textmakerCommand(sock, chatId, message, userMessage, 'sand');
                break;
            case userMessage.startsWith('.blackpink'):
                await textmakerCommand(sock, chatId, message, userMessage, 'blackpink');
                break;
            case userMessage.startsWith('.glitch'):
                await textmakerCommand(sock, chatId, message, userMessage, 'glitch');
                break;
            case userMessage.startsWith('.fire'):
                await textmakerCommand(sock, chatId, message, userMessage, 'fire');
                break;
            case userMessage.startsWith('.antidelete'):
                const antideleteMatch = userMessage.slice(11).trim();
                await handleAntideleteCommand(sock, chatId, message, antideleteMatch);
                break;
            case userMessage === '.surrender':
                // Handle surrender command for tictactoe game
                await handleTicTacToeMove(sock, chatId, senderId, 'surrender');
                break;
            case userMessage === '.cleartmp':
                await clearTmpCommand(sock, chatId, message);
                break;
            case userMessage === '.setpp':
                await setProfilePicture(sock, chatId, message);
                break;
            case userMessage.startsWith('.instagram') || userMessage.startsWith('.insta') || userMessage.startsWith('.ig'):
                await instagramCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.fb') || userMessage.startsWith('.facebook'):
                await facebookCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.song') || userMessage.startsWith('.music'):
                await playCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.play') || userMessage.startsWith('.mp3') || userMessage.startsWith('.ytmp3') || userMessage.startsWith('.yts'):
                await songCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.tiktok') || userMessage.startsWith('.tt'):
                await tiktokCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.gpt') || userMessage.startsWith('.gemini'):
                await aiCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.translate') || userMessage.startsWith('.trt'):
                const commandLength = userMessage.startsWith('.translate') ? 10 : 4;
                await handleTranslateCommand(sock, chatId, message, userMessage.slice(commandLength));
                return;
            case userMessage.startsWith('.ss') || userMessage.startsWith('.ssweb') || userMessage.startsWith('.screenshot'):
                const ssCommandLength = userMessage.startsWith('.screenshot') ? 11 : (userMessage.startsWith('.ssweb') ? 6 : 3);
                await handleSsCommand(sock, chatId, message, userMessage.slice(ssCommandLength).trim());
                break;
            case userMessage.startsWith('.areact') || userMessage.startsWith('.autoreact') || userMessage.startsWith('.autoreaction'):
                const isOwner = message.key.fromMe;
                await handleAreactCommand(sock, chatId, message, isOwner);
                break;
            case userMessage === '.goodnight' || userMessage === '.lovenight' || userMessage === '.gn':
                await goodnightCommand(sock, chatId, message);
                break;
            case userMessage === '.shayari' || userMessage === '.shayri':
                await shayariCommand(sock, chatId, message);
                break;
            case userMessage === '.roseday':
                await rosedayCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.imagine') || userMessage.startsWith('.flux') || userMessage.startsWith('.dalle'):
                await imagineCommand(sock, chatId, message);
                break;
            case userMessage === '.jid':
                await groupJidCommand(sock, chatId, message);
                break;

                // Function to handle .groupjid command
                async function groupJidCommand(sock, chatId, message) {
                    const groupJid = message.key.remoteJid;

                    if (!groupJid.endsWith('@g.us')) {
                        return await sock.sendMessage(chatId, {
                            text: "❌ This command can only be used in a group."
                        });
                    }

                    await sock.sendMessage(chatId, {
                        text: `✅ Group JID: ${groupJid}`
                    }, {
                        quoted: message
                    });
                }

            default:
                if (isGroup) {
                    // Handle non-command group messages
                    if (userMessage) {  // Make sure there's a message
                        await handleChatbotResponse(sock, chatId, message, userMessage, senderId);
                    }
                    await Antilink(message, sock);
                    await handleBadwordDetection(sock, chatId, message, userMessage, senderId);
                }
                break;
        }

        if (userMessage.startsWith('.')) {
            // After command is processed successfully
            await addCommandReaction(sock, message);
        }
    } catch (error) {
        console.error('❌ Error in message handler:', error.message);
        // Only try to send error message if we have a valid chatId
        if (chatId) {
            await sock.sendMessage(chatId, {
                text: '❌ Failed to process command!',
                ...channelInfo
            });
        }
    }
}

async function handleGroupParticipantUpdate(sock, update) {
    try {
        const { id, participants, action, author } = update;

        // Debug log for group updates
        /* console.log('Group Update in Main:', {
             id,
             participants,
             action,
             author
         });*/

        // Check if it's a group
        if (!id.endsWith('@g.us')) return;

        // Handle promotion events
        if (action === 'promote') {
            await handlePromotionEvent(sock, id, participants, author);
            return;
        }

        // Handle demotion events
        if (action === 'demote') {
            await handleDemotionEvent(sock, id, participants, author);
            return;
        }

        // Handle join events
        if (action === 'add') {
            // Check if welcome is enabled for this group
            const isWelcomeEnabled = await isWelcomeOn(id);
            if (!isWelcomeEnabled) return;

            // Get welcome message from data
            const data = JSON.parse(fs.readFileSync('./data/userGroupData.json'));
            const welcomeData = data.welcome[id];
            const welcomeMessage = welcomeData?.message || 'Welcome {user} to the group! 🎉';

            // Send welcome message for each new participant
            for (const participant of participants) {
                const user = participant.split('@')[0];
                const formattedMessage = welcomeMessage.replace('{user}', `@${user}`);

                await sock.sendMessage(id, {
                    text: formattedMessage,
                    mentions: [participant]
                });
            }
        }

        // Handle leave events
        if (action === 'remove') {
            // Check if goodbye is enabled for this group
            const isGoodbyeEnabled = await isGoodByeOn(id);
            if (!isGoodbyeEnabled) return;

            // Get goodbye message from data
            const data = JSON.parse(fs.readFileSync('./data/userGroupData.json'));
            const goodbyeData = data.goodbye[id];
            const goodbyeMessage = goodbyeData?.message || 'Goodbye {user} 👋';

            // Send goodbye message for each leaving participant
            for (const participant of participants) {
                const user = participant.split('@')[0];
                const formattedMessage = goodbyeMessage.replace('{user}', `@${user}`);

                await sock.sendMessage(id, {
                    text: formattedMessage,
                    mentions: [participant]
                });
            }
        }
    } catch (error) {
        console.error('Error in handleGroupParticipantUpdate:', error);
    }
}

// Instead, export the handlers along with handleMessages
module.exports = {
    handleMessages,
    handleGroupParticipantUpdate,
    handleStatus: async (sock, status) => {
        await handleStatusUpdate(sock, status);
    }
};
