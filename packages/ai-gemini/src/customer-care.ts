// DON'T DELETE THIS COMMENT
// Follow these instructions when using this blueprint:
// - Note that the newest Gemini model series is "gemini-2.5-flash" or gemini-2.5-pro"
//   - do not change this unless explicitly requested by the user

import { GoogleGenerativeAI } from "@google/generative-ai";
import type { Tenant, Transaction, KnowledgeBase, Conversation } from "../../../shared/schema";

const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Achek Digital Solutions service definitions from services.tsx
const ACHEK_SERVICES = {
  "whatsapp-bot": {
    title: "WhatsApp Bot Development",
    description: "Custom WhatsApp bots using Baileys library for automated customer service, lead generation, and business workflows.",
    features: ["24/7 Automated Responses", "Lead Qualification", "Order Management", "Custom Integrations"],
    startingPrice: "₦150,000"
  },
  "web-development": {
    title: "Web Development", 
    description: "Modern, responsive websites and web applications built with latest technologies and best practices.",
    features: ["React & Next.js", "Mobile Responsive", "SEO Optimized", "Performance Focused"],
    startingPrice: "₦120,000"
  },
  "api-integration": {
    title: "API Integration",
    description: "Seamless integration between your systems, third-party services, and automation platforms.",
    features: ["Payment Gateways", "CRM Systems", "E-commerce Platforms", "Custom APIs"],
    startingPrice: "₦100,000"
  },
  "automation": {
    title: "Business Automation",
    description: "Streamline your operations with intelligent automation solutions and workflow optimization.",
    features: ["Process Automation", "Data Migration", "Report Generation", "Task Scheduling"],
    startingPrice: "₦200,000"
  },
  "consulting": {
    title: "Digital Consulting",
    description: "Strategic guidance to help you choose the right technology stack and implementation approach.",
    features: ["Technology Audit", "Architecture Planning", "Strategy Development", "ROI Analysis"],
    startingPrice: "₦80,000"
  },
  "support": {
    title: "Support & Maintenance",
    description: "Ongoing support, updates, and maintenance to keep your digital solutions running smoothly.",
    features: ["24/7 Monitoring", "Regular Updates", "Bug Fixes", "Performance Optimization"],
    startingPrice: "₦50,000/month"
  }
};

export interface CustomerCareOptions {
  tenant: Tenant;
  knowledgeBase: KnowledgeBase[];
  customerNumber: string;
  conversation?: Conversation;
  conversationHistory?: Array<{ role: "user" | "assistant"; content: string }>;
}

export interface TransactionLookupResult {
  found: boolean;
  transaction?: Transaction;
  message: string;
}

export interface ProjectInformation {
  serviceType: string;
  projectDetails?: string;
  budget?: string;
  timeline?: string;
  businessName?: string;
  contactInfo?: {
    name?: string;
    email?: string;
    whatsapp?: string;
  };
  requirements?: string[];
  needsQuote?: boolean;
}

export interface TeamNotification {
  type: 'payment_received' | 'new_project' | 'support_ticket' | 'urgent_inquiry';
  customer: {
    name: string;
    whatsapp: string;
    email?: string;
  };
  service: string;
  details: string;
  amount?: number;
  urgency: 'low' | 'medium' | 'high';
}

export class CustomerCareBot {
  private tenant: Tenant;
  private knowledgeBase: KnowledgeBase[];
  private conversationHistory: Array<{ role: "user" | "assistant"; content: string }>;

  constructor(options: CustomerCareOptions) {
    this.tenant = options.tenant;
    this.knowledgeBase = options.knowledgeBase;
    this.conversationHistory = options.conversationHistory || [];
  }

