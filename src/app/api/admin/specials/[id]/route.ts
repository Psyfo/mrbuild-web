/**
 * Admin Single Special API Routes
 * GET - Get single special
 * PATCH - Update special
 * DELETE - Delete special
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import * as specialService from '@/lib/services/special.service';

interface RouteParams {
  params: {
    id: string;
  };
}

/**
 * GET /api/admin/specials/:id
 * Get single special
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const special = await specialService.getSpecialById(params.id);

    if (!special) {
      return NextResponse.json({ error: 'Special not found' }, { status: 404 });
    }

    return NextResponse.json({ special });
  } catch (error) {
    console.error('Error fetching special:', error);
    return NextResponse.json(
      { error: 'Failed to fetch special' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/specials/:id
 * Update special
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Build updates object with only provided fields
    const updates: Record<string, any> = {};

    // Only include fields that are explicitly provided in the request
    if (body.hasOwnProperty('title')) updates.title = body.title;
    if (body.hasOwnProperty('description'))
      updates.description = body.description;
    if (body.hasOwnProperty('status')) updates.status = body.status;
    if (body.hasOwnProperty('displayOrder'))
      updates.displayOrder = body.displayOrder;
    if (body.hasOwnProperty('isActive')) updates.isActive = body.isActive;

    // Handle date fields with proper conversion
    if (body.hasOwnProperty('validFrom')) {
      updates.validFrom = body.validFrom ? new Date(body.validFrom) : null;
    }
    if (body.hasOwnProperty('validUntil')) {
      updates.validUntil = body.validUntil ? new Date(body.validUntil) : null;
    }

    let special;

    // If new image provided, update with image upload
    if (
      body.image &&
      typeof body.image === 'string' &&
      body.image.startsWith('data:image')
    ) {
      special = await specialService.updateSpecialWithUpload(
        params.id,
        body.image,
        updates
      );
    } else {
      // Update without changing image
      special = await specialService.updateSpecial(params.id, updates);
    }

    if (!special) {
      return NextResponse.json({ error: 'Special not found' }, { status: 404 });
    }

    return NextResponse.json({
      special,
      message: 'Special updated successfully',
    });
  } catch (error) {
    console.error('Error updating special:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Failed to update special',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/specials/:id
 * Delete special
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const success = await specialService.deleteSpecial(params.id);

    if (!success) {
      return NextResponse.json({ error: 'Special not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Special deleted successfully' });
  } catch (error) {
    console.error('Error deleting special:', error);
    return NextResponse.json(
      { error: 'Failed to delete special' },
      { status: 500 }
    );
  }
}
