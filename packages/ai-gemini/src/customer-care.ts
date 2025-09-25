// DON'T DELETE THIS COMMENT
// Follow these instructions when using this blueprint:
// - Note that the newest Gemini model series is "gemini-2.5-flash" or gemini-2.5-pro"
//   - do not change this unless explicitly requested by the user

import { GoogleGenerativeAI } from "@google/generative-ai";
import type { Tenant, Transaction, KnowledgeBase } from "../../../shared/schema";

const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export interface CustomerCareOptions {
  tenant: Tenant;
  knowledgeBase: KnowledgeBase[];
  customerNumber: string;
  conversationHistory?: Array<{ role: "user" | "assistant"; content: string }>;
}

export interface TransactionLookupResult {
  found: boolean;
  transaction?: Transaction;
  message: string;
}

export class CustomerCareBot {
  private tenant: Tenant;
  private knowledgeBase: KnowledgeBase[];

  constructor(options: CustomerCareOptions) {
    this.tenant = options.tenant;
    this.knowledgeBase = options.knowledgeBase;
  }

  private buildSystemPrompt(): string {
    const companyName = this.tenant.name;
    const knowledgeContent = this.knowledgeBase
      .filter(kb => kb.isActive)
      .map(kb => `${kb.title}: ${kb.content}`)
      .join("\n\n");

    return `You are an AI customer care assistant for ${companyName}, a professional customer service bot.

COMPANY KNOWLEDGE BASE:
${knowledgeContent}

INSTRUCTIONS:
- Always be helpful, professional, and courteous
- Use the knowledge base above to answer questions about the company
- For payment/transaction inquiries, use the track_transaction tool
- If you cannot help with something, politely offer to connect them with a human agent
- Keep responses concise but comprehensive
- Use the customer's name when available to personalize responses
- Always represent ${companyName} professionally

AVAILABLE TOOLS:
- track_transaction: Look up payment/transaction status
- create_support_ticket: Escalate to human support

Remember you are speaking with a customer via WhatsApp, so keep messages conversational but professional.`;
  }

  async generateResponse(userMessage: string, customerName?: string): Promise<string> {
    try {
      // Use gemini-2.5-flash as per blueprint specification
      const model = ai.getGenerativeModel({ model: 'gemini-2.5-flash' });
      const fullPrompt = `${this.buildSystemPrompt()}\n\nCustomer${customerName ? ` ${customerName}` : ''}: ${userMessage}`;
      
      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      const text = response.text();
      
      return text || "I apologize, but I'm having trouble processing your request. Please try again or contact our support team.";
    } catch (error) {
      console.error('Customer care bot error:', error);
      return "I'm experiencing technical difficulties. Please try again in a moment or contact our support team directly.";
    }
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