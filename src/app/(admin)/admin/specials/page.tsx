/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ISpecial, SpecialStatus, ISpecialStats } from '@/types/special';
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
import Image from 'next/image';

export default function SpecialsManagementPage() {
  const router = useRouter();
  const [specials, setSpecials] = useState<ISpecial[]>([]);
  const [stats, setStats] = useState<ISpecialStats | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<SpecialStatus | 'all'>(
    'all'
  );
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedSpecial, setSelectedSpecial] = useState<ISpecial | null>(null);
  const [sortBy, setSortBy] = useState<string>('displayOrder');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [pageSize, setPageSize] = useState(10);
  const [totalSpecials, setTotalSpecials] = useState(0);

  // Fetch specials
  const fetchSpecials = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        sortBy: sortBy,
        sortOrder: sortOrder,
      });

      if (statusFilter !== 'all') params.append('status', statusFilter);

      const response = await fetch(`/api/admin/specials?${params}`);
      if (!response.ok) throw new Error('Failed to fetch specials');

      const data = await response.json();
      setSpecials(data.specials);
      setTotalPages(data.totalPages);
      setTotalSpecials(data.total || 0);
    } catch (error) {
      console.error('Error fetching specials:', error);
      toast.error('Failed to load specials');
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, sortBy, sortOrder, pageSize]);

  // Fetch stats
  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/specials/stats');
      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      setStats(data.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchSpecials();
    fetchStats();
  }, [fetchSpecials]);

  // Delete special
  const deleteSpecial = async (id: string) => {
    if (!confirm('Are you sure you want to delete this special?')) return;

    try {
      const response = await fetch(`/api/admin/specials/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete special');

      toast.success('Special deleted successfully');
      fetchSpecials();
      fetchStats();
      setSelectedSpecial(null);
    } catch (error) {
      console.error('Error deleting special:', error);
      toast.error('Failed to delete special');
    }
  };

  // Bulk delete
  const bulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (
      !confirm(
        `Are you sure you want to delete ${selectedIds.size} special(s)?`
      )
    )
      return;

    try {
      const response = await fetch('/api/admin/specials', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: Array.from(selectedIds) }),
      });

      if (!response.ok) throw new Error('Failed to delete specials');

      toast.success('Specials deleted successfully');
      setSelectedIds(new Set());
      fetchSpecials();
      fetchStats();
    } catch (error) {
      console.error('Error deleting specials:', error);
      toast.error('Failed to delete specials');
    }
  };

  // Toggle active status
  const toggleActive = async (id: string) => {
    try {
      const special = specials.find((s) => s._id === id);
      if (!special) return;

      const response = await fetch(`/api/admin/specials/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !special.isActive }),
      });

      if (!response.ok) throw new Error('Failed to update special');

      toast.success('Special updated successfully');
      fetchSpecials();
      fetchStats();
    } catch (error) {
      console.error('Error updating special:', error);
      toast.error('Failed to update special');
    }
  };

  // Change status
  const changeStatus = async (id: string, newStatus: SpecialStatus) => {
    try {
      const response = await fetch(`/api/admin/specials/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update status');

      toast.success(`Status changed to ${newStatus} successfully`);
      fetchSpecials();
      fetchStats();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  // Reorder specials - move up
  const moveUp = async (id: string, currentOrder: number) => {
    try {
      // Find the special above this one
      const currentIndex = specials.findIndex((s) => s._id === id);
      if (currentIndex === 0) return; // Already at top

      const specialAbove = specials[currentIndex - 1];
      const newOrder = specialAbove.displayOrder;

      // Update both specials
      await Promise.all([
        fetch(`/api/admin/specials/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ displayOrder: newOrder }),
        }),
        fetch(`/api/admin/specials/${specialAbove._id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ displayOrder: currentOrder }),
        }),
      ]);

      toast.success('Order updated successfully');
      fetchSpecials();
    } catch (error) {
      console.error('Error reordering:', error);
      toast.error('Failed to update order');
    }
  };

  // Reorder specials - move down
  const moveDown = async (id: string, currentOrder: number) => {
    try {
      // Find the special below this one
      const currentIndex = specials.findIndex((s) => s._id === id);
      if (currentIndex === specials.length - 1) return; // Already at bottom

      const specialBelow = specials[currentIndex + 1];
      const newOrder = specialBelow.displayOrder;

      // Update both specials
      await Promise.all([
        fetch(`/api/admin/specials/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ displayOrder: newOrder }),
        }),
        fetch(`/api/admin/specials/${specialBelow._id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ displayOrder: currentOrder }),
        }),
      ]);

      toast.success('Order updated successfully');
      fetchSpecials();
    } catch (error) {
      console.error('Error reordering:', error);
      toast.error('Failed to update order');
    }
  };

  // Selection handlers
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
    if (selectedIds.size === specials.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(specials.map((s) => s._id!)));
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
    status: SpecialStatus
  ): 'success' | 'muted' | 'info' | 'destructive' | 'default' => {
    switch (status) {
      case SpecialStatus.ACTIVE:
        return 'success'; // Green
      case SpecialStatus.INACTIVE:
        return 'muted'; // Gray
      case SpecialStatus.SCHEDULED:
        return 'info'; // Blue
      case SpecialStatus.EXPIRED:
        return 'destructive'; // Red
      default:
        return 'default';
    }
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
              Specials Management
            </h1>
            <Button onClick={() => router.push('/admin/specials/new')}>
              + Add Special
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
              <CardHeader className='pb-2'>
                <CardTitle className='text-gray-600 text-sm'>Total</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='font-bold text-3xl'>{stats.total}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className='pb-2'>
                <CardTitle className='text-green-600 text-sm'>Active</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='font-bold text-3xl'>{stats.active}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className='pb-2'>
                <CardTitle className='text-gray-600 text-sm'>
                  Inactive
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className='font-bold text-3xl'>{stats.inactive}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className='pb-2'>
                <CardTitle className='text-blue-600 text-sm'>
                  Scheduled
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className='font-bold text-3xl'>{stats.scheduled}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className='pb-2'>
                <CardTitle className='text-red-600 text-sm'>Expired</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='font-bold text-3xl'>{stats.expired}</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Alert for section visibility */}
        {stats && (
          <div
            className={`mb-6 rounded-lg border p-4 ${
              stats.hasActiveSpecials
                ? 'border-green-200 bg-green-50'
                : 'border-yellow-200 bg-yellow-50'
            }`}
          >
            <div className='flex items-center gap-2'>
              <span className='text-2xl'>
                {stats.hasActiveSpecials ? '✅' : '⚠️'}
              </span>
              <p className='font-medium'>
                {stats.hasActiveSpecials
                  ? 'Specials section is currently visible on the website'
                  : 'Specials section is currently hidden (no active specials)'}
              </p>
            </div>
          </div>
        )}

        {/* Filters and Actions */}
        <Card className='mb-6'>
          <CardContent className='pt-6'>
            <div className='flex md:flex-row flex-col md:justify-between md:items-center gap-4'>
              <div className='flex md:flex-row flex-col md:items-center gap-4'>
                <Select
                  value={statusFilter}
                  onValueChange={(value) =>
                    setStatusFilter(value as SpecialStatus | 'all')
                  }
                >
                  <SelectTrigger className='w-[180px]'>
                    <SelectValue placeholder='Filter by status' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>All Status</SelectItem>
                    <SelectItem value={SpecialStatus.ACTIVE}>Active</SelectItem>
                    <SelectItem value={SpecialStatus.INACTIVE}>
                      Inactive
                    </SelectItem>
                    <SelectItem value={SpecialStatus.SCHEDULED}>
                      Scheduled
                    </SelectItem>
                    <SelectItem value={SpecialStatus.EXPIRED}>
                      Expired
                    </SelectItem>
                  </SelectContent>
                </Select>

                {statusFilter !== 'all' && (
                  <Button
                    variant='outline'
                    onClick={() => setStatusFilter('all')}
                  >
                    Clear Filters
                  </Button>
                )}
              </div>

              {selectedIds.size > 0 && (
                <Button variant='destructive' onClick={bulkDelete}>
                  Delete Selected ({selectedIds.size})
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Specials Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Specials</CardTitle>
            <CardDescription>
              Manage promotional specials and brochures
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className='py-8 text-center'>Loading...</div>
            ) : specials.length === 0 ? (
              <div className='py-8 text-gray-500 text-center'>
                No specials found. Create your first special to get started!
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className='w-[50px]'>
                        <Checkbox
                          checked={
                            selectedIds.size === specials.length &&
                            specials.length > 0
                          }
                          onCheckedChange={toggleSelectAll}
                        />
                      </TableHead>
                      <TableHead className='w-[100px]'>Image</TableHead>
                      <TableHead
                        className='cursor-pointer'
                        onClick={() => handleSort('title')}
                      >
                        Title {getSortIcon('title')}
                      </TableHead>
                      <TableHead
                        className='cursor-pointer'
                        onClick={() => handleSort('status')}
                      >
                        Status {getSortIcon('status')}
                      </TableHead>
                      <TableHead
                        className='cursor-pointer'
                        onClick={() => handleSort('displayOrder')}
                      >
                        Order {getSortIcon('displayOrder')}
                      </TableHead>
                      <TableHead
                        className='cursor-pointer'
                        onClick={() => handleSort('createdAt')}
                      >
                        Created {getSortIcon('createdAt')}
                      </TableHead>
                      <TableHead className='text-right'>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {specials.map((special) => (
                      <TableRow
                        key={special._id}
                        className='hover:bg-gray-50 cursor-pointer'
                        onClick={() => setSelectedSpecial(special)}
                      >
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <Checkbox
                            checked={selectedIds.has(special._id!)}
                            onCheckedChange={() =>
                              toggleSelection(special._id!)
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Image
                            src={special.image.secureUrl}
                            alt={special.title}
                            width={60}
                            height={60}
                            className='rounded object-cover'
                          />
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className='font-medium'>{special.title}</p>
                            {special.description && (
                              <p className='text-gray-500 text-sm line-clamp-1'>
                                {special.description}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(special.status)}>
                            {special.status}
                          </Badge>
                          {!special.isActive && (
                            <Badge variant='warning' className='ml-2'>
                              Hidden
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <div className='flex items-center gap-2'>
                            <span className='min-w-[30px]'>
                              {special.displayOrder}
                            </span>
                            <div className='flex flex-col gap-1'>
                              <Button
                                variant='ghost'
                                size='sm'
                                className='hover:bg-gray-200 p-0 w-5 h-5'
                                onClick={() =>
                                  moveUp(special._id!, special.displayOrder)
                                }
                                disabled={specials.indexOf(special) === 0}
                                title='Move up'
                              >
                                ▲
                              </Button>
                              <Button
                                variant='ghost'
                                size='sm'
                                className='hover:bg-gray-200 p-0 w-5 h-5'
                                onClick={() =>
                                  moveDown(special._id!, special.displayOrder)
                                }
                                disabled={
                                  specials.indexOf(special) ===
                                  specials.length - 1
                                }
                                title='Move down'
                              >
                                ▼
                              </Button>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(special.createdAt)}</TableCell>
                        <TableCell
                          className='text-right'
                          onClick={(e) => e.stopPropagation()}
                        >
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant='ghost' size='sm'>
                                ⋮
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align='end'>
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => setSelectedSpecial(special)}
                              >
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  router.push(
                                    `/admin/specials/edit/${special._id}`
                                  )
                                }
                              >
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuLabel>Visibility</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() => toggleActive(special._id!)}
                              >
                                {special.isActive ? 'Hide' : 'Show'}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuLabel>
                                Change Status
                              </DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() =>
                                  changeStatus(
                                    special._id!,
                                    SpecialStatus.ACTIVE
                                  )
                                }
                                disabled={
                                  special.status === SpecialStatus.ACTIVE
                                }
                              >
                                <span className='flex items-center gap-2'>
                                  <span className='bg-green-500 rounded-full w-2 h-2'></span>
                                  Active
                                </span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  changeStatus(
                                    special._id!,
                                    SpecialStatus.INACTIVE
                                  )
                                }
                                disabled={
                                  special.status === SpecialStatus.INACTIVE
                                }
                              >
                                <span className='flex items-center gap-2'>
                                  <span className='bg-gray-400 rounded-full w-2 h-2'></span>
                                  Inactive
                                </span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  changeStatus(
                                    special._id!,
                                    SpecialStatus.SCHEDULED
                                  )
                                }
                                disabled={
                                  special.status === SpecialStatus.SCHEDULED
                                }
                              >
                                <span className='flex items-center gap-2'>
                                  <span className='bg-blue-500 rounded-full w-2 h-2'></span>
                                  Scheduled
                                </span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  changeStatus(
                                    special._id!,
                                    SpecialStatus.EXPIRED
                                  )
                                }
                                disabled={
                                  special.status === SpecialStatus.EXPIRED
                                }
                              >
                                <span className='flex items-center gap-2'>
                                  <span className='bg-red-500 rounded-full w-2 h-2'></span>
                                  Expired
                                </span>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => deleteSpecial(special._id!)}
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

                {/* Pagination */}
                <div className='flex justify-between items-center mt-4'>
                  <div className='text-gray-600 text-sm'>
                    Showing {(page - 1) * pageSize + 1} to{' '}
                    {Math.min(page * pageSize, totalSpecials)} of{' '}
                    {totalSpecials} specials
                  </div>
                  <div className='flex items-center gap-2'>
                    <Select
                      value={pageSize.toString()}
                      onValueChange={(value) =>
                        handlePageSizeChange(parseInt(value))
                      }
                    >
                      <SelectTrigger className='w-[100px]'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='5'>5</SelectItem>
                        <SelectItem value='10'>10</SelectItem>
                        <SelectItem value='20'>20</SelectItem>
                        <SelectItem value='50'>50</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant='outline'
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1}
                    >
                      Previous
                    </Button>
                    <span className='text-sm'>
                      Page {page} of {totalPages}
                    </span>
                    <Button
                      variant='outline'
                      onClick={() => setPage(page + 1)}
                      disabled={page === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Detail Modal */}
        {selectedSpecial && (
          <div
            className='z-50 fixed inset-0 flex justify-center items-center bg-black/60 backdrop-blur-sm'
            onClick={() => setSelectedSpecial(null)}
          >
            <Card
              className='shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto'
              onClick={(e) => e.stopPropagation()}
            >
              <CardHeader>
                <div className='flex justify-between items-start'>
                  <div>
                    <CardTitle>{selectedSpecial.title}</CardTitle>
                    <CardDescription>
                      {selectedSpecial.description || 'No description'}
                    </CardDescription>
                  </div>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => setSelectedSpecial(null)}
                  >
                    ✕
                  </Button>
                </div>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='flex justify-center'>
                  <Image
                    src={selectedSpecial.image.secureUrl}
                    alt={selectedSpecial.title}
                    width={selectedSpecial.image.width}
                    height={selectedSpecial.image.height}
                    className='rounded-lg w-auto max-w-md max-h-96 object-contain'
                  />
                </div>

                <div className='gap-4 grid grid-cols-2'>
                  <div>
                    <h3 className='mb-1 font-semibold text-sm'>Status</h3>
                    <Badge variant={getStatusVariant(selectedSpecial.status)}>
                      {selectedSpecial.status}
                    </Badge>
                  </div>
                  <div>
                    <h3 className='mb-1 font-semibold text-sm'>Visibility</h3>
                    <Badge
                      variant={selectedSpecial.isActive ? 'success' : 'muted'}
                    >
                      {selectedSpecial.isActive ? '✓ Visible' : '○ Hidden'}
                    </Badge>
                  </div>
                </div>

                <div className='gap-4 grid grid-cols-2'>
                  <div>
                    <h3 className='mb-1 font-semibold text-sm'>
                      Display Order
                    </h3>
                    <p className='text-gray-700'>
                      {selectedSpecial.displayOrder}
                    </p>
                  </div>
                  <div>
                    <h3 className='mb-1 font-semibold text-sm'>Image Size</h3>
                    <p className='text-gray-700'>
                      {selectedSpecial.image.width} x{' '}
                      {selectedSpecial.image.height}
                    </p>
                  </div>
                </div>

                {(selectedSpecial.validFrom || selectedSpecial.validUntil) && (
                  <div className='gap-4 grid grid-cols-2'>
                    {selectedSpecial.validFrom && (
                      <div>
                        <h3 className='mb-1 font-semibold text-sm'>
                          Valid From
                        </h3>
                        <p className='text-gray-700'>
                          {formatDate(selectedSpecial.validFrom)}
                        </p>
                      </div>
                    )}
                    {selectedSpecial.validUntil && (
                      <div>
                        <h3 className='mb-1 font-semibold text-sm'>
                          Valid Until
                        </h3>
                        <p className='text-gray-700'>
                          {formatDate(selectedSpecial.validUntil)}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                <div className='pt-4 border-gray-200 border-t'>
                  <p className='text-gray-600 text-sm'>
                    <strong>Created:</strong>{' '}
                    {formatDate(selectedSpecial.createdAt)}
                  </p>
                  <p className='text-gray-600 text-sm'>
                    <strong>Last Updated:</strong>{' '}
                    {formatDate(selectedSpecial.updatedAt)}
                  </p>
                </div>

                <div className='flex gap-2 pt-4'>
                  <Button
                    onClick={() => {
                      router.push(
                        `/admin/specials/edit/${selectedSpecial._id}`
                      );
                    }}
                  >
                    Edit Special
                  </Button>
                  <Button
                    variant='outline'
                    onClick={() => {
                      toggleActive(selectedSpecial._id!);
                      setSelectedSpecial(null);
                    }}
                  >
                    {selectedSpecial.isActive ? 'Hide' : 'Show'}
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
