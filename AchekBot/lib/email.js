// email.js - Send project summary PDF to team email
const nodemailer = require('nodemailer');

const TEAM_EMAIL = process.env.TEAM_EMAIL;
const TEAM_EMAIL_PASS = process.env.TEAM_EMAIL_PASS;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: TEAM_EMAIL,
    pass: TEAM_EMAIL_PASS,
  },
});

async function sendProjectEmail(subject, text, pdfPath) {
  const mailOptions = {
    from: TEAM_EMAIL,
    to: TEAM_EMAIL,
    subject,
    text,
    attachments: [
      {
        filename: 'Achek-Project-Summary.pdf',
        path: pdfPath,
      },
    ],
  };
  return transporter.sendMail(mailOptions);
}

module.exports = { sendProjectEmail };