  private buildSystemPrompt(): string {
    const companyName = this.tenant.name || "Achek Digital Solutions";
    const knowledgeContent = this.knowledgeBase
      .filter(kb => kb.isActive)
      .map(kb => `${kb.title}: ${kb.content}`)
      .join("\n\n");

    return `You are an AI customer care assistant for ${companyName}, Nigeria's premier digital solutions provider.

COMPANY INFORMATION:
- Company: Achek Digital Solutions
- Founder: Caleb O. (Caleb-Founder)
- Location: Nigeria (serving clients globally)  
- WhatsApp: +2348104040841
- Email: hello@achekdigital.com
- Website: Available 24/7 via our intelligent bot

SERVICES & PRICING:
${Object.entries(ACHEK_SERVICES).map(([key, service]) => 
  `${service.title}: ${service.description} Features: ${service.features.join(', ')} Starting from ${service.startingPrice}`
).join('\n')}

ADDITIONAL KNOWLEDGE BASE:
${knowledgeContent}

YOUR CAPABILITIES:
1. ANSWER QUESTIONS: Provide detailed information about all Achek services, pricing, features, and processes
2. PROJECT GUIDANCE: Help customers understand what service they need and guide them through requirements
3. COLLECT INFORMATION: Gather customer details, project requirements, and preferences before proposing solutions
4. TRACK TRANSACTIONS: Look up payment status and send receipt confirmations
5. PROCESS PAYMENTS: Guide users through payment options and confirm successful transactions
6. TEAM COORDINATION: Create tickets and notify available team members for project start or urgent issues
7. AUTOMATED MARKETING: Send relevant service updates and promotional content
8. LEAD QUALIFICATION: Assess project scope, budget, and timeline to provide accurate quotes

CONVERSATION FLOW:
- Greet customers warmly and ask how you can help
- If asking about services: Explain options, ask about their specific needs, provide pricing
- If interested in a project: Collect full details (business name, contact info, requirements, budget, timeline)
- After information collection: Provide quote and guide through payment process  
- After payment: Immediately notify team with all project details and customer information
- For support issues: Create ticket or escalate to available team member
- Always end with next steps and availability for further assistance

INSTRUCTIONS:
- Be conversational but professional - you're chatting via WhatsApp
- Use emojis appropriately to make conversations friendly
- Ask qualifying questions to understand exact needs
- Provide specific examples of previous work when relevant
- Always confirm understanding before proceeding to next steps
- If payment is made without prior contact, immediately message with project confirmation
- Create urgency appropriately for limited-time offers or quick turnaround projects
- Guide customers through the entire process from inquiry to project completion

Remember: You represent Achek's commitment to excellent customer service and technical expertise.`;
  }

  async generateResponse(userMessage: string, customerName?: string): Promise<string> {
    try {
      // Use gemini-2.5-flash as per blueprint specification - simplified approach for now
      const model = ai.getGenerativeModel({ model: 'gemini-2.5-flash' });

      const conversationHistory = this.conversationHistory || [];
      const contextPrompt = conversationHistory.length > 0 
        ? `Previous conversation:\n${conversationHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n')}\n\n`
        : '';
      
      const fullPrompt = `${this.buildSystemPrompt()}\n\n${contextPrompt}Customer${customerName ? ` ${customerName}` : ''}: ${userMessage}`;
      
      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      const text = response.text();

      // For now, use intelligent parsing to detect intent and handle accordingly
      const intent = this.detectIntent(userMessage, text);
      if (intent) {
        return await this.handleIntent(intent, userMessage);
      }

      return text || "I apologize, but I'm having trouble processing your request. Please try again or contact our support team at +2348104040841.";
    } catch (error) {
      console.error('Customer care bot error:', error);
      return "I'm experiencing technical difficulties. Please try again in a moment or contact our support team directly at +2348104040841. 🔧";
    }
  }

