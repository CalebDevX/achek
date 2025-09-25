import express from 'express';
import cors from 'cors';
import { WhatsAppCloudAPIAdapter, WhatsAppBroadcast } from '../../../packages/bot-core/src/whatsapp-adapter';
import { CustomerCareBot } from '../../../packages/ai-gemini/src/customer-care';
import { 
  tenantRepo, 
  whatsappRepo, 
  conversationRepo, 
  messageRepo, 
  transactionRepo, 
  knowledgeRepo 
} from '../../../packages/bot-core/src/database';
import type { Tenant, KnowledgeBase } from '../../../shared/schema';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());

// Use raw body parser for webhook routes to properly verify signatures
app.use('/webhook/whatsapp', express.raw({ type: 'application/json' }));

// JSON parser for other routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Store for active bots (in production, this would be a cache/database)
const activeBots = new Map<string, CustomerCareBot>();

// Helper function to get tenant tokens from database
async function getTenantTokens(tenantId: string): Promise<{accessToken: string, verifyToken: string, phoneNumberId: string}> {
  const connection = await whatsappRepo.getConnection(tenantId);
  if (connection) {
    return connection;
  }
  
  // Fallback to environment variables for default tenant
  return {
    accessToken: process.env.WHATSAPP_ACCESS_TOKEN || '',
    verifyToken: process.env.WHATSAPP_VERIFY_TOKEN || '',
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || ''
  };
}

// Initialize WhatsApp adapter
const whatsappAdapter = new WhatsAppCloudAPIAdapter(
  async (tenantId: string) => {
    const tokens = await getTenantTokens(tenantId);
    return tokens.accessToken;
  },
  async (tenantId: string) => {
    const tokens = await getTenantTokens(tenantId);
    return tokens.phoneNumberId;
  }
);

// Get or create bot for tenant with database integration
async function getBotForTenant(tenantId: string, customerNumber?: string, conversationId?: string): Promise<CustomerCareBot> {
  const botKey = `${tenantId}_${customerNumber || 'default'}`;
  
  if (activeBots.has(botKey)) {
    return activeBots.get(botKey)!;
  }

  // Get tenant from database
  let tenant = await tenantRepo.getTenant(tenantId);
  if (!tenant) {
    // Create default tenant if not exists
    tenant = await tenantRepo.createTenant({
      id: tenantId,
      name: 'Achek Digital Solutions',
      domain: 'achekdigital.com',
      status: 'active',
      settings: null
    });
  }

  if (!tenant) {
    throw new Error(`Failed to create/get tenant: ${tenantId}`);
  }

  // Get knowledge base from database
  const knowledgeBase = await knowledgeRepo.getKnowledgeBase(tenantId);
  
  // Get conversation history if available
  let conversationHistory: Array<{ role: "user" | "assistant"; content: string }> = [];
  if (conversationId) {
    const messages = await conversationRepo.getConversationHistory(conversationId, 5);
    conversationHistory = messages.map(msg => ({
      role: msg.direction === 'inbound' ? 'user' as const : 'assistant' as const,
      content: msg.content || ''
    }));
  }

  const bot = new CustomerCareBot({
    tenant,
    knowledgeBase,
    customerNumber: customerNumber || '',
    conversationHistory
  });

  activeBots.set(botKey, bot);
  return bot;
}

// WhatsApp Webhook Verification (GET)
app.get('/webhook/whatsapp/:tenantId', (req, res) => {
  const { tenantId } = req.params;
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  console.log(`Webhook verification for tenant ${tenantId}:`, { mode, token, challenge });

  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN || 'achek_verify_token';
  const challengeResponse = whatsappAdapter.verifyChallenge(
    mode as string,
    token as string,
    challenge as string,
    verifyToken
  );

  if (challengeResponse) {
    res.status(200).send(challengeResponse);
  } else {
    res.status(403).send('Verification failed');
  }
});

