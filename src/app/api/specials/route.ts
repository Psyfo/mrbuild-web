/**
 * Public Specials API
 * GET - Get active specials for public display
 */

import { NextResponse } from 'next/server';
import * as specialService from '@/lib/services/special.service';

// Disable caching to ensure latest specials are always fetched
export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * GET /api/specials
 * Get all active specials for public display
 */
export async function GET() {
  try {
    const specials = await specialService.getActiveSpecials();
    const hasActiveSpecials = specials.length > 0;

    return NextResponse.json({
      specials,
      hasActiveSpecials,
      count: specials.length,
    });
  } catch (error) {
    console.error('Error fetching active specials:', error);
    return NextResponse.json(
      { error: 'Failed to fetch specials' },
      { status: 500 }
    );
  }
}
