import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

import { authOptions } from '@/lib/auth';
import {
  createNavigation,
  getAllNavigation,
} from '@/lib/services/navigation.service';

// GET all navigation items (admin)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const navigation = await getAllNavigation();
    return NextResponse.json(navigation);
  } catch (error) {
    console.error('Error fetching navigation:', error);
    return NextResponse.json(
      { error: 'Failed to fetch navigation' },
      { status: 500 }
    );
  }
}

// POST create new navigation item
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const navigation = await createNavigation({
      label: body.label,
      href: body.href,
      order: body.order,
      isActive: body.isActive ?? true,
      openInNewTab: body.openInNewTab ?? false,
      isExternal: body.isExternal ?? false,
    });

    return NextResponse.json(navigation, { status: 201 });
  } catch (error) {
    console.error('Error creating navigation:', error);
    return NextResponse.json(
      { error: 'Failed to create navigation' },
      { status: 500 }
    );
  }
}