// WhatsApp Webhook Handler (POST)
app.post('/webhook/whatsapp/:tenantId', async (req, res) => {
  const { tenantId } = req.params;
  
  try {
    // Verify webhook signature using raw body
    const signature = req.headers['x-hub-signature-256'] as string;
    const rawBody = req.body.toString('utf8');
    const appSecret = process.env.WHATSAPP_APP_SECRET || 'default_app_secret';
    
    if (!whatsappAdapter.verifyWebhook(signature, rawBody, appSecret)) {
      console.error(`Webhook signature verification failed for tenant ${tenantId}`);
      return res.status(403).send('Unauthorized');
    }

    const webhookData = JSON.parse(rawBody);
    console.log(`Processing webhook for tenant ${tenantId}:`, JSON.stringify(webhookData, null, 2));

    // Process incoming messages
    const messages = await whatsappAdapter.processIncomingMessage(webhookData);
    
    for (const message of messages) {
      if (message.type === 'text' && message.text?.body) {
        try {
          // Get or create conversation
          const conversation = await conversationRepo.getOrCreateConversation(
            tenantId, 
            message.from,
            `Customer ${message.from.slice(-4)}`
          );
          
          if (!conversation) {
            console.error(`Failed to create conversation for ${message.from}`);
            continue;
          }

          // Save incoming message
          await messageRepo.saveMessage(
            conversation.id,
            tenantId,
            message.id,
            message.type,
            message.text.body,
            'inbound',
            { timestamp: message.timestamp }
          );

          // Get bot for this tenant with conversation context
          const bot = await getBotForTenant(tenantId, message.from, conversation.id);
          
          // Generate AI response
          const response = await bot.generateResponse(message.text.body);
          
          // Send response back
          await whatsappAdapter.sendMessage(message.from, response, tenantId);
          
          // Save outgoing message
          await messageRepo.saveMessage(
            conversation.id,
            tenantId,
            undefined,
            'text',
            response,
            'outbound'
          );
          
          console.log(`Processed message from ${message.from} - Response sent: ${response.substring(0, 100)}...`);
        } catch (error) {
          console.error(`Error processing message from ${message.from}:`, error);
          
          // Send fallback response
          try {
            await whatsappAdapter.sendMessage(
              message.from, 
              "I'm experiencing technical difficulties. Please try again in a moment or contact our support team directly at +2348104040841. 🔧",
              tenantId
            );
          } catch (fallbackError) {
            console.error(`Failed to send fallback response:`, fallbackError);
          }
        }
      }
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error(`Webhook processing error for tenant ${tenantId}:`, error);
    res.status(500).send('Internal Server Error');
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'Achek WhatsApp Bot API',
    activeBots: activeBots.size
  });
});

// Bot status endpoint  
app.get('/api/whatsapp/status', (req, res) => {
  res.json({
    connected: true,
    activeBots: activeBots.size,
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Authentication middleware for admin endpoints
function authenticateAdmin(req: any, res: any, next: any) {
  const authHeader = req.headers.authorization;
  const validApiKey = process.env.ADMIN_API_KEY || 'achek-admin-key-2024';
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid authorization header' });
  }
  
  const token = authHeader.split(' ')[1];
  if (token !== validApiKey) {
    return res.status(401).json({ error: 'Invalid API key' });
  }
  
  next();
}

// Manual message sending endpoint (authenticated)
app.post('/api/send-message', authenticateAdmin, async (req, res) => {
  try {
    const { to, message, tenantId = 'achek-default' } = req.body;
    
    if (!to || !message) {
      return res.status(400).json({ error: 'Missing required fields: to, message' });
    }

    // Validate phone number format
    if (!/^\+[1-9]\d{1,14}$/.test(to)) {
      return res.status(400).json({ error: 'Invalid phone number format. Use international format: +1234567890' });
    }

    await whatsappAdapter.sendMessage(to, message, tenantId);
    
    res.json({ 
      success: true, 
      message: 'Message sent successfully',
      to,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Manual message send error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Newsletter broadcast endpoint (authenticated)
app.post('/api/broadcast-newsletter', authenticateAdmin, async (req, res) => {
  try {
    const { subscribers, templateName, content, tenantId = 'achek-default' } = req.body;
    
    if (!subscribers || !Array.isArray(subscribers)) {
      return res.status(400).json({ error: 'Invalid subscribers array' });
    }

    // Validate subscriber limit
    if (subscribers.length > 1000) {
      return res.status(400).json({ error: 'Maximum 1000 subscribers per broadcast' });
    }

    // Validate phone numbers
    const invalidNumbers = subscribers.filter((num: string) => !/^\+[1-9]\d{1,14}$/.test(num));
    if (invalidNumbers.length > 0) {
      return res.status(400).json({ 
        error: 'Invalid phone numbers found', 
        invalidNumbers: invalidNumbers.slice(0, 5) // Show first 5 invalid numbers
      });
    }

    const broadcast = new WhatsAppBroadcast(whatsappAdapter);
    const result = await broadcast.sendNewsletter(subscribers, templateName || 'newsletter', content || [], tenantId);
    
    res.json({ 
      success: true, 
      ...result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Newsletter broadcast error:', error);
    res.status(500).json({ error: 'Failed to send newsletter' });
  }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Achek WhatsApp Bot API running on port ${PORT}`);
  console.log(`📱 Webhook URL: /webhook/whatsapp/:tenantId`);
  console.log(`💊 Health check: /health`);
  console.log(`🤖 Bot status: /api/whatsapp/status`);
});

export default app;