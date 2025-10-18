'use client';

import { useSession, signOut } from 'next-auth/react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

export default function AdminDashboard() {
  const { data: session, status } = useSession();

  const handleSignOut = async () => {
    toast.warning('Logging out...', {
      description: 'You are being signed out of the admin portal.',
    });
    await signOut({ callbackUrl: '/login' });
  };

  if (status === 'loading') {
    return (
      <div className='flex justify-center items-center bg-gray-50 min-h-screen'>
        <div className='text-center'>
          <div className='mx-auto border-gray-900 border-b-2 rounded-full w-12 h-12 animate-spin'></div>
          <p className='mt-4 text-gray-600'>Loading...</p>
        </div>
      </div>
    );
  }

  const getInitials = (name?: string | null) => {
    if (!name) return 'AD';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className='bg-gray-50 min-h-screen'>
      {/* Header */}
      <header className='bg-white border-gray-200 border-b'>
        <div className='mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl'>
          <div className='flex justify-between items-center h-16'>
            <div className='flex items-center'>
              <h1 className='font-bold text-gray-900 text-2xl'>
                Mr Build Admin
              </h1>
            </div>
            <div className='flex items-center gap-4'>
              <Badge variant='outline' className='hidden sm:flex'>
                {session?.user?.email}
              </Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant='ghost'
                    className='relative rounded-full w-10 h-10'
                  >
                    <Avatar>
                      <AvatarFallback className='bg-gray-200 text-gray-900'>
                        {getInitials(session?.user?.name)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end' className='w-56'>
                  <DropdownMenuLabel>
                    <div className='flex flex-col space-y-1'>
                      <p className='font-medium text-sm'>
                        {session?.user?.name}
                      </p>
                      <p className='text-muted-foreground text-xs'>
                        {session?.user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className='text-red-600 cursor-pointer'
                  >
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className='mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl'>
        <div className='mb-8'>
          <h2 className='mb-2 font-bold text-gray-900 text-3xl'>
            Welcome back, {session?.user?.name?.split(' ')[0]}!
          </h2>
          <p className='text-gray-600'>
            Manage your Mr Build website content and settings from this
            dashboard.
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className='gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
          {/* Content Management Card */}
          <Card className='hover:shadow-lg transition-shadow cursor-pointer'>
            <CardHeader>
              <div className='flex justify-center items-center bg-blue-100 mb-4 rounded-lg w-12 h-12'>
                <svg
                  className='w-6 h-6 text-blue-600'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
                  />
                </svg>
              </div>
              <CardTitle>Content Management</CardTitle>
              <CardDescription>
                Edit homepage content, services, and promotions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant='outline' className='w-full'>
                Manage Content
              </Button>
            </CardContent>
          </Card>

          {/* Brand Management Card */}
          <Card className='hover:shadow-lg transition-shadow cursor-pointer'>
            <CardHeader>
              <div className='flex justify-center items-center bg-purple-100 mb-4 rounded-lg w-12 h-12'>
                <svg
                  className='w-6 h-6 text-purple-600'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z'
                  />
                </svg>
              </div>
              <CardTitle>Brand Management</CardTitle>
              <CardDescription>
                Add, edit, or remove brand logos and information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant='outline' className='w-full'>
                Manage Brands
              </Button>
            </CardContent>
          </Card>

          {/* Contact Messages Card */}
          <Card className='hover:shadow-lg transition-shadow cursor-pointer'>
            <CardHeader>
              <div className='flex justify-center items-center bg-green-100 mb-4 rounded-lg w-12 h-12'>
                <svg
                  className='w-6 h-6 text-green-600'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                  />
                </svg>
              </div>
              <CardTitle>Contact Messages</CardTitle>
              <CardDescription>
                View and manage customer inquiries
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant='outline' className='w-full'>
                View Messages
              </Button>
            </CardContent>
          </Card>

          {/* Branch Locations Card */}
          <Card className='hover:shadow-lg transition-shadow cursor-pointer'>
            <CardHeader>
              <div className='flex justify-center items-center bg-orange-100 mb-4 rounded-lg w-12 h-12'>
                <svg
                  className='w-6 h-6 text-orange-600'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
                  />
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
                  />
                </svg>
              </div>
              <CardTitle>Branch Locations</CardTitle>
              <CardDescription>
                Update branch information and locations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant='outline' className='w-full'>
                Manage Branches
              </Button>
            </CardContent>
          </Card>

          {/* SEO Settings Card */}
          <Card className='hover:shadow-lg transition-shadow cursor-pointer'>
            <CardHeader>
              <div className='flex justify-center items-center bg-red-100 mb-4 rounded-lg w-12 h-12'>
                <svg
                  className='w-6 h-6 text-red-600'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                  />
                </svg>
              </div>
              <CardTitle>SEO Settings</CardTitle>
              <CardDescription>
                Optimize search engine visibility
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant='outline' className='w-full'>
                SEO Settings
              </Button>
            </CardContent>
          </Card>

          {/* Site Settings Card */}
          <Card className='hover:shadow-lg transition-shadow cursor-pointer'>
            <CardHeader>
              <div className='flex justify-center items-center bg-gray-100 mb-4 rounded-lg w-12 h-12'>
                <svg
                  className='w-6 h-6 text-gray-600'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'
                  />
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                  />
                </svg>
              </div>
              <CardTitle>Site Settings</CardTitle>
              <CardDescription>
                Configure general website settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant='outline' className='w-full'>
                Settings
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className='gap-6 grid grid-cols-1 md:grid-cols-3 mt-8'>
          <Card>
            <CardHeader className='pb-3'>
              <CardDescription>Total Brands</CardDescription>
              <CardTitle className='text-4xl'>24</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className='pb-3'>
              <CardDescription>Active Promotions</CardDescription>
              <CardTitle className='text-4xl'>6</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className='pb-3'>
              <CardDescription>Branch Locations</CardDescription>
              <CardTitle className='text-4xl'>3</CardTitle>
            </CardHeader>
          </Card>
        </div>
      </main>
    </div>
  );
}
