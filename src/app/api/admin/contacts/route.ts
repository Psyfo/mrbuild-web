/**
 * Contact Management API Routes
 * Handles CRUD operations for contact messages
 */

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { contactService } from '@/lib/services/contact.service';
import { ContactStatus, ContactPriority } from '@/types/contact';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/contacts
 * Fetch all contacts with filtering, pagination, and sorting
 */
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);

    // Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');

    // Sorting
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as
      | 'asc'
      | 'desc';

    // Filters
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const search = searchParams.get('search') || undefined;
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const filters: {
      status?: ContactStatus;
      priority?: ContactPriority;
      search?: string;
      startDate?: Date;
      endDate?: Date;
    } = {};

    if (status) filters.status = status as ContactStatus;
    if (priority) filters.priority = priority as ContactPriority;
    if (search) filters.search = search;
    if (startDate) filters.startDate = new Date(startDate);
    if (endDate) filters.endDate = new Date(endDate);

    const result = await contactService.getContacts(
      filters,
      page,
      pageSize,
      sortBy,
      sortOrder
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/contacts
 * Bulk update contacts
 */
export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { ids, updates } = await req.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'Invalid or missing contact IDs' },
        { status: 400 }
      );
    }

    const modifiedCount = await contactService.bulkUpdateContacts(ids, updates);

    return NextResponse.json({
      success: true,
      modifiedCount,
    });
  } catch (error) {
    console.error('Error updating contacts:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/contacts
 * Bulk delete contacts
 */
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { ids } = await req.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'Invalid or missing contact IDs' },
        { status: 400 }
      );
    }

    const deletedCount = await contactService.bulkDeleteContacts(ids);

    return NextResponse.json({
      success: true,
      deletedCount,
    });
  } catch (error) {
    console.error('Error deleting contacts:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
