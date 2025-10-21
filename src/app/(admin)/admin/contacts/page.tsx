'use client';

import { useState, useEffect, useCallback } from 'react';
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

export default function ContactManagementPage() {
  const [contacts, setContacts] = useState<IContact[]>([]);
  const [stats, setStats] = useState<IContactStats | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ContactStatus | 'all'>(
    'all'
  );
  const [priorityFilter, setPriorityFilter] = useState<ContactPriority | 'all'>(
    'all'
  );
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedContact, setSelectedContact] = useState<IContact | null>(null);
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [pageSize, setPageSize] = useState(10);
  const [totalContacts, setTotalContacts] = useState(0);

  // Fetch contacts
  const fetchContacts = useCallback(async () => {
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
      if (priorityFilter !== 'all') params.append('priority', priorityFilter);

      const response = await fetch(`/api/admin/contacts?${params}`);
      if (!response.ok) throw new Error('Failed to fetch contacts');

      const data = await response.json();
      setContacts(data.contacts);
      setTotalPages(data.totalPages);
      setTotalContacts(data.total || 0);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toast.error('Failed to load contacts');
    } finally {
      setLoading(false);
    }
  }, [
    page,
    searchTerm,
    statusFilter,
    priorityFilter,
    sortBy,
    sortOrder,
    pageSize,
  ]);

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

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchContacts();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, fetchContacts]);

  // Toggle selection
  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  // Toggle all
  const toggleAll = () => {
    if (selectedIds.size === contacts.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(contacts.map((c) => c._id!)));
    }
  };

  // Update single contact
  const updateContact = async (id: string, updates: Partial<IContact>) => {
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
  };

  // Bulk update
  const bulkUpdate = async (updates: Partial<IContact>) => {
    if (selectedIds.size === 0) {
      toast.warning('No contacts selected');
      return;
    }

    try {
      const response = await fetch('/api/admin/contacts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ids: Array.from(selectedIds),
          updates,
        }),
      });

      if (!response.ok) throw new Error('Failed to update contacts');

      const data = await response.json();
      toast.success(`Updated ${data.modifiedCount} contact(s)`);
      setSelectedIds(new Set());
      fetchContacts();
      fetchStats();
    } catch (error) {
      console.error('Error updating contacts:', error);
      toast.error('Failed to update contacts');
    }
  };

  // Bulk delete
  const bulkDelete = async () => {
    if (selectedIds.size === 0) {
      toast.warning('No contacts selected');
      return;
    }

    if (
      !confirm(
        `Are you sure you want to delete ${selectedIds.size} contact(s)?`
      )
    ) {
      return;
    }

    try {
      const response = await fetch('/api/admin/contacts', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: Array.from(selectedIds) }),
      });

      if (!response.ok) throw new Error('Failed to delete contacts');

      const data = await response.json();
      toast.success(`Deleted ${data.deletedCount} contact(s)`);
      setSelectedIds(new Set());
      fetchContacts();
      fetchStats();
    } catch (error) {
      console.error('Error deleting contacts:', error);
      toast.error('Failed to delete contacts');
    }
  };

  // Delete single contact
  const deleteContact = async (id: string) => {
    if (!confirm('Are you sure you want to delete this contact?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/contacts/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete contact');

      toast.success('Contact deleted');
      fetchContacts();
      fetchStats();
    } catch (error) {
      console.error('Error deleting contact:', error);
      toast.error('Failed to delete contact');
    }
  };

  // Get status badge variant
  const getStatusVariant = (status: ContactStatus) => {
    switch (status) {
      case ContactStatus.NEW:
        return 'info'; // Blue for new
      case ContactStatus.READ:
        return 'warning'; // Amber for read
      case ContactStatus.REPLIED:
        return 'success'; // Green for replied
      case ContactStatus.ARCHIVED:
        return 'muted'; // Gray for archived
      case ContactStatus.SPAM:
        return 'destructive'; // Red for spam
      default:
        return 'default';
    }
  };

  // Get priority color
  const getPriorityColor = (priority: ContactPriority) => {
    switch (priority) {
      case ContactPriority.LOW:
        return 'text-green-600';
      case ContactPriority.MEDIUM:
        return 'text-blue-600';
      case ContactPriority.HIGH:
        return 'text-orange-600';
      case ContactPriority.URGENT:
        return 'text-red-600';
      default:
        return 'text-gray-600';
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

  // Handle sort
  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
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
    setPage(1); // Reset to first page when changing page size
  };

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

        {/* Filters and Actions */}
        <Card className='mb-6'>
          <CardContent className='pt-6'>
            <div className='flex md:flex-row flex-col md:justify-between md:items-center gap-4'>
              <div className='flex md:flex-row flex-col md:items-center gap-4'>
                <Input
                  placeholder='Search contacts...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='md:w-64'
                />
                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value as ContactStatus | 'all')
                  }
                  className='px-3 py-2 border border-gray-300 rounded-md'
                  aria-label='Filter by status'
                >
                  <option value='all'>All Status</option>
                  <option value={ContactStatus.NEW}>New</option>
                  <option value={ContactStatus.READ}>Read</option>
                  <option value={ContactStatus.REPLIED}>Replied</option>
                  <option value={ContactStatus.ARCHIVED}>Archived</option>
                  <option value={ContactStatus.SPAM}>Spam</option>
                </select>
                <select
                  value={priorityFilter}
                  onChange={(e) =>
                    setPriorityFilter(e.target.value as ContactPriority | 'all')
                  }
                  className='px-3 py-2 border border-gray-300 rounded-md'
                  aria-label='Filter by priority'
                >
                  <option value='all'>All Priority</option>
                  <option value={ContactPriority.LOW}>Low</option>
                  <option value={ContactPriority.MEDIUM}>Medium</option>
                  <option value={ContactPriority.HIGH}>High</option>
                  <option value={ContactPriority.URGENT}>Urgent</option>
                </select>
              </div>

              {selectedIds.size > 0 && (
                <div className='flex gap-2'>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant='outline'>
                        Bulk Actions ({selectedIds.size})
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() =>
                          bulkUpdate({ status: ContactStatus.READ })
                        }
                      >
                        Mark as Read
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          bulkUpdate({ status: ContactStatus.REPLIED })
                        }
                      >
                        Mark as Replied
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          bulkUpdate({ status: ContactStatus.ARCHIVED })
                        }
                      >
                        Archive
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() =>
                          bulkUpdate({ status: ContactStatus.SPAM })
                        }
                        className='text-orange-600'
                      >
                        Mark as Spam
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={bulkDelete}
                        className='text-red-600'
                      >
                        Delete Selected
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Contacts Table */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Messages</CardTitle>
            <CardDescription>
              Manage and respond to customer inquiries
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className='py-12 text-center'>
                <div className='mx-auto border-gray-900 border-b-2 rounded-full w-12 h-12 animate-spin'></div>
                <p className='mt-4 text-gray-600'>Loading contacts...</p>
              </div>
            ) : contacts.length === 0 ? (
              <div className='py-12 text-gray-600 text-center'>
                No contacts found
              </div>
            ) : (
              <>
                <div className='overflow-x-auto'>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className='w-12'>
                          <Checkbox
                            checked={
                              selectedIds.size === contacts.length &&
                              contacts.length > 0
                            }
                            onCheckedChange={toggleAll}
                          />
                        </TableHead>
                        <TableHead
                          className='hover:bg-gray-50 cursor-pointer'
                          onClick={() => handleSort('firstName')}
                        >
                          Name {getSortIcon('firstName')}
                        </TableHead>
                        <TableHead
                          className='hover:bg-gray-50 cursor-pointer'
                          onClick={() => handleSort('email')}
                        >
                          Email {getSortIcon('email')}
                        </TableHead>
                        <TableHead>Message</TableHead>
                        <TableHead
                          className='hover:bg-gray-50 cursor-pointer'
                          onClick={() => handleSort('status')}
                        >
                          Status {getSortIcon('status')}
                        </TableHead>
                        <TableHead
                          className='hover:bg-gray-50 cursor-pointer'
                          onClick={() => handleSort('priority')}
                        >
                          Priority {getSortIcon('priority')}
                        </TableHead>
                        <TableHead
                          className='hover:bg-gray-50 cursor-pointer'
                          onClick={() => handleSort('createdAt')}
                        >
                          Date {getSortIcon('createdAt')}
                        </TableHead>
                        <TableHead className='text-right'>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {contacts.map((contact) => (
                        <TableRow
                          key={contact._id}
                          className={`cursor-pointer hover:bg-gray-100 ${
                            contact.status === ContactStatus.NEW
                              ? 'bg-blue-50 hover:bg-blue-100'
                              : ''
                          }`}
                          onClick={() => setSelectedContact(contact)}
                        >
                          <TableCell onClick={(e) => e.stopPropagation()}>
                            <Checkbox
                              checked={selectedIds.has(contact._id!)}
                              onCheckedChange={() =>
                                toggleSelection(contact._id!)
                              }
                            />
                          </TableCell>
                          <TableCell className='font-medium'>
                            {contact.firstName} {contact.lastName}
                          </TableCell>
                          <TableCell onClick={(e) => e.stopPropagation()}>
                            <a
                              href={`mailto:${contact.email}`}
                              className='text-blue-600 hover:underline'
                            >
                              {contact.email}
                            </a>
                          </TableCell>
                          <TableCell className='max-w-md truncate'>
                            {contact.message}
                          </TableCell>
                          <TableCell>
                            <Badge variant={getStatusVariant(contact.status)}>
                              {contact.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span
                              className={getPriorityColor(contact.priority)}
                            >
                              {contact.priority}
                            </span>
                          </TableCell>
                          <TableCell className='text-gray-600 text-sm'>
                            {formatDate(contact.createdAt)}
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
                                  onClick={() => setSelectedContact(contact)}
                                >
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() =>
                                    updateContact(contact._id!, {
                                      status: ContactStatus.READ,
                                    })
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
                                  onClick={() => deleteContact(contact._id!)}
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
                      {totalContacts > 0 ? (page - 1) * pageSize + 1 : 0} to{' '}
                      {Math.min(page * pageSize, totalContacts)} of{' '}
                      {totalContacts} contacts
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
                          <SelectItem value='100'>100</SelectItem>
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

        {/* Contact Detail Modal */}
        {selectedContact && (
          <div
            className='z-50 fixed inset-0 flex justify-center items-center bg-black/60 backdrop-blur-sm'
            onClick={() => setSelectedContact(null)}
          >
            <Card
              className='shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto'
              onClick={(e) => e.stopPropagation()}
            >
              <CardHeader>
                <div className='flex justify-between items-start'>
                  <div>
                    <CardTitle>
                      {selectedContact.firstName} {selectedContact.lastName}
                    </CardTitle>
                    <CardDescription>{selectedContact.email}</CardDescription>
                  </div>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => setSelectedContact(null)}
                  >
                    ✕
                  </Button>
                </div>
              </CardHeader>
              <CardContent className='space-y-4'>
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
                    <span
                      className={`font-medium ${getPriorityColor(
                        selectedContact.priority
                      )}`}
                    >
                      {selectedContact.priority}
                    </span>
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
                    <Button>Reply via Email</Button>
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
              </CardContent>
            </Card>
          </div>
        )}
      </main>
      <AdminFooter />
    </div>
  );
}
