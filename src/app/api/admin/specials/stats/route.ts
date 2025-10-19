/**
 * Admin Specials Statistics API
 * GET - Get special statistics
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import * as specialService from '@/lib/services/special.service';

/**
 * GET /api/admin/specials/stats
 * Get special statistics
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const stats = await specialService.getSpecialStats();

    return NextResponse.json({ stats });
  } catch (error) {
    console.error('Error fetching special stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
