// WhatsApp receipt polling endpoint for AchekBot
const express = require('express');
const router = express.Router();
const whatsappReceipts = require('./whatsapp-receipts');

// GET /api/pending-whatsapp-receipts
router.get('/api/pending-whatsapp-receipts', (req, res) => {
  // Return and clear all pending receipts
  const receipts = whatsappReceipts.getAndClearReceipts();
  res.json({ success: true, receipts });
});

module.exports = router;
