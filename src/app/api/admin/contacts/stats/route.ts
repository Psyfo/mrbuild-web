/**
 * Contact Statistics API
 * Provides analytics and statistics for contact messages
 */

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { contactService } from '@/lib/services/contact.service';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/contacts/stats
 * Get contact statistics
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const stats = await contactService.getContactStats();

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching contact stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
