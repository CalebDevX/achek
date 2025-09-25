import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 4000;

// Fix __dirname for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static dashboard UI
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint for leads (placeholder)
app.get('/api/leads', (req, res) => {
  // TODO: Connect to real leads database
  res.json({ leads: [] });
});

// API endpoint for sessions (placeholder)
app.get('/api/sessions', (req, res) => {
  // TODO: Connect to real session data
  res.json({ sessions: [] });
});

// API endpoint for analytics (placeholder)
app.get('/api/analytics', (req, res) => {
  // TODO: Connect to real analytics
  res.json({ stats: {} });
});

app.listen(PORT, () => {
  console.log(`AchekBot Dashboard running on http://localhost:${PORT}`);
});
