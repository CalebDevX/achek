import { sql } from "drizzle-orm";
import { text, varchar, serial, timestamp, boolean, int, mysqlTable } from "drizzle-orm/mysql-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

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
export type User = typeof selectUserSchema._type;
export type InsertUser = typeof insertUserSchema._type;
export type PortfolioProject = typeof selectPortfolioSchema._type;
export type InsertPortfolio = typeof insertPortfolioSchema._type;
export type Testimonial = typeof selectTestimonialSchema._type;
export type InsertTestimonial = typeof insertTestimonialSchema._type;
export type Message = typeof selectMessageSchema._type;
export type InsertMessage = typeof insertMessageSchema._type;
export type Newsletter = typeof selectNewsletterSchema._type;
export type InsertNewsletter = typeof insertNewsletterSchema._type;
export type InsertContact = z.infer<typeof insertContactSchema>;

// Portfolio type alias 
export type Portfolio = PortfolioProject;