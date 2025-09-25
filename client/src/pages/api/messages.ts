// pages/api/messages.ts
import type { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";

type Data = {
  success: boolean;
  message: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }


  // Log incoming data for debugging
  console.log("Incoming contact data:", req.body);

  // Trim all fields to avoid whitespace issues
  const name = req.body.name?.trim();
  const email = req.body.email?.trim();
  const phone = req.body.phone?.trim();
  const whatsapp = req.body.whatsapp?.trim();
  const projectType = req.body.projectType?.trim();
  const message = req.body.message?.trim();

  if (!name) {
    return res.status(400).json({ success: false, message: "Missing or empty field: name" });
  }
  if (!email) {
    return res.status(400).json({ success: false, message: "Missing or empty field: email" });
  }
  if (!whatsapp) {
    return res.status(400).json({ success: false, message: "Missing or empty field: whatsapp" });
  }
  if (!message) {
    return res.status(400).json({ success: false, message: "Missing or empty field: message" });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      secure: process.env.MAIL_PORT === "465", // SSL if 465
      auth: {
        user: process.env.MAIL_USER_HELLO,
        pass: process.env.MAIL_PASS_HELLO,
      },
    });

    await transporter.sendMail({
      from: process.env.MAIL_FROM_HELLO || `Achek Website <hello@achek.com.ng>`,
      to: process.env.MAIL_USER_HELLO || "hello@achek.com.ng",
      replyTo: email,
      subject: `📩 New Contact Message from ${name}`,
      text: message,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>WhatsApp:</strong> ${whatsapp}</p>
        <p><strong>Project Type:</strong> ${projectType}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    return res.status(200).json({
      success: true,
      message: "Message sent! We'll be in touch soon 🚀",
    });
  } catch (err) {
    console.error("❌ Email send error:", err);
    return res.status(500).json({ success: false, message: "Server error. Try again later." });
  }
}
