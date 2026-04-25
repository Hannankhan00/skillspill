require('dotenv').config();
const nodemailer = require('nodemailer');

async function test() {
  console.log("Starting test...");
  
  const smtpOptions = {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  };

  console.log("SMTP Options:", { ...smtpOptions, auth: { user: smtpOptions.auth.user, pass: '***' } });

  const transporter = nodemailer.createTransport(smtpOptions);

  try {
    console.log("Attempting to verify connection...");
    await transporter.verify();
    console.log("Server is ready to take our messages");

    console.log("Attempting to send email...");
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM_EMAIL || '"SkillSpill" <no-reply@skillspill.com>',
      to: process.env.SMTP_USER,
      subject: "Test Email from Node Script",
      text: "This is a test email.",
    });

    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error occurred:", error);
  }
}

test();
