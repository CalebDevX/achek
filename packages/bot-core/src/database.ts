// Database connection and repository layer for multi-tenant bot system
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { eq, and, desc } from 'drizzle-orm';
import * as schema from '../../../shared/schema';
import { decryptWhatsAppTokens, encryptWhatsAppTokens } from '../../ai-gemini/src/encryption';
import type { 
  Tenant, 
  WhatsappConnection, 
  Conversation, 
  WhatsappMessage,
  Transaction,
  KnowledgeBase,
  InsertConversation,
  InsertWhatsappMessage,
  InsertTransaction
} from '../../../shared/schema';

// Database connection
const connection = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root', 
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'achek_bot',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export const db = drizzle(connection, { schema, mode: 'default' });

// Repository classes for database operations
export class TenantRepository {
  async getTenant(tenantId: string): Promise<Tenant | null> {
    try {
      const result = await db.select().from(schema.tenants).where(eq(schema.tenants.id, tenantId)).limit(1);
      return result[0] || null;
    } catch (error) {
      console.error('Error fetching tenant:', error);
      return null;
    }
  }

  async createTenant(tenant: Omit<Tenant, 'createdAt' | 'updatedAt'>): Promise<Tenant | null> {
    try {
      const now = new Date();
      await db.insert(schema.tenants).values({
        ...tenant,
        createdAt: now,
        updatedAt: now
      });
      return await this.getTenant(tenant.id);
    } catch (error) {
      console.error('Error creating tenant:', error);
      return null;
    }
  }
}

export class WhatsAppConnectionRepository {
  async getConnection(tenantId: string): Promise<{accessToken: string, verifyToken: string, phoneNumberId: string} | null> {
    try {
      const result = await db.select()
        .from(schema.whatsappConnections)
        .where(eq(schema.whatsappConnections.tenantId, tenantId))
        .limit(1);
      
      if (!result[0]) return null;
      
      const connection = result[0];
      const { accessToken, verifyToken } = decryptWhatsAppTokens(
        connection.accessTokenEncrypted,
        connection.verifyTokenEncrypted
      );
      
      return {
        accessToken,
        verifyToken,
        phoneNumberId: connection.phoneNumberId
      };
    } catch (error) {
      console.error('Error fetching WhatsApp connection:', error);
      return null;
    }
  }

  async createConnection(
    tenantId: string,
    phoneNumberId: string,
    accessToken: string,
    verifyToken: string,
    webhookUrl?: string
  ): Promise<boolean> {
    try {
      const { accessTokenEncrypted, verifyTokenEncrypted } = encryptWhatsAppTokens(accessToken, verifyToken);
      
      await db.insert(schema.whatsappConnections).values({
        id: `conn_${tenantId}_${Date.now()}`,
        tenantId,
        phoneNumberId,
        accessTokenEncrypted,
        verifyTokenEncrypted,
        webhookUrl,
        status: 'active',
        createdAt: new Date()
      });
      
      return true;
    } catch (error) {
      console.error('Error creating WhatsApp connection:', error);
      return false;
    }
  }
}

export class ConversationRepository {
  async getOrCreateConversation(tenantId: string, whatsappNumber: string, customerName?: string): Promise<Conversation | null> {
    try {
      // Try to find existing conversation
      const existing = await db.select()
        .from(schema.conversations)
        .where(and(
          eq(schema.conversations.tenantId, tenantId),
          eq(schema.conversations.whatsappNumber, whatsappNumber)
        ))
        .limit(1);
      
      if (existing[0]) {
        // Update last message time
        await db.update(schema.conversations)
          .set({ lastMessageAt: new Date() })
          .where(eq(schema.conversations.id, existing[0].id));
        
        return existing[0];
      }
      
      // Create new conversation
      const conversationId = `conv_${tenantId}_${Date.now()}`;
      const newConversation: InsertConversation = {
        id: conversationId,
        tenantId,
        whatsappNumber,
        customerName,
        status: 'active',
        lastMessageAt: new Date(),
        createdAt: new Date()
      };
      
      await db.insert(schema.conversations).values(newConversation);
      return await this.getConversation(conversationId);
    } catch (error) {
      console.error('Error getting/creating conversation:', error);
      return null;
    }
  }

