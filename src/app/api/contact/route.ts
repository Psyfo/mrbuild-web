import { NextResponse } from 'next/server';

// app/api/contact/route.ts

export async function POST(req: Request) {
  const { firstName, lastName, email, message } = await req.json();

  // Handle form submission, e.g., send email or store data
  console.log('Form data:', { firstName, lastName, email, message });

  return NextResponse.json({
    success: true,
    message: 'Message sent successfully',
  });
}
