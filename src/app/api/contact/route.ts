import { NextResponse } from 'next/server';
import { contactService } from '@/lib/services/contact.service';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { firstName, lastName, email, message } = await req.json();

    // Validate required fields
    if (!firstName || !lastName || !email || !message) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Get IP address and user agent
    const headersList = await headers();
    const ipAddress =
      headersList.get('x-forwarded-for') ||
      headersList.get('x-real-ip') ||
      'unknown';
    const userAgent = headersList.get('user-agent') || 'unknown';

    // Create contact using service
    const contact = await contactService.createContact({
      firstName,
      lastName,
      email,
      message,
      ipAddress,
      userAgent,
      source: 'website',
    });

    console.log('Contact created:', contact._id);

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully',
      contactId: contact._id,
    });
  } catch (error) {
    console.error('Error processing contact:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to send message. Please try again later.',
      },
      { status: 500 }
    );
  }
}