  private detectIntent(userMessage: string, botResponse: string): string | null {
    const message = userMessage.toLowerCase();
    
    // Payment and transaction related
    if (message.includes('payment') || message.includes('transaction') || message.includes('receipt')) {
      return 'track_transaction';
    }
    
    // Project inquiry
    if (message.includes('website') || message.includes('app') || message.includes('project') || message.includes('quote')) {
      return 'collect_project_info';
    }
    
    // Support request
    if (message.includes('help') || message.includes('support') || message.includes('problem') || message.includes('issue')) {
      return 'create_support_ticket';
    }
    
    // Ready to start project
    if (message.includes('start') || message.includes('begin') || message.includes('proceed')) {
      return 'notify_team';
    }
    
    return null;
  }

  private async handleIntent(intent: string, userMessage: string): Promise<string> {
    switch (intent) {
      case "track_transaction":
        return await this.lookupTransaction(undefined, undefined).then(result => result.message);

      case "collect_project_info":
        return `I'd be happy to help you with your project! Let me gather some details:

🏢 **What's your business name?**
📱 **What type of project do you need?**
   • Website Development
   • Mobile App
   • WhatsApp Bot
   • API Integration
   • Business Automation
   
💰 **What's your budget range?**
🕒 **When do you need this completed?**

Please share these details so I can provide you with the best solution! 📋`;

      case "create_support_ticket":
        return await this.createSupportTicket({
          reason: userMessage,
          priority: 'medium',
          customerInfo: { name: 'Customer', whatsapp: 'From WhatsApp', email: '' }
        });

      case "notify_team":
        return await this.sendTeamNotification({
          type: 'new_project',
          customer: { name: 'Customer', whatsapp: 'From WhatsApp' },
          service: 'General Inquiry',
          details: userMessage,
          urgency: 'medium'
        });

      default:
        return "I understand you need assistance. Let me connect you with our support team for immediate help.";
    }
  }

  private async processProjectInfo(projectInfo: ProjectInformation): Promise<string> {
    // Store project information and guide customer through next steps
    const service = ACHEK_SERVICES[projectInfo.serviceType as keyof typeof ACHEK_SERVICES];
    
    if (!service) {
      return `Thank you for the information! Let me connect you with our team to discuss your ${projectInfo.serviceType} requirements. We'll review your needs and provide a custom solution. 📋`;
    }

    return `Perfect! I have all the details for your ${service.title} project:

✅ Business: ${projectInfo.businessName || 'Your Business'}
✅ Service: ${service.title}
✅ Budget Range: ${projectInfo.budget || 'To be discussed'}
✅ Timeline: ${projectInfo.timeline || 'Flexible'}

Based on your requirements, here's what we can do:
${service.features.map(feature => `• ${feature}`).join('\n')}

Starting price: ${service.startingPrice}

Would you like me to:
1. 💰 Provide a detailed quote
2. 🏃‍♂️ Start the project process  
3. 📞 Connect you with our team for consultation

Reply with 1, 2, or 3 to proceed!`;
  }

  private async generateCustomQuote(quoteInfo: any): Promise<string> {
    const service = ACHEK_SERVICES[quoteInfo.serviceType as keyof typeof ACHEK_SERVICES];
    if (!service) {
      return "I'll need to connect you with our team for a custom quote on this specialized service.";
    }

    const basePrice = parseInt(service.startingPrice.replace(/[^0-9]/g, '')) || 100000;
    const complexityMultiplier = {
      basic: 1,
      standard: 1.5, 
      premium: 2,
      custom: 2.5
    }[quoteInfo.projectComplexity] || 1;

    const estimatedPrice = Math.round(basePrice * complexityMultiplier);

    return `📋 **Custom Quote for ${service.title}**

**Project Details:**
• Complexity: ${quoteInfo.projectComplexity.charAt(0).toUpperCase() + quoteInfo.projectComplexity.slice(1)}
• Estimated Hours: ${quoteInfo.estimatedHours || 'TBD'}
• Additional Features: ${quoteInfo.additionalFeatures?.join(', ') || 'Standard features'}

**Investment:** ₦${estimatedPrice.toLocaleString()}

**What's Included:**
${service.features.map(feature => `✅ ${feature}`).join('\n')}

**Next Steps:**
1. 💳 Proceed with payment to start immediately
2. 📞 Schedule a consultation call
3. 📝 Request project modifications

*Payment secures your spot in our development queue. We'll begin work within 24 hours of confirmed payment.*

Ready to get started? 🚀`;
  }

