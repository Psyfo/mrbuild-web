'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import {
  IContact,
  ContactStatus,
  ContactPriority,
  IContactStats,
} from '@/types/contact';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AdminFooter } from '@/components/admin/AdminFooter';
import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ColumnDef } from '@tanstack/react-table';
import {
  DataTable,
  DataTableColumnHeader,
  DataTableRowSelection,
  DataTableHeaderSelection,
} from '@/components/admin/DataTable';
import { DataTableMultiSelect } from '@/components/admin/DataTable/DataTableMultiSelect';
import { exportToCSV } from '@/lib/export-utils';
import { Mail, MoreHorizontal } from 'lucide-react';

export default function EnhancedContactManagementPage() {
  const [contacts, setContacts] = useState<IContact[]>([]);
  const [stats, setStats] = useState<IContactStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [priorityFilter, setPriorityFilter] = useState<string[]>([]);
  const [selectedContact, setSelectedContact] = useState<IContact | null>(null);

  // Fetch contacts
  const fetchContacts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/contacts?pageSize=1000');
      if (!response.ok) throw new Error('Failed to fetch contacts');

      const data = await response.json();
      setContacts(data.contacts || []);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toast.error('Failed to load contacts');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch stats
  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/contacts/stats');
      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchContacts();
    fetchStats();
  }, [fetchContacts]);

  // Update single contact
  const updateContact = useCallback(
    async (id: string, updates: Partial<IContact>) => {
      try {
        const response = await fetch(`/api/admin/contacts/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates),
        });

        if (!response.ok) throw new Error('Failed to update contact');

        toast.success('Contact updated successfully');
        fetchContacts();
        fetchStats();
      } catch (error) {
        console.error('Error updating contact:', error);
        toast.error('Failed to update contact');
      }
    },
    [fetchContacts]
  );

  // Bulk operations
  const bulkUpdateStatus = async (ids: string[], status: ContactStatus) => {
    try {
      const response = await fetch('/api/admin/contacts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids, updates: { status } }),
      });

      if (!response.ok) throw new Error('Failed to update contacts');

      const data = await response.json();
      toast.success(`Updated ${data.modifiedCount} contact(s)`);
      fetchContacts();
      fetchStats();
    } catch (error) {
      console.error('Error updating contacts:', error);
      toast.error('Failed to update contacts');
    }
  };

  const bulkDelete = useCallback(
    async (ids: string[]) => {
      if (
        !confirm(`Are you sure you want to delete ${ids.length} contact(s)?`)
      ) {
        return;
      }

      try {
        const response = await fetch('/api/admin/contacts', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids }),
        });

        if (!response.ok) throw new Error('Failed to delete contacts');

        const data = await response.json();
        toast.success(`Deleted ${data.deletedCount} contact(s)`);
        fetchContacts();
        fetchStats();
      } catch (error) {
        console.error('Error deleting contacts:', error);
        toast.error('Failed to delete contacts');
      }
    },
    [fetchContacts]
  );

  // Get status badge variant
  const getStatusVariant = (
    status: ContactStatus
  ): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (status) {
      case ContactStatus.NEW:
        return 'default';
      case ContactStatus.READ:
        return 'secondary';
      case ContactStatus.REPLIED:
        return 'outline';
      case ContactStatus.ARCHIVED:
        return 'secondary';
      case ContactStatus.SPAM:
        return 'destructive';
      default:
        return 'default';
    }
  };

  // Get priority badge variant
  const getPriorityVariant = (
    priority: ContactPriority
  ): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (priority) {
      case ContactPriority.LOW:
        return 'outline';
      case ContactPriority.MEDIUM:
        return 'secondary';
      case ContactPriority.HIGH:
        return 'default';
      case ContactPriority.URGENT:
        return 'destructive';
      default:
        return 'default';
    }
  };

  // Format date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Define columns
  const columns: ColumnDef<IContact>[] = useMemo(
    () => [
      {
        id: 'select',
        header: ({ table }) => <DataTableHeaderSelection table={table} />,
        cell: ({ row }) => <DataTableRowSelection row={row} />,
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: 'firstName',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title='Name' />
        ),
        cell: ({ row }) => (
          <div className='font-medium'>
            {row.original.firstName} {row.original.lastName}
          </div>
        ),
      },
      {
        accessorKey: 'email',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title='Email' />
        ),
        cell: ({ row }) => (
          <a
            href={`mailto:${row.original.email}`}
            className='text-blue-600 hover:underline'
            onClick={(e) => e.stopPropagation()}
          >
            {row.original.email}
          </a>
        ),
      },
      {
        accessorKey: 'message',
        header: 'Message',
        cell: ({ row }) => (
          <div className='max-w-md truncate'>{row.original.message}</div>
        ),
        enableSorting: false,
      },
      {
        accessorKey: 'status',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title='Status' />
        ),
        cell: ({ row }) => (
          <Badge variant={getStatusVariant(row.original.status)}>
            {row.original.status}
          </Badge>
        ),
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id));
        },
      },
      {
        accessorKey: 'priority',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title='Priority' />
        ),
        cell: ({ row }) => (
          <Badge variant={getPriorityVariant(row.original.priority)}>
            {row.original.priority}
          </Badge>
        ),
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id));
        },
      },
      {
        accessorKey: 'createdAt',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title='Date' />
        ),
        cell: ({ row }) => (
          <div className='text-gray-600 text-sm'>
            {formatDate(row.original.createdAt)}
          </div>
        ),
      },
      {
        id: 'actions',
        cell: ({ row }) => {
          const contact = row.original;

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost' className='p-0 w-8 h-8'>
                  <span className='sr-only'>Open menu</span>
                  <MoreHorizontal className='w-4 h-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setSelectedContact(contact)}>
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href={`mailto:${contact.email}`}>
                    <Mail className='mr-2 w-4 h-4' />
                    Send Email
                  </a>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() =>
                    updateContact(contact._id!, { status: ContactStatus.READ })
                  }
                >
                  Mark as Read
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    updateContact(contact._id!, {
                      status: ContactStatus.REPLIED,
                    })
                  }
                >
                  Mark as Replied
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    updateContact(contact._id!, {
                      status: ContactStatus.ARCHIVED,
                    })
                  }
                >
                  Archive
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => bulkDelete([contact._id!])}
                  className='text-red-600'
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
        enableSorting: false,
        enableHiding: false,
      },
    ],
    [bulkDelete, updateContact]
  );

  // Filter data
  const filteredData = useMemo(() => {
    return contacts.filter((contact) => {
      const statusMatch =
        statusFilter.length === 0 || statusFilter.includes(contact.status);
      const priorityMatch =
        priorityFilter.length === 0 ||
        priorityFilter.includes(contact.priority);
      return statusMatch && priorityMatch;
    });
  }, [contacts, statusFilter, priorityFilter]);

  return (
    <div className='flex flex-col bg-gray-50 min-h-screen'>
      {/* Header */}
      <header className='bg-white border-gray-200 border-b'>
        <div className='mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl'>
          <div className='flex justify-between items-center h-16'>
            <h1 className='font-bold text-gray-900 text-2xl'>
              Contact Management
            </h1>
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
                <CardDescription>New</CardDescription>
                <CardTitle className='text-blue-600 text-3xl'>
                  {stats.new}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className='pb-3'>
                <CardDescription>Read</CardDescription>
                <CardTitle className='text-gray-600 text-3xl'>
                  {stats.read}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className='pb-3'>
                <CardDescription>Replied</CardDescription>
                <CardTitle className='text-green-600 text-3xl'>
                  {stats.replied}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className='pb-3'>
                <CardDescription>This Week</CardDescription>
                <CardTitle className='text-3xl'>{stats.weekCount}</CardTitle>
              </CardHeader>
            </Card>
          </div>
        )}

        {/* DataTable */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Messages</CardTitle>
            <CardDescription>
              Manage and respond to customer inquiries
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              data={filteredData}
              searchKey='email'
              searchPlaceholder='Search by email...'
              loading={loading}
              showRowSelection
              filterComponent={
                <>
                  <DataTableMultiSelect
                    title='Status'
                    options={[
                      { label: 'New', value: ContactStatus.NEW },
                      { label: 'Read', value: ContactStatus.READ },
                      { label: 'Replied', value: ContactStatus.REPLIED },
                      { label: 'Archived', value: ContactStatus.ARCHIVED },
                      { label: 'Spam', value: ContactStatus.SPAM },
                    ]}
                    selected={statusFilter}
                    onChange={setStatusFilter}
                  />
                  <DataTableMultiSelect
                    title='Priority'
                    options={[
                      { label: 'Low', value: ContactPriority.LOW },
                      { label: 'Medium', value: ContactPriority.MEDIUM },
                      { label: 'High', value: ContactPriority.HIGH },
                      { label: 'Urgent', value: ContactPriority.URGENT },
                    ]}
                    selected={priorityFilter}
                    onChange={setPriorityFilter}
                  />
                </>
              }
              bulkActions={[
                {
                  label: 'Mark as Read',
                  action: (rows) =>
                    bulkUpdateStatus(
                      rows.map((r) => r.original._id!),
                      ContactStatus.READ
                    ),
                },
                {
                  label: 'Mark as Replied',
                  action: (rows) =>
                    bulkUpdateStatus(
                      rows.map((r) => r.original._id!),
                      ContactStatus.REPLIED
                    ),
                },
                {
                  label: 'Archive',
                  action: (rows) =>
                    bulkUpdateStatus(
                      rows.map((r) => r.original._id!),
                      ContactStatus.ARCHIVED
                    ),
                },
                {
                  label: 'Delete Selected',
                  action: (rows) =>
                    bulkDelete(rows.map((r) => r.original._id!)),
                  variant: 'destructive',
                },
              ]}
              onExport={(rows) =>
                exportToCSV(rows, `contacts-${new Date().toISOString()}`)
              }
            />
          </CardContent>
        </Card>

        {/* Contact Detail Dialog */}
        <Dialog
          open={!!selectedContact}
          onOpenChange={() => setSelectedContact(null)}
        >
          <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
            {selectedContact && (
              <>
                <DialogHeader>
                  <DialogTitle>
                    {selectedContact.firstName} {selectedContact.lastName}
                  </DialogTitle>
                  <DialogDescription>{selectedContact.email}</DialogDescription>
                </DialogHeader>
                <div className='space-y-4'>
                  <div>
                    <h3 className='mb-2 font-semibold'>Message</h3>
                    <p className='text-gray-700 whitespace-pre-wrap'>
                      {selectedContact.message}
                    </p>
                  </div>
                  <div className='flex gap-4'>
                    <div>
                      <h3 className='mb-1 font-semibold text-sm'>Status</h3>
                      <Badge variant={getStatusVariant(selectedContact.status)}>
                        {selectedContact.status}
                      </Badge>
                    </div>
                    <div>
                      <h3 className='mb-1 font-semibold text-sm'>Priority</h3>
                      <Badge
                        variant={getPriorityVariant(selectedContact.priority)}
                      >
                        {selectedContact.priority}
                      </Badge>
                    </div>
                  </div>
                  {selectedContact.tags && selectedContact.tags.length > 0 && (
                    <div>
                      <h3 className='mb-2 font-semibold text-sm'>Tags</h3>
                      <div className='flex flex-wrap gap-2'>
                        {selectedContact.tags.map((tag) => (
                          <Badge key={tag} variant='outline'>
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className='pt-4 border-gray-200 border-t'>
                    <p className='text-gray-600 text-sm'>
                      <strong>Received:</strong>{' '}
                      {formatDate(selectedContact.createdAt)}
                    </p>
                    {selectedContact.ipAddress && (
                      <p className='text-gray-600 text-sm'>
                        <strong>IP Address:</strong> {selectedContact.ipAddress}
                      </p>
                    )}
                  </div>
                  <div className='flex gap-2 pt-4'>
                    <a href={`mailto:${selectedContact.email}`}>
                      <Button>
                        <Mail className='mr-2 w-4 h-4' />
                        Reply via Email
                      </Button>
                    </a>
                    <Button
                      variant='outline'
                      onClick={() => {
                        updateContact(selectedContact._id!, {
                          status: ContactStatus.REPLIED,
                        });
                        setSelectedContact(null);
                      }}
                    >
                      Mark as Replied
                    </Button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </main>
      <AdminFooter />
    </div>
  );
}
