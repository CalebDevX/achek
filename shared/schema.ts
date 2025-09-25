import { sql, relations } from "drizzle-orm";
import { text, varchar, serial, timestamp, boolean, int, mysqlTable, json, index, uniqueIndex } from "drizzle-orm/mysql-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Multi-tenant tables for commercial WhatsApp bot

// Tenants table - each customer organization
export const tenants = mysqlTable("tenants", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  domain: varchar("domain", { length: 255 }).unique(),
  status: varchar("status", { length: 50 }).default("active"),
  settings: json("settings"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`),
});

// WhatsApp connections per tenant
export const whatsappConnections = mysqlTable("whatsapp_connections", {
  id: varchar("id", { length: 36 }).primaryKey(),
  tenantId: varchar("tenant_id", { length: 36 }).notNull().references(() => tenants.id, { onDelete: "cascade" }),
  phoneNumberId: varchar("phone_number_id", { length: 255 }).notNull(),
  accessTokenEncrypted: text("access_token_encrypted").notNull(), // Encrypted access token
  verifyTokenEncrypted: varchar("verify_token_encrypted", { length: 500 }).notNull(), // Encrypted verify token
  webhookUrl: varchar("webhook_url", { length: 500 }),
  status: varchar("status", { length: 50 }).default("active"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
  tenantIdIdx: index("whatsapp_connections_tenant_id_idx").on(table.tenantId),
  uniqueTenantPhone: uniqueIndex("whatsapp_connections_tenant_phone_unique").on(table.tenantId, table.phoneNumberId),
}));

// Conversations for each tenant
export const conversations = mysqlTable("conversations", {
  id: varchar("id", { length: 36 }).primaryKey(),
  tenantId: varchar("tenant_id", { length: 36 }).notNull().references(() => tenants.id, { onDelete: "cascade" }),
  whatsappNumber: varchar("whatsapp_number", { length: 50 }).notNull(),
  customerName: varchar("customer_name", { length: 255 }),
  status: varchar("status", { length: 50 }).default("active"),
  lastMessageAt: timestamp("last_message_at"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
  tenantIdIdx: index("conversations_tenant_id_idx").on(table.tenantId),
  createdAtIdx: index("conversations_created_at_idx").on(table.createdAt),
  tenantWhatsappUnique: uniqueIndex("conversations_tenant_whatsapp_unique").on(table.tenantId, table.whatsappNumber),
}));

// Messages for conversations
export const whatsappMessages = mysqlTable("whatsapp_messages", {
  id: varchar("id", { length: 36 }).primaryKey(),
  conversationId: varchar("conversation_id", { length: 36 }).notNull().references(() => conversations.id, { onDelete: "cascade" }),
  tenantId: varchar("tenant_id", { length: 36 }).notNull().references(() => tenants.id, { onDelete: "cascade" }),
  messageId: varchar("message_id", { length: 255 }),
  type: varchar("type", { length: 50 }).notNull(), // text, image, document, etc
  content: text("content"),
  direction: varchar("direction", { length: 10 }).notNull(), // inbound, outbound
  status: varchar("status", { length: 50 }).default("sent"),
  metadata: json("metadata"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
  tenantIdIdx: index("whatsapp_messages_tenant_id_idx").on(table.tenantId),
  conversationIdIdx: index("whatsapp_messages_conversation_id_idx").on(table.conversationId),
  createdAtIdx: index("whatsapp_messages_created_at_idx").on(table.createdAt),
}));

// Transactions tracking per tenant
export const transactions = mysqlTable("transactions", {
  id: varchar("id", { length: 36 }).primaryKey(),
  tenantId: varchar("tenant_id", { length: 36 }).notNull().references(() => tenants.id, { onDelete: "cascade" }),
  conversationId: varchar("conversation_id", { length: 36 }).references(() => conversations.id, { onDelete: "set null" }),
  transactionId: varchar("transaction_id", { length: 255 }).notNull(),
  amount: int("amount").notNull(), // in cents
  currency: varchar("currency", { length: 10 }).default("NGN"),
  status: varchar("status", { length: 50 }).notNull(),
  paymentMethod: varchar("payment_method", { length: 100 }),
  customerEmail: varchar("customer_email", { length: 255 }),
  metadata: json("metadata"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`),
}, (table) => ({
  tenantIdIdx: index("transactions_tenant_id_idx").on(table.tenantId),
  transactionIdIdx: index("transactions_transaction_id_idx").on(table.transactionId),
  createdAtIdx: index("transactions_created_at_idx").on(table.createdAt),
  uniqueTenantTransaction: uniqueIndex("transactions_tenant_transaction_unique").on(table.tenantId, table.transactionId),
}));

