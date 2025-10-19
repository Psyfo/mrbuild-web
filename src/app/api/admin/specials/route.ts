/**
 * Admin Specials API Routes
 * GET - List specials with filters and pagination
 * POST - Create new special with image upload
 * DELETE - Bulk delete specials
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import * as specialService from '@/lib/services/special.service';
import { SpecialStatus } from '@/types/special';

/**
 * GET /api/admin/specials
 * List specials with filters and pagination
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const status = searchParams.get('status') as SpecialStatus | null;
    const isActive = searchParams.get('isActive');
    const sortBy = searchParams.get('sortBy') || 'displayOrder';
    const sortOrder = (searchParams.get('sortOrder') || 'asc') as
      | 'asc'
      | 'desc';

    const params: any = {
      page,
      pageSize,
      sortBy,
      sortOrder,
    };

    if (status) params.status = status;
    if (isActive !== null) params.isActive = isActive === 'true';

    const result = await specialService.getSpecials(params);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching specials:', error);
    return NextResponse.json(
      { error: 'Failed to fetch specials' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/specials
 * Create new special with image upload
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      description,
      image,
      status,
      displayOrder,
      validFrom,
      validUntil,
      isActive,
    } = body;

    // Validate required fields
    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    if (!image) {
      return NextResponse.json({ error: 'Image is required' }, { status: 400 });
    }

    // Create special with image upload
    const special = await specialService.createSpecialWithUpload(title, image, {
      description,
      status,
      displayOrder,
      validFrom: validFrom ? new Date(validFrom) : undefined,
      validUntil: validUntil ? new Date(validUntil) : undefined,
      isActive,
    });

    return NextResponse.json(
      { special, message: 'Special created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating special:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Failed to create special',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/specials
 * Bulk delete specials
 */
export async function DELETE(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { ids } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'Invalid or empty IDs array' },
        { status: 400 }
      );
    }

    const deletedCount = await specialService.bulkDeleteSpecials(ids);

    return NextResponse.json({
      message: `Successfully deleted ${deletedCount} special(s)`,
      deletedCount,
    });
  } catch (error) {
    console.error('Error deleting specials:', error);
    return NextResponse.json(
      { error: 'Failed to delete specials' },
      { status: 500 }
    );
  }
}
