'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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

export default function NavigationManagementPage() {
  const router = useRouter();
  const [navigation, setNavigation] = useState<INavigation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNavigation();
  }, []);

  const fetchNavigation = async () => {
    try {
      const response = await fetch('/api/admin/navigation');
      if (response.ok) {
        const data = await response.json();
        setNavigation(data);
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

  if (loading) {
    return (
      <div className='p-8'>
        <h1 className='mb-6 font-bold text-3xl'>Navigation Management</h1>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className='p-8'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='font-bold text-3xl'>Navigation Management</h1>
        <Button onClick={() => router.push('/admin/navigation/new')}>
          Add Navigation Item
        </Button>
      </div>

      {navigation.length === 0 ? (
        <div className='py-12 text-center'>
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
              <TableRow key={item._id}>
                <TableCell>
                  <div className='flex items-center gap-2'>
                    <span className='font-mono'>{item.order}</span>
                    <div className='flex flex-col gap-1'>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => handleReorder(item._id!, 'up')}
                        disabled={index === 0}
                        className='p-0 w-5 h-5'
                      >
                        <ArrowUp className='w-3 h-3' />
                      </Button>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => handleReorder(item._id!, 'down')}
                        disabled={index === navigation.length - 1}
                        className='p-0 w-5 h-5'
                      >
                        <ArrowDown className='w-3 h-3' />
                      </Button>
                    </div>
                  </div>
                </TableCell>
                <TableCell className='font-medium'>{item.label}</TableCell>
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
                      <Button variant='ghost' className='p-0 w-8 h-8'>
                        <span className='sr-only'>Open menu</span>
                        <MoreHorizontal className='w-4 h-4' />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() =>
                          router.push(`/admin/navigation/edit/${item._id}`)
                        }
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          handleToggleActive(item._id!, item.isActive)
                        }
                      >
                        {item.isActive ? 'Deactivate' : 'Activate'}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDelete(item._id!)}
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
    </div>
  );
}