  private async sendTeamNotification(notification: TeamNotification): Promise<string> {
    // This would integrate with your team notification system
    // For now, return confirmation message
    const urgencyEmoji = {
      low: '📝',
      medium: '⚡',
      high: '🚨'
    }[notification.urgency] || '📝';

    console.log('TEAM NOTIFICATION:', {
      type: notification.type,
      customer: notification.customer,
      service: notification.service,
      urgency: notification.urgency,
      details: notification.details
    });

    return `${urgencyEmoji} Team notification sent! Our available team members have been alerted about your ${notification.service} project. 

**What happens next:**
• Team reviews your requirements (within 2 hours)
• Project manager assigns appropriate developer
• You'll receive project timeline and milestones
• Regular updates via WhatsApp throughout development

**Your project reference:** ADS-${Date.now()}

You'll hear from us very soon! 🎯`;
  }

  private async createSupportTicket(ticketInfo: any): Promise<string> {
    const ticketId = `TICKET-${Date.now()}`;
    
    console.log('SUPPORT TICKET CREATED:', {
      id: ticketId,
      reason: ticketInfo.reason,
      priority: ticketInfo.priority,
      customer: ticketInfo.customerInfo
    });

    return `🎫 Support ticket created: ${ticketId}

**Priority:** ${ticketInfo.priority.toUpperCase()}
**Issue:** ${ticketInfo.reason}

Our support team will contact you within:
• High priority: 30 minutes ⚡
• Medium priority: 2 hours 🕐
• Low priority: 24 hours 📅

You can also reach us directly:
📱 WhatsApp: +2348104040841
✉️ Email: hello@achekdigital.com

We're here to help! 💪`;
  }

  private async lookupTransaction(transactionId?: string, customerEmail?: string): Promise<TransactionLookupResult> {
    // This would integrate with your actual transaction database/API
    // For now, return a placeholder response
    if (transactionId) {
      return {
        found: false,
        message: `I'm looking up transaction ${transactionId}. Our systems are currently being updated. Please contact support for immediate assistance with your transaction inquiry.`
      };
    }
    
    if (customerEmail) {
      return {
        found: false,
        message: `I'm looking up transactions for ${customerEmail}. Our systems are currently being updated. Please contact support for immediate assistance with your transaction inquiry.`
      };
    }

    return {
      found: false,
      message: "Please provide either a transaction ID or your email address to look up your transaction."
    };
  }

  async analyzeMessageSentiment(message: string): Promise<{ rating: number; confidence: number }> {
    try {
      const model = ai.getGenerativeModel({ model: 'gemini-2.5-flash' });
      
      const prompt = `Analyze the sentiment of this customer message and provide a rating from 1 (very negative) to 5 (very positive) and a confidence score between 0 and 1.

Message: "${message}"

Respond with JSON format: {"rating": number, "confidence": number}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      if (text) {
        // Try to extract JSON from the response
        const jsonMatch = text.match(/\{.*\}/);
        if (jsonMatch) {
          const sentiment = JSON.parse(jsonMatch[0]);
          return {
            rating: sentiment.rating || 3,
            confidence: sentiment.confidence || 0.5
          };
        }
      }
    } catch (error) {
      console.error('Sentiment analysis error:', error);
    }

    return { rating: 3, confidence: 0.5 }; // Neutral fallback
  }
}

export async function createCustomerCareBot(options: CustomerCareOptions): Promise<CustomerCareBot> {
  return new CustomerCareBot(options);
}