var __defProp = Object.defineProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express5 from "express";

// server/email.ts
import nodemailer from "nodemailer";
import dotenv from "dotenv";
async function sendReceiptEmail(data) {
  try {
    const logoUrl = `${process.env.BASE_URL || "https://achek.com.ng"}/public/achek-logo.png`;
    const transactionNumber = `ACH-${Date.now()}-${Math.floor(Math.random() * 1e4)}`;
    const today = /* @__PURE__ */ new Date();
    const formattedDate = today.toLocaleDateString();
    const mailOptions = {
      from: "Achek Website <info@achek.com.ng>",
      to: data.email,
      subject: `Payment Receipt - Achek Digital Solutions [${transactionNumber}]`,
      html: `
        <div style="font-family:Segoe UI,Arial,sans-serif;background:#f9fafb;padding:32px;border-radius:12px;max-width:520px;margin:auto;box-shadow:0 2px 12px #0001;">
          <img src='${logoUrl}' alt='Achek Logo' style='max-width:120px;display:block;margin-bottom:16px;' />
          <h2 style='color:#1d4ed8;margin-bottom:8px;'>Payment Receipt</h2>
          <div style='font-size:15px;margin-bottom:16px;'>
            <strong>Transaction No:</strong> ${transactionNumber}<br/>
            <strong>Date:</strong> ${formattedDate}
          </div>
          <table style='width:100%;margin-bottom:16px;'>
            <tr><td><strong>Name:</strong></td><td>${data.name}</td></tr>
            <tr><td><strong>Email:</strong></td><td>${data.email}</td></tr>
            <tr><td><strong>WhatsApp:</strong></td><td>${data.whatsapp}</td></tr>
            <tr><td><strong>Service:</strong></td><td>${data.service}</td></tr>
            <tr><td><strong>Package:</strong></td><td>${data.package}</td></tr>
            <tr><td><strong>Amount Paid:</strong></td><td>\u20A6${data.amount.toLocaleString()}</td></tr>
          </table>
          <hr style='margin:24px 0;' />
          <p style='font-size:15px;'>Our team will contact you via WhatsApp at <strong>${data.whatsapp}</strong> to begin your project onboarding immediately.</p>
          <p style='font-size:15px;'>If you have any questions, reply to this email or chat us on WhatsApp.</p>
          <div style='margin-top:32px;font-size:12px;color:#888;text-align:center;'>Achek Digital Solutions &copy; 2025</div>
        </div>
      `
    };
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Failed to send receipt email:", error);
    return false;
  }
}
async function sendAdminNotification(data) {
  try {
    const logoUrl = `${process.env.BASE_URL || "https://achek.com.ng"}/public/achek-logo.png`;
    const mailOptions = {
      from: process.env.EMAIL_SENDER,
      to: process.env.ADMIN_EMAIL,
      // Admin/team email
      subject: `New Order - ${data.service} (${data.package})`,
      html: `
        <div style="font-family:Segoe UI,Arial,sans-serif;background:#fff;padding:32px;border-radius:12px;max-width:480px;margin:auto;">
          <img src='${logoUrl}' alt='Achek Logo' style='max-width:120px;display:block;margin-bottom:16px;' />
          <h2 style='color:#1d4ed8;'>New Order Received</h2>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>WhatsApp:</strong> ${data.whatsapp}</p>
          <p><strong>Service:</strong> ${data.service}</p>
          <p><strong>Package:</strong> ${data.package}</p>
          <p><strong>Amount Paid:</strong> \u20A6${data.amount.toLocaleString()}</p>
          <hr style='margin:24px 0;' />
          <p>Contact the client on WhatsApp to begin onboarding.</p>
          <div style='margin-top:32px;font-size:12px;color:#888;text-align:center;'>Achek Digital Solutions &copy; 2025</div>
        </div>
      `
    };
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Failed to send admin notification:", error);
    return false;
  }
}
dotenv.config();
var transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST || "smtp.gmail.com",
  port: Number(process.env.MAIL_PORT) || 587,
  secure: Number(process.env.MAIL_PORT) === 465,
  // true for 465, false for other ports
  auth: {
    user: process.env.MAIL_USER_HELLO,
    pass: process.env.MAIL_PASS_HELLO
  }
});
var EMAIL_SENDER = process.env.EMAIL_SENDER;
var EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
async function sendContactEmail(data) {
  try {
    const mailOptions = {
      from: process.env.MAIL_FROM_HELLO,
      to: "hello@achek.com.ng",
      subject: `New Contact Form Message from ${data.name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone || "Not provided"}</p>
        <p><strong>WhatsApp:</strong> ${data.whatsapp}</p>
        <p><strong>Project Type:</strong> ${data.projectType || "Not specified"}</p>
        <p><strong>Message:</strong></p>
        <p>${data.message}</p>
      `
    };
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Failed to send contact email:", error?.message || error);
    return false;
  }
}

// server/routes.ts
import express2 from "express";
import cron from "node-cron";
import { createServer } from "http";