// Knowledge base for AI responses per tenant
export const knowledgeBase = mysqlTable("knowledge_base", {
  id: varchar("id", { length: 36 }).primaryKey(),
  tenantId: varchar("tenant_id", { length: 36 }).notNull().references(() => tenants.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  category: varchar("category", { length: 100 }),
  tags: json("tags"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`),
}, (table) => ({
  tenantIdIdx: index("knowledge_base_tenant_id_idx").on(table.tenantId),
  categoryIdx: index("knowledge_base_category_idx").on(table.category),
  isActiveIdx: index("knowledge_base_is_active_idx").on(table.isActive),
}));

// Users table
export const users = mysqlTable("users", {
  id: varchar("id", { length: 36 }).primaryKey(),
  username: varchar("username", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// Portfolio table
export const portfolio = mysqlTable("portfolio", {
  id: varchar("id", { length: 36 }).primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  techStack: text("tech_stack"),
  imageUrl: varchar("image_url", { length: 500 }),
  liveUrl: varchar("live_url", { length: 500 }),
  githubUrl: varchar("github_url", { length: 500 }),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// Testimonials table
export const testimonials = mysqlTable("testimonials", {
  id: varchar("id", { length: 36 }).primaryKey(),
  clientName: varchar("client_name", { length: 255 }).notNull(),
  content: text("content").notNull(),
  rating: int("rating").notNull(),
  position: varchar("position", { length: 255 }),
  company: varchar("company", { length: 255 }),
  imageUrl: varchar("image_url", { length: 500 }),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// Messages table  
export const messages = mysqlTable("messages", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  whatsapp: varchar("whatsapp", { length: 50 }),
  projectType: varchar("project_type", { length: 255 }),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// Newsletter table
export const newsletter_subscribers = mysqlTable("newsletter_subscribers", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  isActive: boolean("is_active").default(true),
  created_at: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// Create schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const selectUserSchema = createSelectSchema(users);
export const insertPortfolioSchema = createInsertSchema(portfolio).omit({ id: true, createdAt: true });
export const selectPortfolioSchema = createSelectSchema(portfolio);
export const insertTestimonialSchema = createInsertSchema(testimonials).omit({ id: true, createdAt: true });
export const selectTestimonialSchema = createSelectSchema(testimonials);
export const insertMessageSchema = createInsertSchema(messages).omit({ id: true, createdAt: true });
export const selectMessageSchema = createSelectSchema(messages);
export const insertNewsletterSchema = createInsertSchema(newsletter_subscribers).omit({ id: true, created_at: true });
export const selectNewsletterSchema = createSelectSchema(newsletter_subscribers);

// Contact form schema (alias for messages)
export const insertContactSchema = insertMessageSchema.extend({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  service: z.string().min(1, "Service selection is required"),
}).omit({ name: true }).transform(data => ({
  name: `${data.firstName} ${data.lastName}`,
  email: data.email,
  phone: data.phone,
  whatsapp: data.whatsapp,
  projectType: data.service,
  message: data.message,
}));

// Types
export type User = z.infer<typeof selectUserSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type PortfolioProject = z.infer<typeof selectPortfolioSchema>;
export type InsertPortfolio = z.infer<typeof insertPortfolioSchema>;
export type Testimonial = z.infer<typeof selectTestimonialSchema>;
export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
export type Message = z.infer<typeof selectMessageSchema>;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Newsletter = z.infer<typeof selectNewsletterSchema>;
export type InsertNewsletter = z.infer<typeof insertNewsletterSchema>;
export type InsertContact = z.infer<typeof insertContactSchema>;

// Portfolio type alias 
export type Portfolio = PortfolioProject;

// Multi-tenant bot schemas and types
export const insertTenantSchema = createInsertSchema(tenants).omit({ id: true, createdAt: true, updatedAt: true });
export const selectTenantSchema = createSelectSchema(tenants);
export const insertWhatsappConnectionSchema = createInsertSchema(whatsappConnections).omit({ id: true, createdAt: true });
export const selectWhatsappConnectionSchema = createSelectSchema(whatsappConnections);
export const insertConversationSchema = createInsertSchema(conversations).omit({ id: true, createdAt: true });
export const selectConversationSchema = createSelectSchema(conversations);
export const insertWhatsappMessageSchema = createInsertSchema(whatsappMessages).omit({ id: true, createdAt: true });
export const selectWhatsappMessageSchema = createSelectSchema(whatsappMessages);
export const insertTransactionSchema = createInsertSchema(transactions).omit({ id: true, createdAt: true, updatedAt: true });
export const selectTransactionSchema = createSelectSchema(transactions);
export const insertKnowledgeBaseSchema = createInsertSchema(knowledgeBase).omit({ id: true, createdAt: true, updatedAt: true });
export const selectKnowledgeBaseSchema = createSelectSchema(knowledgeBase);

// Multi-tenant bot types
export type Tenant = z.infer<typeof selectTenantSchema>;
export type InsertTenant = z.infer<typeof insertTenantSchema>;
export type WhatsappConnection = z.infer<typeof selectWhatsappConnectionSchema>;
export type InsertWhatsappConnection = z.infer<typeof insertWhatsappConnectionSchema>;
export type Conversation = z.infer<typeof selectConversationSchema>;
export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type WhatsappMessage = z.infer<typeof selectWhatsappMessageSchema>;
export type InsertWhatsappMessage = z.infer<typeof insertWhatsappMessageSchema>;
export type Transaction = z.infer<typeof selectTransactionSchema>;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type KnowledgeBase = z.infer<typeof selectKnowledgeBaseSchema>;
export type InsertKnowledgeBase = z.infer<typeof insertKnowledgeBaseSchema>;