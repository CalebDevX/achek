import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import uploadRouter from "./upload";
import { setupVite, serveStatic } from "./vite";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { SitemapStream, streamToPromise } from "sitemap";

// Load environment variables first
dotenv.config();

const app = express();
app.use(uploadRouter);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Sitemap endpoint
app.get("/sitemap.xml", async (req, res) => {
  try {
    const smStream = new SitemapStream({ hostname: "https://achek.com.ng" });

    // Main pages
    smStream.write({ url: "/", changefreq: "weekly", priority: 1.0, lastmod: "2025-01-26" });
    smStream.write({ url: "/about", changefreq: "monthly", priority: 0.9, lastmod: "2025-01-26" });
    smStream.write({ url: "/services", changefreq: "monthly", priority: 0.9, lastmod: "2025-01-26" });
    smStream.write({ url: "/portfolio", changefreq: "weekly", priority: 0.8, lastmod: "2025-01-26" });
    smStream.write({ url: "/contact", changefreq: "monthly", priority: 0.8, lastmod: "2025-01-26" });
    smStream.write({ url: "/pricing", changefreq: "monthly", priority: 0.7, lastmod: "2025-01-26" });
    smStream.write({ url: "/blog", changefreq: "weekly", priority: 0.7, lastmod: "2025-01-26" });
    smStream.write({ url: "/testimonials", changefreq: "monthly", priority: 0.6, lastmod: "2025-01-26" });
    smStream.write({ url: "/faq", changefreq: "monthly", priority: 0.6, lastmod: "2025-01-26" });
    smStream.write({ url: "/privacy", changefreq: "yearly", priority: 0.3, lastmod: "2025-01-26" });
    smStream.write({ url: "/terms", changefreq: "yearly", priority: 0.3, lastmod: "2025-01-26" });

    // Portfolio projects
    const portfolioProjects = [
      "AdUnit", "AgroConnect", "deliver", "EcommerceDashboard", "EduAfricaLMS",
      "EventHub", "FintechDashboard", "FoodDelivery", "HealthLinkNG", "Marketplace",
      "NewsPortal", "RealEstate", "receipt", "ShopSmartNG", "TravelNaija"
    ];

    portfolioProjects.forEach(project => {
      smStream.write({ url: `/${project}`, changefreq: "monthly", priority: 0.5, lastmod: "2025-01-26" });
    });

    smStream.end();
    const sitemap = await streamToPromise(smStream);

    res.header("Content-Type", "application/xml");
    res.send(sitemap.toString());
  } catch (err) {
    res.status(500).end();
  }
});

// Initialize app
async function initializeApp() {
  const server = await registerRoutes(app);

  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const PORT = process.env.PORT || 5000;
  server.listen(Number(PORT), "0.0.0.0", () => {
    const formattedTime = new Intl.DateTimeFormat("en-US", {
      dateStyle: "short",
      timeStyle: "medium",
    }).format(new Date());

    console.log(`${formattedTime} [express] serving on port ${PORT}`);
    console.log(
      `Server accessible at: https://${process.env.WEB_NAME || "achek.com.ng"}.${process.env.BASE_OWNER || "username"}/caleb`,
    );
  });
}

initializeApp().catch(console.error);
