import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

// app/api/contact/route.ts

export async function POST(req: Request) {
  const { firstName, lastName, email, message } = await req.json();

  // Create a Nodemailer transporter
  const transporter = nodemailer.createTransport({
    host: 'smtppro.zoho.com', // Replace with your SMTP host
    port: 465, // Common port for SMTP
    secure: true, // Use true for 465, false for other ports
    auth: {
      user: '', // Replace with your email
      pass: '', // Replace with your email password
    },
  });

  // Email options
  const mailOptions = {
    from: `"Contact Form" <>`, // Sender address
    to: '', // Recipient address
    subject: 'New Contact Form Submission', // Subject line
    text: `You have a new message from ${firstName} ${lastName} (${email}):\n\n${message}`, // Plain text body
    html: `<p>You have a new message from <strong>${firstName} ${lastName}</strong> (<a href="mailto:${email}">${email}</a>):</p><p>${message}</p>`, // HTML body
  };

  try {
    // Send the email
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully',
    });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to send message',
      },
      { status: 500 }
    );
  }
}