// server/db.ts
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  insertMessageSchema: () => insertMessageSchema,
  insertNewsletterSchema: () => insertNewsletterSchema,
  insertPortfolioSchema: () => insertPortfolioSchema,
  insertTestimonialSchema: () => insertTestimonialSchema,
  insertUserSchema: () => insertUserSchema,
  messages: () => messages,
  newsletter: () => newsletter,
  portfolio: () => portfolio,
  selectMessageSchema: () => selectMessageSchema,
  selectNewsletterSchema: () => selectNewsletterSchema,
  selectPortfolioSchema: () => selectPortfolioSchema,
  selectTestimonialSchema: () => selectTestimonialSchema,
  selectUserSchema: () => selectUserSchema,
  testimonials: () => testimonials,
  users: () => users
});
import { mysqlTable, varchar, text, timestamp, int, boolean } from "drizzle-orm/mysql-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
var users = mysqlTable("users", {
  id: int("id").primaryKey().autoincrement(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull()
});
var portfolio = mysqlTable("portfolio", {
  id: int("id").primaryKey().autoincrement(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  image: varchar("image", { length: 255 }).notNull(),
  technologies: text("technologies").notNull(),
  demoUrl: varchar("demo_url", { length: 255 }),
  githubUrl: varchar("github_url", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var testimonials = mysqlTable("testimonials", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  role: varchar("role", { length: 255 }).notNull(),
  company: varchar("company", { length: 255 }).notNull(),
  testimonial: text("testimonial").notNull(),
  image: varchar("image", { length: 255 }),
  rating: int("rating").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var messages = mysqlTable("messages", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  whatsapp: varchar("whatsapp", { length: 20 }),
  projectType: varchar("project_type", { length: 255 }),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var newsletter = mysqlTable("newsletter_subscribers", {
  id: int("id").primaryKey().autoincrement(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var insertUserSchema = createInsertSchema(users);
var selectUserSchema = createSelectSchema(users);
var insertPortfolioSchema = createInsertSchema(portfolio);
var selectPortfolioSchema = createSelectSchema(portfolio);
var insertTestimonialSchema = createInsertSchema(testimonials);
var selectTestimonialSchema = createSelectSchema(testimonials);
var insertMessageSchema = createInsertSchema(messages);
var selectMessageSchema = createSelectSchema(messages);
var insertNewsletterSchema = createInsertSchema(newsletter);
var selectNewsletterSchema = createSelectSchema(newsletter);

// server/db.ts
import dotenv2 from "dotenv";
dotenv2.config();
var dbHost = process.env.DB_HOST;
var dbPort = process.env.DB_PORT;
var dbName = process.env.DB_NAME;
var dbUser = process.env.DB_USER;
var dbPass = process.env.DB_PASS;
var dbConfig = {
  host: dbHost || "localhost",
  port: parseInt(dbPort || "3306"),
  database: dbName || "achek_db",
  user: dbUser || "root",
  password: dbPass || "password"
};
var connection = mysql.createPool(dbConfig);
var db = drizzle(connection, { schema: schema_exports, mode: "default" });

// server/storage.ts
import { randomUUID } from "crypto";
import nodemailer2 from "nodemailer";
var DBStorage = class {
  portfolioProjects = /* @__PURE__ */ new Map();
  testimonials = /* @__PURE__ */ new Map();
  orders = [];
  // Orders
  logOrder(order) {
    this.orders.push({ ...order, createdAt: /* @__PURE__ */ new Date() });
  }
  getOrders() {
    return this.orders;
  }
  constructor() {
    const projectsList = [
      {
        id: randomUUID(),
        title: "FinPay NG",
        description: "A modern fintech dashboard for Nigerian SMEs. Provides real-time analytics, payments integration, and automated invoicing.",
        techStack: ["Next.js", "TailwindCSS", "Node.js", "PostgreSQL"],
        imageUrl: "https://images.pexels.com/photos/6802040/pexels-photo-6802040.jpeg",
        liveUrl: "/FintechDashboard",
        githubUrl: "https://github.com/calebdevx/finpay-ng",
        createdAt: /* @__PURE__ */ new Date()
      },
      {
        id: randomUUID(),
        title: "QuickEats NG",
        description: "Food delivery platform designed for Nigerian restaurants. Features live order tracking, restaurant dashboards, and mobile-first design.",
        techStack: ["React Native", "Firebase", "Express.js"],
        imageUrl: "https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg",
        liveUrl: "/FoodDelivery",
        githubUrl: "https://github.com/calebdevx/quickeats-ng",
        createdAt: /* @__PURE__ */ new Date()
      },
      {
        id: randomUUID(),
        title: "NaijaHomes",
        description: "A real estate platform with property listings, mortgage calculators, and virtual tours tailored for Nigerian buyers.",
        techStack: ["Next.js", "Supabase", "TailwindCSS"],
        imageUrl: "https://images.pexels.com/photos/7031409/pexels-photo-7031409.jpeg",
        liveUrl: "/RealEstate",
        githubUrl: "https://github.com/yourgithub/naijahomes",
        createdAt: /* @__PURE__ */ new Date()
      },
      {
        id: randomUUID(),
        title: "EduAfrica LMS",
        description: "An e-learning platform for African universities. Includes video streaming, quizzes, and student progress tracking.",
        techStack: ["Django", "React", "PostgreSQL"],
        imageUrl: "https://images.pexels.com/photos/4145190/pexels-photo-4145190.jpeg",
        liveUrl: "/eduafrica",
        githubUrl: "https://github.com/calebdevx/eduafrica",
        createdAt: /* @__PURE__ */ new Date()
      },
      {
        id: randomUUID(),
        title: "MarketHub NG",
        description: "An e-commerce marketplace that connects Nigerian vendors with nationwide customers. Features wallet, cart, and seller dashboards.",
        techStack: ["Vue.js", "Laravel", "MySQL"],
        imageUrl: "https://images.pexels.com/photos/5632396/pexels-photo-5632396.jpeg",
        liveUrl: "/Marketplace",
        githubUrl: "https://github.com/calebdevx/markethub-ng",
        createdAt: /* @__PURE__ */ new Date()
      },
      {
        id: randomUUID(),
        title: "TravelNaija",
        description: "Tourism booking platform for Nigerian destinations. Provides flight deals, hotel booking, and local experiences.",
        techStack: ["Next.js", "GraphQL", "TailwindCSS"],
        imageUrl: "https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg",
        liveUrl: "/travelnaija",
        githubUrl: "https://github.com/calebdevx/travelnaija",
        createdAt: /* @__PURE__ */ new Date()
      },
      {
        id: randomUUID(),
        title: "AgroConnect",
        description: "A digital marketplace connecting Nigerian farmers to buyers. Features crop tracking, pricing analytics, and secure payments.",
        techStack: ["React", "Node.js", "MongoDB"],
        imageUrl: "https://images.pexels.com/photos/2886937/pexels-photo-2886937.jpeg",
        liveUrl: "/AgroConnect",
        githubUrl: "https://github.com/calebdevx/agroconnect",
        createdAt: /* @__PURE__ */ new Date()
      },
      {
        id: randomUUID(),
        title: "HealthLink NG",
        description: "Telemedicine platform offering video consultations, prescriptions, and hospital integrations for Nigerian healthcare.",
        techStack: ["Flutter", "Firebase", "NestJS"],
        imageUrl: "https://images.pexels.com/photos/4266947/pexels-photo-4266947.jpeg",
        liveUrl: "/healthlink",
        githubUrl: "https://github.com/calebdevx/healthlink-ng",
        createdAt: /* @__PURE__ */ new Date()
      },
      {
        id: randomUUID(),
        title: "EventHub Africa",
        description: "Event ticketing and booking solution for concerts, conferences, and weddings across Nigeria.",
        techStack: ["Angular", "Express", "MongoDB"],
        imageUrl: "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg",
        liveUrl: "/EventHub",
        githubUrl: "https://github.com/calebdevx/eventhubafrica",
        createdAt: /* @__PURE__ */ new Date()
      },
      {
        id: randomUUID(),
        title: "ShopSmart NG",
        description: "AI-powered price comparison platform for Nigerian online shoppers. Helps users find the best deals instantly.",
        techStack: ["Next.js", "AI API", "PostgreSQL"],
        imageUrl: "https://images.pexels.com/photos/5632393/pexels-photo-5632393.jpeg",
        liveUrl: "/shopsmart",
        githubUrl: "https://github.com/calebdevx/shopsmart-ng",
        createdAt: /* @__PURE__ */ new Date()
      }
    ];
    projectsList.forEach((p) => {
      this.portfolioProjects.set(p.id, p);
    });
    const testimonialsList = [
      {
        id: randomUUID(),
        clientName: "Elijah Omachoko",
        content: "Achek built us a world-class real estate website with seamless property listings. The design is modern and user-friendly, and our leads have doubled.",
        rating: 5,
        position: "Founder",
        company: "Achekinyo",
        imageUrl: "https://i.ibb.co/yFC1hZxP/elijah.jpg",
        createdAt: /* @__PURE__ */ new Date()
      },
      {
        id: randomUUID(),
        clientName: "Victoria Onuche",
        content: "Their developer portfolio platform was beyond my expectations. Clean, fast, and professional. It has helped me attract bigger clients.",
        rating: 5,
        position: "Software Developer",
        company: "Freelance",
        imageUrl: "https://i.ibb.co/q39dDm3p/victoria.jpg",
        createdAt: /* @__PURE__ */ new Date()
      },
      {
        id: randomUUID(),
        clientName: "Sarah Johnson",
        content: "Achek transformed our online presence completely. The team delivered a stunning website that not only looks amazing but also performs exceptionally well.",
        rating: 5,
        position: "CEO",
        company: "TechCorp",
        imageUrl: "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg",
        createdAt: /* @__PURE__ */ new Date()
      },
      {
        id: randomUUID(),
        clientName: "Michael Chen",
        content: "The mobile app they developed for us exceeded all expectations. The user experience is seamless, and our customers love the intuitive design.",
        rating: 5,
        position: "Founder",
        company: "FitLife",
        imageUrl: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
        createdAt: /* @__PURE__ */ new Date()
      },
      {
        id: randomUUID(),
        clientName: "Emily Rodriguez",
        content: "Working with Achek was a game-changer for our business. They understood our vision perfectly and delivered a solution that surpassed our expectations.",
        rating: 5,
        position: "Director",
        company: "GreenEarth",
        imageUrl: "https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg",
        createdAt: /* @__PURE__ */ new Date()
      },
      {
        id: randomUUID(),
        clientName: "David Thompson",
        content: "Achek's digital marketing strategy helped us reach new heights. Our online visibility has improved dramatically with consistent growth in leads.",
        rating: 5,
        position: "Owner",
        company: "LocalBiz",
        imageUrl: "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg",
        createdAt: /* @__PURE__ */ new Date()
      },
      {
        id: randomUUID(),
        clientName: "Lisa Park",
        content: "The e-commerce platform Achek built for us is absolutely fantastic. The admin panel is intuitive, and our customers love the shopping experience.",
        rating: 5,
        position: "Founder",
        company: "StyleHub",
        imageUrl: "https://images.pexels.com/photos/774282/pexels-photo-774282.jpeg",
        createdAt: /* @__PURE__ */ new Date()
      },
      {
        id: randomUUID(),
        clientName: "Robert Kim",
        content: "From concept to deployment, Achek handled everything professionally. Their cloud solutions made our operations more efficient and scalable.",
        rating: 5,
        position: "CTO",
        company: "InnovateTech",
        imageUrl: "https://images.pexels.com/photos/2422273/pexels-photo-2422273.jpeg",
        createdAt: /* @__PURE__ */ new Date()
      },
      {
        id: randomUUID(),
        clientName: "Chinedu Okafor",
        content: "Our fintech dashboard was delivered flawlessly. Real-time analytics, easy navigation, and a polished UI. Couldn\u2019t have asked for better.",
        rating: 5,
        position: "Product Manager",
        company: "FinPay",
        imageUrl: "https://images.pexels.com/photos/936094/pexels-photo-936094.jpeg",
        createdAt: /* @__PURE__ */ new Date()
      },
      {
        id: randomUUID(),
        clientName: "Amara Nwosu",
        content: "Achek created a beautiful learning platform for us. Students love the experience and engagement has skyrocketed since launch.",
        rating: 5,
        position: "Director",
        company: "EduAfrica",
        imageUrl: "https://refinedng.com/wp-content/uploads/2024/03/Honey-Ogundeyi-CEO.png",
        createdAt: /* @__PURE__ */ new Date()
      },
      {
        id: randomUUID(),
        clientName: "Tunde Balogun",
        content: "Their food delivery solution for us was smooth, real-time, and scalable. Our restaurants and customers love the system.",
        rating: 5,
        position: "CEO",
        company: "QuickEats NG",
        imageUrl: "https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg",
        createdAt: /* @__PURE__ */ new Date()
      },
      {
        id: randomUUID(),
        clientName: "Ngozi Adeyemi",
        content: "Achek\u2019s real estate platform was exactly what we needed. Virtual tours and mortgage calculators set us apart from competitors.",
        rating: 5,
        position: "Manager",
        company: "Lagos Realty",
        imageUrl: "https://images.pexels.com/photos/1002061/pexels-photo-1002061.jpeg",
        createdAt: /* @__PURE__ */ new Date()
      }
    ];
    testimonialsList.forEach((t) => {
      this.testimonials.set(t.id, t);
    });
  }
  // --- Users ---
  async getUser(id) {
    const [rows] = await connection.query("SELECT * FROM users WHERE id = ?", [id]);
    return rows[0];
  }
  async getUserByEmail(email) {
    const [rows] = await connection.query("SELECT * FROM users WHERE email = ?", [email]);
    return rows[0];
  }
  async createUser(insertUser) {
    const id = randomUUID();
    const user = { ...insertUser, id, createdAt: /* @__PURE__ */ new Date() };
    await connection.query("INSERT INTO users SET ?", user);
    return user;
  }
  // --- Portfolio (in-memory) ---
  async getPortfolioProjects() {
    return Array.from(this.portfolioProjects.values());
  }
  async getPortfolioProject(id) {
    return this.portfolioProjects.get(id);
  }
  // --- Testimonials (in-memory) ---
  async getTestimonials() {
    return Array.from(this.testimonials.values());
  }
  // --- Messages ---
  async getMessages() {
    const [rows] = await connection.query("SELECT * FROM messages ORDER BY createdAt DESC");
    return rows;
  }
  async createMessage(insertMessage) {
    const id = randomUUID();
    const message = { ...insertMessage, id, createdAt: /* @__PURE__ */ new Date() };
    await connection.query("INSERT INTO messages SET ?", message);
    try {
      const transporter2 = nodemailer2.createTransport({
        host: process.env.MAIL_HOST,
        port: Number(process.env.MAIL_PORT),
        secure: true,
        auth: {
          user: process.env.MAIL_USER_HELLO,
          pass: process.env.MAIL_PASS_HELLO
        }
      });
      await transporter2.sendMail({
        from: process.env.MAIL_FROM_HELLO,
        to: process.env.MAIL_USER_HELLO,
        subject: "\u{1F4E9} New Contact Form Submission",
        text: `
Name: ${message.name}
Email: ${message.email}
Phone: ${message.phone || "N/A"}
WhatsApp: ${message.whatsapp || "N/A"}
Project Type: ${message.projectType || "N/A"}

Message:
${message.message}
        `
      });
    } catch (error) {
      console.error("\u274C Failed to send contact email:", error);
    }
    return message;
  }
  // --- Newsletter ---
  async getNewsletterSubscriptions() {
    const [rows] = await connection.query(
      "SELECT * FROM newsletter_subscribers ORDER BY created_at DESC"
    );
    return rows;
  }
  async createNewsletterSubscription(insertNewsletter) {
    let insertResult;
    try {
      insertResult = await connection.query("INSERT INTO newsletter_subscribers SET ?", { email: insertNewsletter.email });
    } catch (err) {
      if (err.code === "ER_DUP_ENTRY") {
        throw new Error("Already subscribed");
      }
      throw err;
    }
    const [rows] = await connection.query("SELECT * FROM newsletter_subscribers WHERE email = ?", [insertNewsletter.email]);
    return rows[0];
  }
  async unsubscribeNewsletter(email) {
    const [result] = await connection.query("DELETE FROM newsletter_subscribers WHERE email = ?", [email]);
    return result.affectedRows > 0;
  }
  async sendBulkNewsletter(subject, content) {
    const [rows] = await connection.query("SELECT email FROM newsletter_subscribers");
    const subscribers = rows.map((r) => r.email);
    if (!subscribers.length) return 0;
    const transporter2 = nodemailer2.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      secure: true,
      auth: {
        user: process.env.MAIL_USER_NEWS,
        pass: process.env.MAIL_PASS_NEWS
      }
    });
    await Promise.all(
      subscribers.map(
        (email) => transporter2.sendMail({
          from: process.env.MAIL_FROM_NEWS,
          to: email,
          subject,
          html: `
            <div>
              ${content}
              <br><br>
              <a href="${process.env.BASE_URL}/api/newsletter/unsubscribe?email=${encodeURIComponent(
            email
          )}">Unsubscribe</a>
            </div>
          `
        })
      )
    );
    return subscribers.length;
  }
};
var storage = new DBStorage();

// server/routes.ts
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// server/payment-status.ts
import express from "express";
import axios from "axios";
var router = express.Router();
router.post("/api/payment-status", async (req, res) => {
  const { transactionId } = req.body;
  if (!transactionId) {
    return res.status(400).json({ success: false, message: "Missing transactionId" });
  }
  try {
    const FLUTTERWAVE_API_KEY = process.env.FLUTTERWAVE_API_KEY;
    if (!FLUTTERWAVE_API_KEY) {
      return res.status(500).json({ success: false, message: "Flutterwave API key not set" });
    }
    const response = await axios.get(
      `https://api.flutterwave.com/v3/transactions/${transactionId}/verify`,
      {
        headers: {
          Authorization: `Bearer ${FLUTTERWAVE_API_KEY}`
        }
      }
    );
    const { status, data } = response.data;
    if (status === "success") {
      return res.json({ success: true, paymentStatus: data.status, data });
    } else {
      return res.status(400).json({ success: false, message: data.message || "Verification failed" });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error?.response?.data?.message || error.message || "Error verifying payment" });
  }
});
var payment_status_default = router;

// server/routes.ts
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
var testReceiptRoute = express2.Router();
testReceiptRoute.post("/api/test-send-receipt", async (req, res) => {
  try {
    const testData = {
      name: "Test User",
      email: req.body.email || "info@achek.com.ng",
      service: "Test Service",
      package: "Test Package",
      amount: 1e3,
      whatsapp: "08012345678"
    };
    const sent = await sendReceiptEmail(testData);
    if (sent) {
      res.json({ success: true, message: "Test receipt email sent." });
    } else {
      res.status(500).json({ success: false, message: "Failed to send test receipt email." });
    }
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
});
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
var JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
var EMAIL_FILE = path.join(__dirname, "data/newsletter-emails.txt");
async function registerRoutes(app2) {
  let sendWhatsAppReceipt = null;
  let whatsappReceipts = null;
  app2.use(testReceiptRoute);
  app2.use(payment_status_default);
  app2.post("/api/send-receipt", async (req, res) => {
    try {
      const { name, email, service, package: pkg, amount, whatsapp } = req.body;
      const emailSent = await sendReceiptEmail({ name, email, service, package: pkg, amount, whatsapp });
      const adminNotified = await sendAdminNotification({
        name,
        email,
        service,
        package: pkg,
        amount,
        whatsapp
      });
      if (typeof storage.logOrder === "function") {
        storage.logOrder({ name, email, service, package: pkg, amount, whatsapp });
      }
      res.json({ success: emailSent && adminNotified });
    } catch (error) {
      console.error("Failed to send receipt or WhatsApp message:", error);
      res.status(500).json({ success: false, error: "Failed to send receipt or WhatsApp message" });
    }
  });
  app2.get("/api/orders", async (req, res) => {
    try {
      if (typeof storage.getOrders === "function") {
        const orders = storage.getOrders();
        res.json(orders);
      } else {
        res.json([]);
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders", error });
    }
  });
  const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      return res.sendStatus(401);
    }
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  };
  app2.post("/api/auth/register", async (req, res) => {
    try {
      const { username, email, passwordHash } = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
      const hashedPassword = await bcrypt.hash(passwordHash, 10);
      const user = await storage.createUser({
        username,
        email,
        passwordHash: hashedPassword
      });
      const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: "24h" });
      res.json({
        message: "User created successfully",
        user: { id: user.id, username: user.username, email: user.email },
        token
      });
    } catch (error) {
      res.status(400).json({ message: "Registration failed", error });
    }
  });
  app2.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const isValidPassword = await bcrypt.compare(password, user.passwordHash);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: "24h" });
      res.json({
        message: "Login successful",
        user: { id: user.id, username: user.username, email: user.email },
        token
      });
    } catch (error) {
      res.status(400).json({ message: "Login failed", error });
    }
  });
  app2.get("/api/portfolio", async (req, res) => {
    try {
      const portfolioItems = await storage.getPortfolioProjects();
      res.json(portfolioItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch portfolio", error });
    }
  });
  app2.post("/api/portfolio", authenticateToken, async (req, res) => {
    try {
      const portfolioData = insertPortfolioSchema.parse(req.body);
      const portfolioItem = await storage.createPortfolio(portfolioData);
      res.json({ message: "Portfolio item created", item: portfolioItem });
    } catch (error) {
      res.status(400).json({ message: "Failed to create portfolio item", error });
    }
  });
  app2.get("/api/testimonials", async (req, res) => {
    try {
      const testimonialsData = await storage.getTestimonials();
      res.json(testimonialsData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch testimonials", error });
    }
  });
  app2.post("/api/testimonials", authenticateToken, async (req, res) => {
    try {
      const testimonialData = insertTestimonialSchema.parse(req.body);
      const testimonial = await storage.createTestimonial(testimonialData);
      res.json({ message: "Testimonial created", testimonial });
    } catch (error) {
      res.status(400).json({ message: "Failed to create testimonial", error });
    }
  });
  app2.post("/api/messages", async (req, res) => {
    try {
      const messageData = insertMessageSchema.parse(req.body);
      console.log("Received contact message:", messageData);
      const emailSent = await sendContactEmail(messageData);
      if (emailSent) {
        res.json({ message: "Message sent successfully" });
      } else {
        console.log("Email failed, but storing message locally:", messageData);
        try {
          if (storage && typeof storage.createMessage === "function") {
            await storage.createMessage(messageData);
            console.log("Message stored in database as fallback");
          }
        } catch (dbError) {
          console.error("Database storage also failed:", dbError);
        }
        res.status(500).json({
          message: "Email delivery failed, but your message has been received. We'll contact you via WhatsApp."
        });
      }
    } catch (error) {
      console.error("Message endpoint error:", error);
      res.status(400).json({ message: "Failed to process message", error: error.message });
    }
  });
  app2.get("/api/messages", authenticateToken, async (req, res) => {
    try {
      res.json([]);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch messages", error });
    }
  });
  app2.post("/api/newsletter", async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ message: "Email required" });
      let data = "";
      try {
        data = fs.readFileSync(EMAIL_FILE, "utf8");
      } catch (err) {
        if (err.code !== "ENOENT") return res.status(500).json({ message: "Server error" });
      }
      const emails = data ? data.split("\n").map((e) => e.trim()) : [];
      if (emails.includes(email)) {
        return res.status(409).json({ message: "This email is already subscribed to the newsletter." });
      }
      fs.appendFileSync(EMAIL_FILE, email + "\n");
      res.json({ message: "Newsletter subscription successful" });
    } catch (error) {
      res.status(400).json({ message: "Newsletter subscription failed", error });
    }
  });
  app2.get("/api/newsletter", async (req, res) => {
    try {
      let data = "";
      try {
        data = fs.readFileSync(EMAIL_FILE, "utf8");
      } catch (err) {
        if (err.code !== "ENOENT") return res.status(500).json({ message: "Server error" });
      }
      const emails = data ? data.split("\n").filter((e) => e.trim()) : [];
      console.log("Newsletter subscribers:", emails);
      res.json(emails);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch newsletter subscriptions", error });
    }
  });
  const scheduledJobs = {};
  app2.post("/api/newsletter/send", async (req, res) => {
    try {
      const { subject, content, recipients, schedule, logoUrl } = req.body;
      if (!subject || !content || !recipients || recipients.length === 0) {
        return res.status(400).json({ message: "Subject, content, and recipients are required" });
      }
      const nodemailer3 = __require("nodemailer");
      let transporter2;
      try {
        transporter2 = nodemailer3.createTransport({
          host: process.env.MAIL_HOST,
          port: parseInt(process.env.MAIL_PORT || "465"),
          secure: true,
          auth: {
            user: process.env.MAIL_USER_NEWS,
            pass: process.env.MAIL_PASS_NEWS
          }
        });
        await transporter2.verify();
      } catch (mailErr) {
        console.error("Mail server connection failed:", mailErr);
        return res.status(500).json({ message: "Mail server connection failed. Please check your mail settings.", error: mailErr });
      }
      const baseUrl = process.env.BASE_URL || "https://achek.com.ng";
      const rewriteLinks = (html, email) => html.replace(/<a\s+([^>]*?)href=["']([^"']+)["']([^>]*)>/gi, (match, pre, href, post) => {
        if (/^https?:\/\//.test(href)) {
          const tracked = `${baseUrl}/api/newsletter/track-click?email=${encodeURIComponent(email)}&url=${encodeURIComponent(href)}`;
          return `<a ${pre}href="${tracked}"${post}>`;
        }
        return match;
      });
      const addTrackingPixel = (html, email) => {
        const pixel = `<img src="${baseUrl}/api/newsletter/track-open?email=${encodeURIComponent(email)}" width="1" height="1" style="display:none;" alt="" />`;
        return html + pixel;
      };
      const sendToAll = async () => {
        const emailPromises = recipients.map(async (email) => {
          const unsubscribeUrl = `${baseUrl}/newsletter/unsubscribe?email=${encodeURIComponent(email)}`;
          let html = content;
          if (logoUrl) {
            html = `<img src='${logoUrl}' alt='Logo' style='max-width:120px;display:block;margin-bottom:16px;'/>` + html;
          }
          html += `<div style='margin-top:32px;font-size:12px;color:#888;text-align:center;'>If you wish to unsubscribe, <a href='${unsubscribeUrl}'>click here</a>.</div>`;
          html = rewriteLinks(html, email);
          html = addTrackingPixel(html, email);
          try {
            await transporter2.sendMail({
              from: process.env.MAIL_FROM_NEWS,
              to: email,
              subject,
              html
            });
            if (storage.logNewsletterEvent) {
              await storage.logNewsletterEvent({ type: "send", email, subject, timestamp: /* @__PURE__ */ new Date() });
            }
          } catch (sendErr) {
            console.error(`Failed to send to ${email}:`, sendErr);
            throw new Error(`Failed to send to ${email}: ${sendErr.message}`);
          }
        });
        await Promise.all(emailPromises);
      };
      if (schedule) {
        const date = new Date(schedule);
        if (isNaN(date.getTime()) || date < /* @__PURE__ */ new Date()) {
          return res.status(400).json({ message: "Invalid schedule date/time" });
        }
        const cronExpr = `${date.getUTCMinutes()} ${date.getUTCHours()} ${date.getUTCDate()} ${date.getUTCMonth() + 1} *`;
        const jobId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
        scheduledJobs[jobId] = cron.schedule(cronExpr, async () => {
          try {
            await sendToAll();
          } catch (err) {
            console.error("Scheduled newsletter send failed:", err);
          }
          scheduledJobs[jobId].stop();
          delete scheduledJobs[jobId];
        }, { timezone: "UTC" });
        res.json({ message: `Newsletter scheduled for ${schedule} (UTC)` });
      } else {
        try {
          await sendToAll();
          res.json({ message: `Newsletter sent successfully to ${recipients.length} recipients` });
        } catch (err) {
          res.status(500).json({ message: `Failed to send newsletter: ${err.message}`, error: err });
        }
      }
    } catch (error) {
      console.error("Failed to send newsletter:", error);
      res.status(500).json({ message: "Failed to send newsletter", error });
    }
  });
  app2.get("/api/newsletter/track-open", async (req, res) => {
    const email = req.query.email;
    if (storage.logNewsletterEvent && email) {
      await storage.logNewsletterEvent({ type: "open", email, timestamp: /* @__PURE__ */ new Date() });
    }
    const img = Buffer.from(
      "R0lGODlhAQABAPAAAP///wAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==",
      "base64"
    );
    res.set("Content-Type", "image/gif");
    res.send(img);
  });
  app2.get("/api/newsletter/track-click", async (req, res) => {
    const { email, url } = req.query;
    if (storage.logNewsletterEvent && email && url) {
      await storage.logNewsletterEvent({ type: "click", email, url, timestamp: /* @__PURE__ */ new Date() });
    }
    if (url && typeof url === "string") {
      res.redirect(url);
    } else {
      res.status(400).send("Invalid URL");
    }
  });
  app2.get("/api/newsletter/unsubscribe", async (req, res) => {
    const email = req.query.email;
    if (!email) return res.status(400).send("Missing email");
    try {
      await storage.unsubscribeNewsletter(email);
      res.send(`
        <html>
          <head>
            <title>Unsubscribed | Achek Newsletter</title>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <style>
              body { font-family: 'Segoe UI', Arial, sans-serif; background: #f9fafb; color: #222; margin: 0; padding: 0; }
              .container { max-width: 420px; margin: 48px auto; background: #fff; border-radius: 12px; box-shadow: 0 2px 12px #0001; padding: 32px 24px; text-align: center; }
              .logo { width: 80px; margin-bottom: 16px; }
              h2 { color: #1d4ed8; margin-bottom: 8px; }
              .feedback { margin-top: 32px; }
              textarea { width: 100%; border-radius: 6px; border: 1px solid #ddd; padding: 8px; min-height: 60px; }
              button { background: #1d4ed8; color: #fff; border: none; border-radius: 6px; padding: 10px 24px; font-weight: 600; margin-top: 12px; cursor: pointer; }
              .thanks { color: #16a34a; margin-top: 16px; }
            </style>
          </head>
          <body>
            <div class="container">
              <img src="/public/achek-logo.png" alt="Achek Logo" class="logo" />
              <h2>You have been unsubscribed</h2>
              <p>We're sorry to see you go. You will no longer receive newsletters from us.</p>
              <div class="feedback">
                <form method="POST" action="/api/newsletter/unsubscribe-feedback">
                  <input type="hidden" name="email" value="${email}" />
                  <label for="reason">Why did you unsubscribe?</label><br />
                  <textarea name="reason" id="reason" placeholder="Your feedback helps us improve!"></textarea><br />
                  <button type="submit">Send Feedback</button>
                </form>
              </div>
            </div>
          </body>
        </html>
      `);
    } catch (err) {
      res.status(500).send("Failed to unsubscribe. Please try again later.");
    }
  });
  app2.post("/api/newsletter/unsubscribe-feedback", express2.urlencoded({ extended: true }), async (req, res) => {
    const { email, reason } = req.body;
    console.log(`Unsubscribe feedback from ${email}: ${reason}`);
    res.send(`<html><body style='font-family:sans-serif;text-align:center;padding:48px;'><h2 class='thanks'>Thank you for your feedback!</h2><p>We appreciate your input.</p></body></html>`);
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/upload.ts
import express3 from "express";
import multer from "multer";
import path2 from "path";
import fs2 from "fs";
import { fileURLToPath as fileURLToPath2 } from "url";
var __filename2 = fileURLToPath2(import.meta.url);
var __dirname2 = path2.dirname(__filename2);
var router2 = express3.Router();
var uploadDir = path2.join(__dirname2, "../client/public/uploads");
if (!fs2.existsSync(uploadDir)) fs2.mkdirSync(uploadDir, { recursive: true });
var storage2 = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path2.extname(file.originalname);
    const name = Date.now() + "-" + Math.round(Math.random() * 1e9) + ext;
    cb(null, name);
  }
});
var upload = multer({ storage: storage2 });
router2.post("/api/upload", upload.single("image"), (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: "No file uploaded" });
  const url = `/uploads/${file.filename}`;
  res.json({ url });
});
var upload_default = router2;

