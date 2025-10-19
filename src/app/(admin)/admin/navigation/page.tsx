'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { INavigation } from '@/types/navigation';
import { toast } from 'sonner';
import { MoreHorizontal, ArrowUp, ArrowDown, ExternalLink } from 'lucide-react';
import { AdminFooter } from '@/components/admin/AdminFooter';
import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb';

export default function NavigationManagementPage() {
  const router = useRouter();
  const [navigation, setNavigation] = useState<INavigation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNavigation, setSelectedNavigation] =
    useState<INavigation | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    external: 0,
    internal: 0,
  });

  useEffect(() => {
    fetchNavigation();
  }, []);

  const fetchNavigation = async () => {
    try {
      const response = await fetch('/api/admin/navigation');
      if (response.ok) {
        const data = await response.json();
        setNavigation(data);

        // Calculate stats
        const total = data.length;
        const active = data.filter((item: INavigation) => item.isActive).length;
        const inactive = total - active;
        const external = data.filter(
          (item: INavigation) => item.isExternal
        ).length;
        const internal = total - external;

        setStats({ total, active, inactive, external, internal });
      } else {
        toast.error('Failed to fetch navigation');
      }
    } catch (error) {
      console.error('Error fetching navigation:', error);
      toast.error('Error fetching navigation');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this navigation item?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/navigation/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Navigation item deleted successfully');
        fetchNavigation();
      } else {
        toast.error('Failed to delete navigation item');
      }
    } catch (error) {
      console.error('Error deleting navigation:', error);
      toast.error('Error deleting navigation item');
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/navigation/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (response.ok) {
        toast.success(
          `Navigation item ${!currentStatus ? 'activated' : 'deactivated'}`
        );
        fetchNavigation();
      } else {
        toast.error('Failed to update navigation item');
      }
    } catch (error) {
      console.error('Error updating navigation:', error);
      toast.error('Error updating navigation item');
    }
  };

  const handleReorder = async (id: string, direction: 'up' | 'down') => {
    const index = navigation.findIndex((item) => item._id === id);
    if (index === -1) return;

    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === navigation.length - 1) return;

    const newNavigation = [...navigation];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    // Swap items
    [newNavigation[index], newNavigation[targetIndex]] = [
      newNavigation[targetIndex],
      newNavigation[index],
    ];

    // Update order values
    const updates = newNavigation.map((item, idx) => ({
      id: item._id!,
      order: idx + 1,
    }));

    try {
      // Optimistically update UI
      setNavigation(newNavigation);

      // Send updates to server
      await Promise.all(
        updates.map((update) =>
          fetch(`/api/admin/navigation/${update.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ order: update.order }),
          })
        )
      );

      toast.success('Order updated successfully');
    } catch (error) {
      console.error('Error reordering navigation:', error);
      toast.error('Failed to update order');
      fetchNavigation(); // Revert on error
    }
  };

  return (
    <div className='flex flex-col bg-gray-50 min-h-screen'>
      {/* Header */}
      <header className='bg-white border-gray-200 border-b'>
        <div className='mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl'>
          <div className='flex justify-between items-center h-16'>
            <h1 className='font-bold text-gray-900 text-2xl'>
              Navigation Management
            </h1>
            <Button onClick={() => router.push('/admin/navigation/new')}>
              + Add Navigation Item
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className='flex-1 mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl'>
        <AdminBreadcrumb />
        {/* Stats Cards */}
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
              <CardTitle className='text-gray-600 text-sm'>Inactive</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='font-bold text-3xl'>{stats.inactive}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-blue-600 text-sm'>External</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='font-bold text-3xl'>{stats.external}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-purple-600 text-sm'>
                Internal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className='font-bold text-3xl'>{stats.internal}</p>
            </CardContent>
          </Card>
        </div>

        {/* Alert for section visibility */}
        <div
          className={`mb-6 rounded-lg border p-4 ${
            stats.active > 0
              ? 'border-green-200 bg-green-50'
              : 'border-yellow-200 bg-yellow-50'
          }`}
        >
          <div className='flex items-center gap-2'>
            <span className='text-2xl'>{stats.active > 0 ? '✅' : '⚠️'}</span>
            <p className='font-medium'>
              {stats.active > 0
                ? `Navigation has ${stats.active} active item${
                    stats.active !== 1 ? 's' : ''
                  } visible on the website`
                : 'No active navigation items - website navigation is empty'}
            </p>
          </div>
        </div>

        {/* Navigation Table */}
        <Card>
          <CardHeader>
            <CardTitle>Navigation Items</CardTitle>
            <CardDescription>
              Manage website navigation menu items and their display order
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className='py-8 text-center'>Loading...</div>
            ) : navigation.length === 0 ? (
              <div className='py-8 text-center'>
                <p className='mb-4 text-gray-500'>No navigation items yet</p>
                <Button onClick={() => router.push('/admin/navigation/new')}>
                  Create Your First Navigation Item
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order</TableHead>
                    <TableHead>Label</TableHead>
                    <TableHead>Link</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {navigation.map((item, index) => (
                    <TableRow
                      key={item._id}
                      className='hover:bg-gray-50 transition-colors cursor-pointer'
                      onClick={() => setSelectedNavigation(item)}
                    >
                      <TableCell>
                        <div className='flex items-center gap-2'>
                          <span className='font-mono'>{item.order}</span>
                          <div className='flex flex-col gap-1'>
                            <Button
                              variant='ghost'
                              size='sm'
                              onClick={(e) => {
                                e.stopPropagation();
                                handleReorder(item._id!, 'up');
                              }}
                              disabled={index === 0}
                              className='p-0 w-5 h-5'
                            >
                              <ArrowUp className='w-3 h-3' />
                            </Button>
                            <Button
                              variant='ghost'
                              size='sm'
                              onClick={(e) => {
                                e.stopPropagation();
                                handleReorder(item._id!, 'down');
                              }}
                              disabled={index === navigation.length - 1}
                              className='p-0 w-5 h-5'
                            >
                              <ArrowDown className='w-3 h-3' />
                            </Button>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className='font-medium'>
                        {item.label}
                      </TableCell>
                      <TableCell>
                        <div className='flex items-center gap-2'>
                          <code className='bg-gray-100 px-2 py-1 rounded text-sm'>
                            {item.href}
                          </code>
                          {item.isExternal && (
                            <ExternalLink className='w-4 h-4 text-blue-500' />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={item.isActive ? 'success' : 'muted'}>
                          {item.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant='outline'>
                          {item.isExternal ? 'External' : 'Internal'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant='ghost'
                              className='p-0 w-8 h-8'
                              onClick={(e) => e.stopPropagation()}
                            >
                              <span className='sr-only'>Open menu</span>
                              <MoreHorizontal className='w-4 h-4' />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align='end'>
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(
                                  `/admin/navigation/edit/${item._id}`
                                );
                              }}
                            >
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleActive(item._id!, item.isActive);
                              }}
                            >
                              {item.isActive ? 'Deactivate' : 'Activate'}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(item._id!);
                              }}
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
            )}
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <AdminFooter />

      {/* Navigation Detail Modal */}
      {selectedNavigation && (
        <div
          className='z-50 fixed inset-0 flex justify-center items-center bg-black/60 backdrop-blur-sm p-4'
          onClick={() => setSelectedNavigation(null)}
        >
          <Card
            className='w-full max-w-3xl max-h-[90vh] overflow-y-auto'
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader className='flex flex-row justify-between items-start'>
              <div>
                <CardTitle className='text-2xl'>
                  Navigation Item Details
                </CardTitle>
                <CardDescription>
                  View complete information for this navigation item
                </CardDescription>
              </div>
              <Button
                variant='ghost'
                onClick={() => setSelectedNavigation(null)}
                className='text-gray-500 hover:text-gray-700'
              >
                ✕
              </Button>
            </CardHeader>
            <CardContent className='space-y-6'>
              {/* Basic Information */}
              <div>
                <h3 className='mb-4 font-semibold text-lg'>
                  Basic Information
                </h3>
                <div className='gap-4 grid grid-cols-2'>
                  <div>
                    <p className='text-gray-500 text-sm'>Label</p>
                    <p className='font-medium'>{selectedNavigation.label}</p>
                  </div>
                  <div>
                    <p className='text-gray-500 text-sm'>Display Order</p>
                    <p className='font-mono font-medium'>
                      {selectedNavigation.order}
                    </p>
                  </div>
                </div>
              </div>

              {/* Link Details */}
              <div>
                <h3 className='mb-4 font-semibold text-lg'>Link Details</h3>
                <div className='space-y-3'>
                  <div>
                    <p className='text-gray-500 text-sm'>Destination</p>
                    <code className='inline-block bg-gray-100 mt-1 px-3 py-2 rounded text-sm'>
                      {selectedNavigation.href}
                    </code>
                  </div>
                  <div className='flex gap-2'>
                    <Badge
                      variant={
                        selectedNavigation.isExternal ? 'default' : 'outline'
                      }
                    >
                      {selectedNavigation.isExternal
                        ? 'External Link'
                        : 'Internal Link'}
                    </Badge>
                    {selectedNavigation.openInNewTab && (
                      <Badge variant='outline'>Opens in New Tab</Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Status */}
              <div>
                <h3 className='mb-4 font-semibold text-lg'>Status</h3>
                <div className='flex items-center gap-2'>
                  <Badge
                    variant={selectedNavigation.isActive ? 'success' : 'muted'}
                    className='px-3 py-1 text-base'
                  >
                    {selectedNavigation.isActive ? '✓ Active' : '○ Inactive'}
                  </Badge>
                  <span className='text-gray-600 text-sm'>
                    {selectedNavigation.isActive
                      ? 'Visible in website navigation'
                      : 'Hidden from website navigation'}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className='flex gap-3 pt-4 border-t'>
                <Button
                  onClick={() => {
                    setSelectedNavigation(null);
                    router.push(
                      `/admin/navigation/edit/${selectedNavigation._id}`
                    );
                  }}
                >
                  Edit Navigation Item
                </Button>
                <Button
                  variant='outline'
                  onClick={() => {
                    handleToggleActive(
                      selectedNavigation._id!,
                      selectedNavigation.isActive
                    );
                    setSelectedNavigation(null);
                  }}
                >
                  {selectedNavigation.isActive ? 'Deactivate' : 'Activate'}
                </Button>
                <Button
                  variant='outline'
                  onClick={() => setSelectedNavigation(null)}
                >
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
