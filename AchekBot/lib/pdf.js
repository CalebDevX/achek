// pdf.js - Generate PDF summary for WhatsApp bot
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

async function generateProjectPDF(userId, summary, answers) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const filePath = path.join(__dirname, `../data/project_${userId}.pdf`);
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    doc.fontSize(18).text('Achek Digital Solutions - Project Summary', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(summary);
    doc.moveDown();
    doc.text('---');
    doc.moveDown();
    Object.entries(answers).forEach(([key, value]) => {
      doc.font('Helvetica-Bold').text(`${key.charAt(0).toUpperCase() + key.slice(1)}:`);
      doc.font('Helvetica').text(value);
      doc.moveDown();
    });
    doc.end();
    stream.on('finish', () => resolve(filePath));
    stream.on('error', reject);
  });
}

module.exports = { generateProjectPDF };