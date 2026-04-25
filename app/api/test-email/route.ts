import { sendEmail } from '@/lib/mail';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const testEmail = process.env.SMTP_USER; // Sending to yourself for the test

    if (!testEmail) {
      return NextResponse.json({ error: "SMTP_USER is not defined in .env" }, { status: 400 });
    }

    const info = await sendEmail({
      to: testEmail,
      subject: "Test Email from Skillspill",
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>Hello from Skillspill! 🚀</h2>
          <p>If you are reading this, your Nodemailer and SMTP configuration is working perfectly.</p>
          <p>Your App Password was set up correctly.</p>
        </div>
      `,
    });

    return NextResponse.json({ 
      success: true, 
      message: "Test email sent successfully!", 
      messageId: info.messageId 
    });
  } catch (error: any) {
    console.error("Error sending test email:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
