import sgMail from '@sendgrid/mail';

if (!process.env.SENDGRID_API_KEY) {
  console.warn('⚠️ SENDGRID_API_KEY is not set. Email functionality will be disabled.');
} else {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  console.log('✅ SendGrid initialized successfully');
  console.log('📧 Make sure to authenticate your domain in SendGrid for better deliverability');
  console.log('🔐 Recommended: Add SPF record: v=spf1 include:sendgrid.net ~all');
}

// Sender for receipts to users
const RECEIPT_FROM_EMAIL = process.env.EMAIL_SENDER || 'info@achek.com.ng';
// Sender for contact form emails (to team) - extract just the email from the format
const CONTACT_FROM_EMAIL = (process.env.MAIL_FROM_HELLO || 'hello@achek.com.ng').match(/<(.+)>/) 
  ? (process.env.MAIL_FROM_HELLO || '').match(/<(.+)>/)![1] 
  : process.env.MAIL_FROM_HELLO || 'hello@achek.com.ng';
// Default team email for receiving messages
const DEFAULT_TEAM_EMAIL = process.env.TEAM_EMAIL || 'team@achek.com.ng';

interface ReceiptData {
  name: string;
  email: string;
  service: string;
  package: string;
  amount: number;
  whatsapp: string;
}

export async function sendReceiptEmail(data: ReceiptData): Promise<boolean> {
  if (!process.env.SENDGRID_API_KEY) {
    console.error('❌ SendGrid API key not configured. Cannot send receipt email.');
    return false;
  }

  try {
    console.log('📧 Attempting to send receipt email...');
    console.log('   To:', data.email);
    console.log('   From:', RECEIPT_FROM_EMAIL);

    const logoUrl = `${process.env.BASE_URL || "https://achek.com.ng"}/public/achek-logo.png`;
    const transactionNumber = `ACH-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const formattedDate = new Date().toLocaleDateString();

    const msg = {
      to: data.email,
      from: RECEIPT_FROM_EMAIL,
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
            <tr><td><strong>Amount Paid:</strong></td><td>₦${data.amount.toLocaleString()}</td></tr>
          </table>
          <hr style='margin:24px 0;' />
          <p style='font-size:15px;'>Our team will contact you via WhatsApp at <strong>${data.whatsapp}</strong> to begin your project onboarding immediately.</p>
          <p style='font-size:15px;'>If you have any questions, reply to this email or chat us on WhatsApp.</p>
          <div style='margin-top:32px;font-size:12px;color:#888;text-align:center;'>Achek Digital Solutions &copy; 2025</div>
        </div>
      `,
    };

    const response = await sgMail.send(msg);
    console.log('✅ Receipt email sent successfully!');
    console.log('   Response status:', response[0]?.statusCode);
    return true;
  } catch (error: any) {
    console.error('❌ Failed to send receipt email:');
    console.error('   To:', data.email);
    console.error('   From:', RECEIPT_FROM_EMAIL);
    console.error('   Error code:', error?.code);
    console.error('   Error message:', error?.message);

    // Check for specific error types
    if (error?.response?.body?.errors) {
      console.error('   SendGrid Errors:', JSON.stringify(error.response.body.errors, null, 2));
    }

    // Check for RBL/blocklist issues
    if (error?.message?.includes('RBL') || error?.message?.includes('blocked')) {
      console.error('   ⚠️ IP BLOCKLIST DETECTED: SendGrid IP is on a spam blocklist');
      console.error('   Solution: Authenticate your domain in SendGrid Dashboard');
      console.error('   Or use a different recipient email (Gmail, Outlook, etc.) for testing');
    }

    console.error('   Response body:', JSON.stringify(error?.response?.body, null, 2));
    return false;
  }
}

interface AdminNotificationData {
  name: string;
  email: string;
  service: string;
  package: string;
  amount: number;
  whatsapp: string;
}

