/**
 * Branch Management API Routes
 * GET /api/admin/branches - List all branches with filters
 * POST /api/admin/branches - Create new branch
 * PATCH /api/admin/branches - Bulk update branches
 * DELETE /api/admin/branches - Bulk delete branches
 */

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { branchService } from '@/lib/services/branch.service';
import { BranchStatus, BranchType, IBranchFormData } from '@/types/branch';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/branches
 * Fetch all branches with filtering, pagination, and sorting
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
    const sortBy = searchParams.get('sortBy') || 'displayOrder';
    const sortOrder = (searchParams.get('sortOrder') || 'asc') as
      | 'asc'
      | 'desc';

    // Filters
    const status = searchParams.get('status');
    const branchType = searchParams.get('branchType');
    const city = searchParams.get('city');
    const province = searchParams.get('province');
    const search = searchParams.get('search') || undefined;
    const isActiveParam = searchParams.get('isActive');

    const filters: {
      status?: BranchStatus;
      branchType?: BranchType;
      city?: string;
      province?: string;
      isActive?: boolean;
      search?: string;
    } = {};

    if (status) filters.status = status as BranchStatus;
    if (branchType) filters.branchType = branchType as BranchType;
    if (city) filters.city = city;
    if (province) filters.province = province;
    if (search) filters.search = search;
    if (isActiveParam !== null) {
      filters.isActive = isActiveParam === 'true';
    }

    const result = await branchService.getBranches(
      filters,
      page,
      pageSize,
      sortBy,
      sortOrder
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching branches:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/branches
 * Create a new branch
 */
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const branchData: IBranchFormData = body;

    const branch = await branchService.createBranch(branchData);

    return NextResponse.json(branch, { status: 201 });
  } catch (error) {
    console.error('Error creating branch:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/branches
 * Bulk delete branches
 */
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const idsParam = searchParams.get('ids');

    if (!idsParam) {
      return NextResponse.json(
        { error: 'No branch IDs provided' },
        { status: 400 }
      );
    }

    const ids = idsParam.split(',');
    const deletedCount = await branchService.bulkDeleteBranches(ids);

    return NextResponse.json({
      message: `Successfully deleted ${deletedCount} branch(es)`,
      deletedCount,
    });
  } catch (error) {
    console.error('Error deleting branches:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
