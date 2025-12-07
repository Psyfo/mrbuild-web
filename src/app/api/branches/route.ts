/**
 * Public Branches API Route
 * GET /api/branches - Get all active branches for public display
 */

import { NextResponse } from 'next/server';
import { branchService } from '@/lib/services/branch.service';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate every hour

/**
 * GET /api/branches
 * Get all active branches (public endpoint)
 */
export async function GET() {
  try {
    const branches = await branchService.getActiveBranches();

    return NextResponse.json(branches);
  } catch (error) {
    console.error('Error fetching active branches:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
