import nodemailer from 'nodemailer';

const {
  MAIL_PROVIDER,
  MAIL_USER,
  MAIL_PASS,
  MAIL_HOST,
  MAIL_PORT,
  MAIL_SECURE,
  NODE_ENV
} = process.env;

let transport;

switch ((MAIL_PROVIDER || 'gmail').toLowerCase()) {
  case 'gmail':
    transport = { service: 'gmail', auth: { user: MAIL_USER, pass: MAIL_PASS } };
    break;
  case 'outlook':
    transport = {
      host: 'smtp.office365.com',
      port: 587,
      secure: false,
      auth: { user: MAIL_USER, pass: MAIL_PASS }
    };
    break;
  default: // custom SMTP
    transport = {
      host: MAIL_HOST,
      port: Number(MAIL_PORT) || 587,
      secure: MAIL_SECURE === 'true',
      auth: { user: MAIL_USER, pass: MAIL_PASS }
    };
}

const mailer = nodemailer.createTransport(transport);

/**
 * Send a generic email
 */
export const sendMail = async ({ to, subject, text, html }) => {
  if (!MAIL_USER || !MAIL_PASS || NODE_ENV === 'development') {
    // In dev, just log instead of sending
    console.log(`[DEV] Would send mail to ${to}: ${subject}\n${text}`);
    return;
  }
  try {
    await mailer.sendMail({
      from: `"Cluverse" <${MAIL_USER}>`,
      to,
      subject,
      text,
      html
    });
  } catch (err) {
    console.error('Mailer error:', err);
  }
};

/**
 * Send OTP email
 */
export const sendOtp = async (to, code) =>
  sendMail({
    to,
    subject: 'Your OTP for Cluverse',
    text: `Your one-time password is ${code}. It expires in 10 minutes.`
  });