export async function sendAdminNotification(data: AdminNotificationData): Promise<boolean> {
  if (!process.env.SENDGRID_API_KEY) {
    console.error('❌ SendGrid API key not configured. Cannot send admin notification.');
    return false;
  }

  try {
    console.log('📧 Attempting to send admin notification...');
    console.log('   To:', DEFAULT_TEAM_EMAIL);
    console.log('   From:', CONTACT_FROM_EMAIL);

    const logoUrl = `${process.env.BASE_URL || "https://achek.com.ng"}/public/achek-logo.png`;

    const msg = {
      to: DEFAULT_TEAM_EMAIL,
      from: CONTACT_FROM_EMAIL,
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
          <p><strong>Amount Paid:</strong> ₦${data.amount.toLocaleString()}</p>
          <hr style='margin:24px 0;' />
          <p>Contact the client on WhatsApp to begin onboarding.</p>
          <div style='margin-top:32px;font-size:12px;color:#888;text-align:center;'>Achek Digital Solutions &copy; 2025</div>
        </div>
      `,
    };

    const response = await sgMail.send(msg);
    console.log('✅ Admin notification sent successfully!');
    console.log('   Response status:', response[0]?.statusCode);
    return true;
  } catch (error: any) {
    console.error('❌ Failed to send admin notification:');
    console.error('   To:', DEFAULT_TEAM_EMAIL);
    console.error('   From:', CONTACT_FROM_EMAIL);
    console.error('   Error code:', error?.code);
    console.error('   Error message:', error?.message);

    // Check for specific error types
    if (error?.response?.body?.errors) {
      console.error('   SendGrid Errors:', JSON.stringify(error.response.body.errors, null, 2));
    }

    // Check for RBL/blocklist issues
    if (error?.message?.includes('RBL') || error?.message?.includes('blocked')) {
      console.error('   ⚠️ IP BLOCKLIST DETECTED: SendGrid IP is on a spam blocklist');
      console.error('   Solution: Authenticate your domain in SendGrid Dashboard');
    }

    console.error('   Response body:', JSON.stringify(error?.response?.body, null, 2));
    return false;
  }
}

interface ContactMessage {
  name: string;
  email: string;
  phone?: string;
  whatsapp: string;
  projectType?: string;
  message: string;
}

export async function sendContactEmail(data: ContactMessage): Promise<boolean> {
  if (!process.env.SENDGRID_API_KEY) {
    console.error('❌ SendGrid API key not configured. Cannot send contact email.');
    return false;
  }

  try {
    console.log('📧 Attempting to send contact email to:', DEFAULT_TEAM_EMAIL);

    const msg = {
      to: DEFAULT_TEAM_EMAIL,
      from: CONTACT_FROM_EMAIL,
      subject: `New Contact Form Message from ${data.name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone || 'Not provided'}</p>
        <p><strong>WhatsApp:</strong> ${data.whatsapp}</p>
        <p><strong>Project Type:</strong> ${data.projectType || 'Not specified'}</p>
        <p><strong>Message:</strong></p>
        <p>${data.message}</p>
      `,
    };

    await sgMail.send(msg);
    console.log('✅ Contact email sent successfully to:', DEFAULT_TEAM_EMAIL);
    return true;
  } catch (error: any) {
    console.error('❌ Failed to send contact email:');
    console.error('   To:', DEFAULT_TEAM_EMAIL);
    console.error('   From:', CONTACT_FROM_EMAIL);
    console.error('   Error message:', error?.message);

    // Check for specific error types
    if (error?.response?.body?.errors) {
      console.error('   SendGrid Errors:', JSON.stringify(error.response.body.errors, null, 2));
    }

    // Check for RBL/blocklist issues
    if (error?.message?.includes('RBL') || error?.message?.includes('blocked')) {
      console.error('   ⚠️ IP BLOCKLIST DETECTED: SendGrid IP is on a spam blocklist');
      console.error('   Solution: Authenticate your domain in SendGrid Dashboard');
    }

    console.error('   Full error:', error?.response?.body || error);
    return false;
  }
}
