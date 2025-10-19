/**
 * Branch Statistics API Route
 * GET /api/admin/branches/stats - Get branch statistics
 */

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { branchService } from '@/lib/services/branch.service';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/branches/stats
 * Get branch statistics
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const stats = await branchService.getBranchStats();

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching branch stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