  async getConversation(conversationId: string): Promise<Conversation | null> {
    try {
      const result = await db.select()
        .from(schema.conversations)
        .where(eq(schema.conversations.id, conversationId))
        .limit(1);
      
      return result[0] || null;
    } catch (error) {
      console.error('Error fetching conversation:', error);
      return null;
    }
  }

  async getConversationHistory(conversationId: string, limit: number = 10): Promise<WhatsappMessage[]> {
    try {
      return await db.select()
        .from(schema.whatsappMessages)
        .where(eq(schema.whatsappMessages.conversationId, conversationId))
        .orderBy(desc(schema.whatsappMessages.createdAt))
        .limit(limit);
    } catch (error) {
      console.error('Error fetching conversation history:', error);
      return [];
    }
  }
}

export class MessageRepository {
  async saveMessage(
    conversationId: string,
    tenantId: string,
    messageId: string | undefined,
    type: string,
    content: string,
    direction: 'inbound' | 'outbound',
    metadata?: any
  ): Promise<boolean> {
    try {
      const message: InsertWhatsappMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        conversationId,
        tenantId,
        messageId,
        type,
        content,
        direction,
        status: 'sent',
        metadata,
        createdAt: new Date()
      };
      
      await db.insert(schema.whatsappMessages).values(message);
      return true;
    } catch (error) {
      console.error('Error saving message:', error);
      return false;
    }
  }
}

export class TransactionRepository {
  async getTransaction(tenantId: string, transactionId: string): Promise<Transaction | null> {
    try {
      const result = await db.select()
        .from(schema.transactions)
        .where(and(
          eq(schema.transactions.tenantId, tenantId),
          eq(schema.transactions.transactionId, transactionId)
        ))
        .limit(1);
      
      return result[0] || null;
    } catch (error) {
      console.error('Error fetching transaction:', error);
      return null;
    }
  }

  async createTransaction(
    tenantId: string,
    conversationId: string | undefined,
    transactionId: string,
    amount: number,
    currency: string,
    status: string,
    customerEmail?: string,
    paymentMethod?: string,
    metadata?: any
  ): Promise<boolean> {
    try {
      const transaction: InsertTransaction = {
        id: `txn_${Date.now()}`,
        tenantId,
        conversationId,
        transactionId,
        amount,
        currency,
        status,
        paymentMethod,
        customerEmail,
        metadata,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await db.insert(schema.transactions).values(transaction);
      return true;
    } catch (error) {
      console.error('Error creating transaction:', error);
      return false;
    }
  }

  async getTransactionsByEmail(tenantId: string, customerEmail: string): Promise<Transaction[]> {
    try {
      return await db.select()
        .from(schema.transactions)
        .where(and(
          eq(schema.transactions.tenantId, tenantId),
          eq(schema.transactions.customerEmail, customerEmail)
        ))
        .orderBy(desc(schema.transactions.createdAt))
        .limit(10);
    } catch (error) {
      console.error('Error fetching transactions by email:', error);
      return [];
    }
  }
}

export class KnowledgeBaseRepository {
  async getKnowledgeBase(tenantId: string): Promise<KnowledgeBase[]> {
    try {
      return await db.select()
        .from(schema.knowledgeBase)
        .where(and(
          eq(schema.knowledgeBase.tenantId, tenantId),
          eq(schema.knowledgeBase.isActive, true)
        ))
        .orderBy(schema.knowledgeBase.category, schema.knowledgeBase.title);
    } catch (error) {
      console.error('Error fetching knowledge base:', error);
      return [];
    }
  }
}

// Initialize database repositories
export const tenantRepo = new TenantRepository();
export const whatsappRepo = new WhatsAppConnectionRepository();
export const conversationRepo = new ConversationRepository();
export const messageRepo = new MessageRepository();
export const transactionRepo = new TransactionRepository();
export const knowledgeRepo = new KnowledgeBaseRepository();