import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: Request) {
  const { firstName, lastName, email, message } = await req.json();

  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: parseInt(process.env.MAIL_PORT ?? '465', 10),
    secure: true,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const primaryMailOptions = {
    from: `"Contact Form" <${process.env.MAIL_USER}>`,
    to: process.env.MAIL_TO,
    replyTo: email, // ✅ This allows you to hit reply and message the sender
    subject: 'New Contact Form Submission',
    text: `You have a new message from ${firstName} ${lastName} (${email}):\n\n${message}`,
    html: `<p>You have a new message from <strong>${firstName} ${lastName}</strong> (<a href="mailto:${email}">${email}</a>):</p><p>${message}</p>`,
  };

  const confirmationMailOptions = {
    from: `"MrBuild" <${process.env.MAIL_USER}>`,
    to: email, // ✅ Send confirmation to the form submitter
    subject: 'Thanks for reaching out to us!',
    text: `Hi ${firstName},\n\nThank you for your message. We've received it and will get back to you as soon as possible.\n\n— The MrBuild Team`,
    html: `<p>Hi <strong>${firstName}</strong>,</p>
           <p>Thank you for reaching out. We've received your message and will be in touch shortly.</p>
           <p>— The <strong>MrBuild</strong> Team</p>`,
  };

  try {
    console.log('Incoming form data:', {
      firstName,
      lastName,
      email,
      message,
    });

    // Send main notification
    await transporter.sendMail(primaryMailOptions);

    // Send confirmation to user
    await transporter.sendMail(confirmationMailOptions);

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully',
    });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to send message' },
      { status: 500 }
    );
  }
}
