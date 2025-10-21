import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

import { authOptions } from '@/lib/auth';
import {
  deleteNavigation,
  getNavigationById,
  updateNavigation,
} from '@/lib/services/navigation.service';

// GET single navigation item
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const navigation = await getNavigationById(params.id);
    if (!navigation) {
      return NextResponse.json(
        { error: 'Navigation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(navigation);
  } catch (error) {
    console.error('Error fetching navigation:', error);
    return NextResponse.json(
      { error: 'Failed to fetch navigation' },
      { status: 500 }
    );
  }
}

// PATCH update navigation item
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Build updates object with only provided fields
    const updates: Record<string, unknown> = {};
    if (body.hasOwnProperty('label')) updates.label = body.label;
    if (body.hasOwnProperty('href')) updates.href = body.href;
    if (body.hasOwnProperty('order')) updates.order = body.order;
    if (body.hasOwnProperty('isActive')) updates.isActive = body.isActive;
    if (body.hasOwnProperty('openInNewTab'))
      updates.openInNewTab = body.openInNewTab;
    if (body.hasOwnProperty('isExternal')) updates.isExternal = body.isExternal;

    const success = await updateNavigation(params.id, updates);

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to update navigation' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'Navigation updated successfully' });
  } catch (error) {
    console.error('Error updating navigation:', error);
    return NextResponse.json(
      { error: 'Failed to update navigation' },
      { status: 500 }
    );
  }
}

// DELETE navigation item
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const success = await deleteNavigation(params.id);

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete navigation' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Navigation deleted successfully' });
  } catch (error) {
    console.error('Error deleting navigation:', error);
    return NextResponse.json(
      { error: 'Failed to delete navigation' },
      { status: 500 }
    );
  }
}
