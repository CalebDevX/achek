import { makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import pino from 'pino';
import qrcode from 'qrcode';
import path from 'path';

export interface WhatsAppBot {
  sock: any;
  qrCode: string | null;
  isConnected: boolean;
  connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'qr_required';
  sendMessage: (to: string, message: string) => Promise<void>;
  generateQR: () => Promise<string>;
  disconnect: () => Promise<void>;
}

class WhatsAppBotService {
  private bot: WhatsAppBot | null = null;
  private sessionPath = path.join(process.cwd(), 'session');

  async initialize(): Promise<WhatsAppBot> {
    if (this.bot) {
      return this.bot;
    }

    const { state, saveCreds } = await useMultiFileAuthState(this.sessionPath);
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
      version,
      logger: pino({ level: 'silent' }),
      printQRInTerminal: false,
      auth: state,
      generateHighQualityLinkPreview: true,
    });

    this.bot = {
      sock,
      qrCode: null,
      isConnected: false,
      connectionStatus: 'disconnected',
      sendMessage: async (to: string, message: string) => {
        if (!this.bot?.isConnected) {
          throw new Error('Bot is not connected');
        }
        
        // Ensure phone number format (add @s.whatsapp.net if not present)
        const chatId = to.includes('@') ? to : `${to}@s.whatsapp.net`;
        
        await sock.sendMessage(chatId, { text: message });
      },
      generateQR: async () => {
        if (this.bot?.qrCode) {
          return this.bot.qrCode;
        }
        throw new Error('QR code not available');
      },
      disconnect: async () => {
        if (sock) {
          await sock.logout();
        }
        this.bot = null;
      }
    };

    // Handle QR code generation
    sock.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr && this.bot) {
        // Generate QR code as data URL
        this.bot.qrCode = await qrcode.toDataURL(qr);
        this.bot.connectionStatus = 'qr_required';
      }

      if (connection === 'close') {
        const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
        
        if (this.bot) {
          this.bot.isConnected = false;
          this.bot.connectionStatus = 'disconnected';
        }

        if (shouldReconnect) {
          console.log('WhatsApp bot reconnecting...');
          this.bot = null;
          await this.initialize();
        }
      } else if (connection === 'open') {
        console.log('WhatsApp bot connected successfully!');
        if (this.bot) {
          this.bot.isConnected = true;
          this.bot.connectionStatus = 'connected';
          this.bot.qrCode = null;
        }
      }
    });

    // Handle credentials update
    sock.ev.on('creds.update', saveCreds);

    // Handle incoming messages
    sock.ev.on('messages.upsert', async (m) => {
      const message = m.messages[0];
      if (!message.message || message.key.fromMe) return;

      const messageText = message.message.conversation || 
                         message.message.extendedTextMessage?.text || '';
      
      const from = message.key.remoteJid;
      
      // Auto-reply logic
      await this.handleIncomingMessage(from!, messageText);
    });

    return this.bot;
  }

  private async handleIncomingMessage(from: string, messageText: string) {
    if (!this.bot?.isConnected) return;

    const lowerMessage = messageText.toLowerCase();
    let reply = '';

    // Simple auto-reply logic
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      reply = `👋 Hello! Welcome to Achek Digital Solutions!\n\nI'm here to help you with:\n🌐 Web Development\n📱 Mobile Apps\n🤖 WhatsApp Bots\n🎨 Digital Marketing\n\nHow can I assist you today?`;
    } else if (lowerMessage.includes('service') || lowerMessage.includes('what do you do')) {
      reply = `🚀 Our Services:\n\n1. 🌐 Web Development\n2. 📱 Mobile App Development\n3. 🤖 WhatsApp Bot Development\n4. 🎨 UI/UX Design\n5. 📊 Digital Marketing\n6. ☁️ Cloud Solutions\n\nType "pricing" for rates or "contact" to speak with our team!`;
    } else if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('rate')) {
      reply = `💰 Our Starting Rates:\n\n🌐 Website: $500+\n📱 Mobile App: $1000+\n🤖 WhatsApp Bot: $200+\n🎨 Logo Design: $50+\n📊 SEO Package: $300/month\n\nPrices vary based on complexity. Contact us for a detailed quote!`;
    } else if (lowerMessage.includes('contact') || lowerMessage.includes('human') || lowerMessage.includes('speak')) {
      reply = `📞 Contact Our Team:\n\n📧 Email: info@achek.com.ng\n📱 WhatsApp: +234-XXX-XXXX\n🌐 Website: https://achek.com.ng\n\nOur team will get back to you within 24 hours!`;
    } else {
      reply = `Thanks for your message! 😊\n\nI understand you said: "${messageText}"\n\nFor immediate assistance, try:\n• "services" - View our offerings\n• "pricing" - Get rates\n• "contact" - Speak with our team\n\nOr simply describe what you need help with!`;
    }

    // Send reply
    try {
      await this.bot.sendMessage(from, reply);
    } catch (error) {
      console.error('Error sending auto-reply:', error);
    }
  }

  getBot(): WhatsAppBot | null {
    return this.bot;
  }

  async getStatus() {
    if (!this.bot) {
      return { status: 'not_initialized', isConnected: false };
    }

    return {
      status: this.bot.connectionStatus,
      isConnected: this.bot.isConnected,
      hasQR: !!this.bot.qrCode
    };
  }
}

export const whatsappBotService = new WhatsAppBotService();