// server/vite.ts
import express4 from "express";
import fs3 from "fs";
import path4 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path3 from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      ),
      await import("@replit/vite-plugin-dev-banner").then(
        (m) => m.devBanner()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path3.resolve(import.meta.dirname, "client", "src"),
      "@shared": path3.resolve(import.meta.dirname, "shared"),
      "@assets": path3.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path3.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path3.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    host: "0.0.0.0",
    port: 5e3,
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path4.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs3.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path4.resolve(import.meta.dirname, "public");
  if (!fs3.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express4.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path4.resolve(distPath, "index.html"));
  });
}

// server/index.ts
import dotenv3 from "dotenv";
import { SitemapStream, streamToPromise } from "sitemap";
dotenv3.config();
var app = express5();
app.use(upload_default);
app.use(express5.json());
app.use(express5.urlencoded({ extended: false }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});
app.get("/sitemap.xml", async (req, res) => {
  try {
    const smStream = new SitemapStream({ hostname: "https://achek.com.ng" });
    smStream.write({ url: "/", changefreq: "daily", priority: 1 });
    smStream.write({ url: "/about", changefreq: "monthly", priority: 0.7 });
    smStream.write({ url: "/contact", changefreq: "monthly", priority: 0.7 });
    smStream.end();
    const sitemap = await streamToPromise(smStream);
    res.header("Content-Type", "application/xml");
    res.send(sitemap.toString());
  } catch (err) {
    res.status(500).end();
  }
});
async function initializeApp() {
  const server = await registerRoutes(app);
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const PORT = process.env.PORT || 5e3;
  server.listen(Number(PORT), "0.0.0.0", () => {
    const formattedTime = new Intl.DateTimeFormat("en-US", {
      dateStyle: "short",
      timeStyle: "medium"
    }).format(/* @__PURE__ */ new Date());
    console.log(`${formattedTime} [express] serving on port ${PORT}`);
    console.log(
      `Server accessible at: https://${process.env.WEB_NAME || "achek.com.ng"}.${process.env.BASE_OWNER || "username"}/caleb`
    );
  });
}
initializeApp().catch(console.error);
