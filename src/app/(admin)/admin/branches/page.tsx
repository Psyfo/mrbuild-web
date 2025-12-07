/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  IBranch,
  BranchStatus,
  BranchType,
  IBranchStats,
} from '@/types/branch';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { AdminFooter } from '@/components/admin/AdminFooter';
import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function BranchManagementPage() {
  const router = useRouter();
  const [branches, setBranches] = useState<IBranch[]>([]);
  const [stats, setStats] = useState<IBranchStats | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<BranchStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<BranchType | 'all'>('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedBranch, setSelectedBranch] = useState<IBranch | null>(null);
  const [sortBy, setSortBy] = useState<string>('displayOrder');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [pageSize, setPageSize] = useState(10);
  const [totalBranches, setTotalBranches] = useState(0);

  // Fetch branches
  const fetchBranches = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        sortBy: sortBy,
        sortOrder: sortOrder,
      });

      if (searchTerm) params.append('search', searchTerm);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (typeFilter !== 'all') params.append('branchType', typeFilter);

      const response = await fetch(`/api/admin/branches?${params}`);
      if (!response.ok) throw new Error('Failed to fetch branches');

      const data = await response.json();
      setBranches(data.branches);
      setTotalPages(data.totalPages);
      setTotalBranches(data.total || 0);
    } catch (error) {
      console.error('Error fetching branches:', error);
      toast.error('Failed to load branches');
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm, statusFilter, typeFilter, sortBy, sortOrder, pageSize]);

  // Fetch stats
  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/branches/stats');
      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  useEffect(() => {
    fetchStats();
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchBranches();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Update branch
  const updateBranch = async (id: string, updates: Partial<IBranch>) => {
    try {
      const response = await fetch(`/api/admin/branches/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) throw new Error('Failed to update branch');

      toast.success('Branch updated successfully');
      fetchBranches();
      fetchStats();
    } catch (error) {
      console.error('Error updating branch:', error);
      toast.error('Failed to update branch');
    }
  };

  // Delete branch
  const deleteBranch = async (id: string) => {
    if (!confirm('Are you sure you want to delete this branch?')) return;

    try {
      const response = await fetch(`/api/admin/branches/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete branch');

      toast.success('Branch deleted successfully');
      fetchBranches();
      fetchStats();
    } catch (error) {
      console.error('Error deleting branch:', error);
      toast.error('Failed to delete branch');
    }
  };

  // Bulk delete
  const bulkDelete = async () => {
    if (selectedIds.size === 0) {
      toast.error('No branches selected');
      return;
    }

    if (
      !confirm(
        `Are you sure you want to delete ${selectedIds.size} branch(es)?`
      )
    )
      return;

    try {
      const ids = Array.from(selectedIds).join(',');
      const response = await fetch(`/api/admin/branches?ids=${ids}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete branches');

      toast.success(`Successfully deleted ${selectedIds.size} branch(es)`);
      setSelectedIds(new Set());
      fetchBranches();
      fetchStats();
    } catch (error) {
      console.error('Error deleting branches:', error);
      toast.error('Failed to delete branches');
    }
  };

  // Selection helpers
  const toggleSelection = (id: string) => {
    const newSelection = new Set(selectedIds);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedIds(newSelection);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === branches.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(branches.map((b) => b._id!)));
    }
  };

  // Format date
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Get status badge variant
  const getStatusVariant = (
    status: BranchStatus
  ):
    | 'default'
    | 'secondary'
    | 'destructive'
    | 'outline'
    | 'success'
    | 'warning'
    | 'muted' => {
    switch (status) {
      case BranchStatus.ACTIVE:
        return 'success'; // Green for active
      case BranchStatus.INACTIVE:
        return 'muted'; // Gray for inactive
      case BranchStatus.COMING_SOON:
        return 'warning'; // Amber for coming soon
      default:
        return 'default';
    }
  };

  // Get type badge color
  const getTypeColor = (type: BranchType): string => {
    return type === BranchType.MR_BUILD ? 'text-blue-600' : 'text-purple-600';
  };

  // Handle sort
  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Get sort icon
  const getSortIcon = (field: string) => {
    if (sortBy !== field) return '↕️';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  // Handle page size change
  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1);
  };

  return (
    <div className='flex flex-col bg-gray-50 min-h-screen'>
      {/* Header */}
      <header className='bg-white border-gray-200 border-b'>
        <div className='mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl'>
          <div className='flex justify-between items-center h-16'>
            <h1 className='font-bold text-gray-900 text-2xl'>
              Branch Management
            </h1>
            <Button onClick={() => router.push('/admin/branches/new')}>
              + Add Branch
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className='flex-1 mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl'>
        <AdminBreadcrumb />

        {/* Stats Cards */}
        {stats && (
          <div className='gap-4 grid grid-cols-1 md:grid-cols-5 mb-8'>
            <Card>
              <CardHeader className='pb-3'>
                <CardDescription>Total</CardDescription>
                <CardTitle className='text-3xl'>{stats.total}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className='pb-3'>
                <CardDescription>Active</CardDescription>
                <CardTitle className='text-green-600 text-3xl'>
                  {stats.active}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className='pb-3'>
                <CardDescription>Inactive</CardDescription>
                <CardTitle className='text-gray-600 text-3xl'>
                  {stats.inactive}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className='pb-3'>
                <CardDescription>Coming Soon</CardDescription>
                <CardTitle className='text-orange-600 text-3xl'>
                  {stats.comingSoon}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className='pb-3'>
                <CardDescription>Mr Build</CardDescription>
                <CardTitle className='text-blue-600 text-3xl'>
                  {stats.byType.mrBuild}
                </CardTitle>
              </CardHeader>
            </Card>
          </div>
        )}

        <Card>
          <CardHeader>
            <div className='flex md:flex-row flex-col justify-between items-start md:items-center gap-4'>
              <div>
                <CardTitle>Branches</CardTitle>
                <CardDescription>
                  Manage your Mr Build and The Builder branch locations
                </CardDescription>
              </div>
              {selectedIds.size > 0 && (
                <Button variant='destructive' size='sm' onClick={bulkDelete}>
                  Delete Selected ({selectedIds.size})
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className='gap-4 grid grid-cols-1 md:grid-cols-3 mb-6'>
              <Input
                placeholder='Search branches...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Select
                value={statusFilter}
                onValueChange={(value) =>
                  setStatusFilter(value as BranchStatus | 'all')
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder='Filter by status' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Statuses</SelectItem>
                  <SelectItem value={BranchStatus.ACTIVE}>Active</SelectItem>
                  <SelectItem value={BranchStatus.INACTIVE}>
                    Inactive
                  </SelectItem>
                  <SelectItem value={BranchStatus.COMING_SOON}>
                    Coming Soon
                  </SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={typeFilter}
                onValueChange={(value) =>
                  setTypeFilter(value as BranchType | 'all')
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder='Filter by type' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Types</SelectItem>
                  <SelectItem value={BranchType.MR_BUILD}>Mr Build</SelectItem>
                  <SelectItem value={BranchType.THE_BUILDER}>
                    The Builder
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {loading ? (
              <div className='py-8 text-center'>Loading...</div>
            ) : (
              <>
                {/* Table */}
                <div className='border rounded-lg overflow-x-auto'>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className='w-12'>
                          <Checkbox
                            checked={
                              selectedIds.size === branches.length &&
                              branches.length > 0
                            }
                            onCheckedChange={toggleSelectAll}
                          />
                        </TableHead>
                        <TableHead
                          className='cursor-pointer'
                          onClick={() => handleSort('branchName')}
                        >
                          Branch Name {getSortIcon('branchName')}
                        </TableHead>
                        <TableHead
                          className='cursor-pointer'
                          onClick={() => handleSort('branchType')}
                        >
                          Type {getSortIcon('branchType')}
                        </TableHead>
                        <TableHead
                          className='cursor-pointer'
                          onClick={() => handleSort('city')}
                        >
                          City {getSortIcon('city')}
                        </TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead
                          className='cursor-pointer'
                          onClick={() => handleSort('status')}
                        >
                          Status {getSortIcon('status')}
                        </TableHead>
                        <TableHead>Active</TableHead>
                        <TableHead className='text-right'>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {branches.map((branch) => (
                        <TableRow
                          key={branch._id}
                          className='hover:bg-gray-100 cursor-pointer'
                          onClick={() => setSelectedBranch(branch)}
                        >
                          <TableCell onClick={(e) => e.stopPropagation()}>
                            <Checkbox
                              checked={selectedIds.has(branch._id!)}
                              onCheckedChange={() =>
                                toggleSelection(branch._id!)
                              }
                            />
                          </TableCell>
                          <TableCell className='font-medium'>
                            {branch.branchName}
                          </TableCell>
                          <TableCell>
                            <span className={getTypeColor(branch.branchType)}>
                              {branch.branchType === BranchType.MR_BUILD
                                ? 'Mr Build'
                                : 'The Builder'}
                            </span>
                          </TableCell>
                          <TableCell>{branch.city}</TableCell>
                          <TableCell onClick={(e) => e.stopPropagation()}>
                            <a
                              href={`tel:${branch.telephone}`}
                              className='text-blue-600 hover:underline'
                            >
                              {branch.telephone}
                            </a>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getStatusVariant(branch.status)}>
                              {branch.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {branch.isActive ? (
                              <Badge variant='success'>✓ Active</Badge>
                            ) : (
                              <Badge variant='muted'>✗ Inactive</Badge>
                            )}
                          </TableCell>
                          <TableCell
                            className='text-right'
                            onClick={(e) => e.stopPropagation()}
                          >
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant='ghost' size='sm'>
                                  •••
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align='end'>
                                <DropdownMenuItem
                                  onClick={() => setSelectedBranch(branch)}
                                >
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() =>
                                    updateBranch(branch._id!, {
                                      isActive: !branch.isActive,
                                    })
                                  }
                                >
                                  {branch.isActive ? 'Deactivate' : 'Activate'}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => deleteBranch(branch._id!)}
                                  className='text-red-600'
                                >
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                <div className='flex sm:flex-row flex-col justify-between items-start sm:items-center gap-4 mt-6 pt-4 border-t'>
                  <div className='flex items-center gap-4'>
                    <div className='text-gray-600 text-sm'>
                      Showing{' '}
                      {totalBranches > 0 ? (page - 1) * pageSize + 1 : 0} to{' '}
                      {Math.min(page * pageSize, totalBranches)} of{' '}
                      {totalBranches} branches
                    </div>
                    <div className='flex items-center gap-2'>
                      <label className='text-gray-600 text-sm'>Show:</label>
                      <Select
                        value={pageSize.toString()}
                        onValueChange={(value) =>
                          handlePageSizeChange(parseInt(value))
                        }
                      >
                        <SelectTrigger className='w-[70px] h-8'>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='5'>5</SelectItem>
                          <SelectItem value='10'>10</SelectItem>
                          <SelectItem value='20'>20</SelectItem>
                          <SelectItem value='50'>50</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Button
                      variant='outline'
                      size='sm'
                      disabled={page === 1}
                      onClick={() => setPage(1)}
                    >
                      First
                    </Button>
                    <Button
                      variant='outline'
                      size='sm'
                      disabled={page === 1}
                      onClick={() => setPage(page - 1)}
                    >
                      Previous
                    </Button>
                    <span className='px-2 text-gray-600 text-sm'>
                      Page {page} of {totalPages || 1}
                    </span>
                    <Button
                      variant='outline'
                      size='sm'
                      disabled={page === totalPages || totalPages === 0}
                      onClick={() => setPage(page + 1)}
                    >
                      Next
                    </Button>
                    <Button
                      variant='outline'
                      size='sm'
                      disabled={page === totalPages || totalPages === 0}
                      onClick={() => setPage(totalPages)}
                    >
                      Last
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Branch Detail Modal */}
        {selectedBranch && (
          <div
            className='z-50 fixed inset-0 flex justify-center items-center bg-black/60 backdrop-blur-sm'
            onClick={() => setSelectedBranch(null)}
          >
            <Card
              className='shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto'
              onClick={(e) => e.stopPropagation()}
            >
              <CardHeader>
                <div className='flex justify-between items-start'>
                  <div>
                    <CardTitle>{selectedBranch.branchName}</CardTitle>
                    <CardDescription>
                      {selectedBranch.city}, {selectedBranch.province}
                    </CardDescription>
                  </div>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => setSelectedBranch(null)}
                  >
                    ✕
                  </Button>
                </div>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='gap-4 grid grid-cols-2'>
                  <div>
                    <h3 className='mb-1 font-semibold text-sm'>Type</h3>
                    <span
                      className={`font-medium ${getTypeColor(
                        selectedBranch.branchType
                      )}`}
                    >
                      {selectedBranch.branchType === BranchType.MR_BUILD
                        ? 'Mr Build'
                        : 'The Builder'}
                    </span>
                  </div>
                  <div>
                    <h3 className='mb-1 font-semibold text-sm'>Status</h3>
                    <Badge variant={getStatusVariant(selectedBranch.status)}>
                      {selectedBranch.status}
                    </Badge>
                  </div>
                </div>

                <div>
                  <h3 className='mb-2 font-semibold'>Address</h3>
                  <p className='text-gray-700'>
                    {selectedBranch.address1}
                    {selectedBranch.address2 && <br />}
                    {selectedBranch.address2}
                    <br />
                    {selectedBranch.city}, {selectedBranch.province}
                    <br />
                    {selectedBranch.postalCode}
                  </p>
                </div>

                <div className='gap-4 grid grid-cols-2'>
                  <div>
                    <h3 className='mb-1 font-semibold text-sm'>Email</h3>
                    <a
                      href={`mailto:${selectedBranch.email}`}
                      className='text-blue-600 hover:underline'
                    >
                      {selectedBranch.email}
                    </a>
                  </div>
                  <div>
                    <h3 className='mb-1 font-semibold text-sm'>Telephone</h3>
                    <a
                      href={`tel:${selectedBranch.telephone}`}
                      className='text-blue-600 hover:underline'
                    >
                      {selectedBranch.telephone}
                    </a>
                  </div>
                </div>

                <div className='gap-4 grid grid-cols-2'>
                  <div>
                    <h3 className='mb-1 font-semibold text-sm'>Latitude</h3>
                    <p className='text-gray-700'>
                      {selectedBranch.coordinates.latitude}
                    </p>
                  </div>
                  <div>
                    <h3 className='mb-1 font-semibold text-sm'>Longitude</h3>
                    <p className='text-gray-700'>
                      {selectedBranch.coordinates.longitude}
                    </p>
                  </div>
                </div>

                <div className='pt-4 border-gray-200 border-t'>
                  <p className='text-gray-600 text-sm'>
                    <strong>Active:</strong>{' '}
                    {selectedBranch.isActive ? 'Yes' : 'No'}
                  </p>
                  <p className='text-gray-600 text-sm'>
                    <strong>Created:</strong>{' '}
                    {formatDate(selectedBranch.createdAt)}
                  </p>
                  <p className='text-gray-600 text-sm'>
                    <strong>Last Updated:</strong>{' '}
                    {formatDate(selectedBranch.updatedAt)}
                  </p>
                </div>

                <div className='flex gap-2 pt-4'>
                  <Button
                    onClick={() => {
                      router.push(`/admin/branches/edit/${selectedBranch._id}`);
                    }}
                  >
                    Edit Branch
                  </Button>
                  <Button
                    variant='outline'
                    onClick={() => {
                      updateBranch(selectedBranch._id!, {
                        isActive: !selectedBranch.isActive,
                      });
                      setSelectedBranch(null);
                    }}
                  >
                    {selectedBranch.isActive ? 'Deactivate' : 'Activate'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
      <AdminFooter />
    </div>
  );
}
