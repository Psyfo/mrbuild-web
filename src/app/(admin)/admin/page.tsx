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
import { AdminFooter } from '@/components/admin/AdminFooter';
import {
  CheckCircle2,
  Clock,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Mail,
  MapPin,
  Menu,
  Tag,
  Package,
  Eye,
} from 'lucide-react';
import { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const [stats, setStats] = useState({
    branches: 0,
    contacts: 0,
    specials: 0,
    navigation: 0,
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    // Fetch real stats
    const fetchStats = async () => {
      try {
        const [branchesRes, contactsRes, specialsRes, navigationRes] =
          await Promise.all([
            fetch('/api/branches').then((r) => r.json()),
            fetch('/api/contacts').then((r) => r.json()),
            fetch('/api/specials').then((r) => r.json()),
            fetch('/api/navigation').then((r) => r.json()),
          ]);

        setStats({
          branches: branchesRes.length || 0,
          contacts: contactsRes.length || 0,
          specials: specialsRes.length || 0,
          navigation: navigationRes.length || 0,
        });

        // Build recent activity
        const activities = [];

        if (contactsRes.length > 0) {
          const recentContacts = contactsRes.slice(0, 2);
          recentContacts.forEach((contact: any) => {
            activities.push({
              type: 'contact',
              title: 'New contact message',
              description: `From ${contact.name}`,
              time: new Date(contact.createdAt).toLocaleDateString(),
              icon: Mail,
            });
          });
        }

        if (specialsRes.length > 0) {
          const recentSpecials = specialsRes.slice(0, 2);
          recentSpecials.forEach((special: any) => {
            activities.push({
              type: 'special',
              title: 'Special updated',
              description: special.title,
              time: new Date(
                special.updatedAt || special.createdAt
              ).toLocaleDateString(),
              icon: Tag,
            });
          });
        }

        setRecentActivity(activities.slice(0, 5));
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };

    fetchStats();
  }, []);

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
    <div className='flex flex-col bg-gray-50 min-h-screen'>
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
      <main className='flex-1 mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl'>
        <div className='mb-8'>
          <h2 className='mb-2 font-bold text-gray-900 text-3xl'>
            Welcome back, {session?.user?.name?.split(' ')[0]}!
          </h2>
          <p className='text-gray-600'>
            Manage your Mr Build website content and settings from this
            dashboard.
          </p>
        </div>

        {/* Quick Stats Overview */}
        <div className='gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-8'>
          <Card>
            <CardHeader className='flex flex-row justify-between items-center space-y-0 pb-2'>
              <CardTitle className='font-medium text-sm'>
                Contact Messages
              </CardTitle>
              <Mail className='w-4 h-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='font-bold text-2xl'>{stats.contacts}</div>
              <p className='text-muted-foreground text-xs'>
                <span className='inline-flex items-center text-green-600'>
                  <TrendingUp className='mr-1 w-3 h-3' />
                  Active
                </span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row justify-between items-center space-y-0 pb-2'>
              <CardTitle className='font-medium text-sm'>
                Branch Locations
              </CardTitle>
              <MapPin className='w-4 h-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='font-bold text-2xl'>{stats.branches}</div>
              <p className='text-muted-foreground text-xs'>
                Across South Africa
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row justify-between items-center space-y-0 pb-2'>
              <CardTitle className='font-medium text-sm'>
                Active Specials
              </CardTitle>
              <Tag className='w-4 h-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='font-bold text-2xl'>{stats.specials}</div>
              <p className='text-muted-foreground text-xs'>
                Current promotions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row justify-between items-center space-y-0 pb-2'>
              <CardTitle className='font-medium text-sm'>
                Navigation Items
              </CardTitle>
              <Menu className='w-4 h-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='font-bold text-2xl'>{stats.navigation}</div>
              <p className='text-muted-foreground text-xs'>Menu structure</p>
            </CardContent>
          </Card>
        </div>

        <div className='gap-6 grid grid-cols-1 lg:grid-cols-3 mb-8'>
          {/* Main Management Grid */}
          <div className='lg:col-span-2'>
            <h3 className='mb-4 font-semibold text-lg'>Quick Actions</h3>
            <div className='gap-4 grid grid-cols-1 md:grid-cols-2'>
              {/* Content Management Card - NOT IMPLEMENTED */}
              <Card className='relative opacity-60 transition-all cursor-not-allowed'>
                <div className='top-2 right-2 absolute'>
                  <Badge
                    variant='secondary'
                    className='bg-gray-200 text-gray-600 text-xs'
                  >
                    Coming Soon
                  </Badge>
                </div>
                <CardHeader>
                  <div className='flex justify-center items-center bg-gray-100 mb-4 rounded-lg w-12 h-12'>
                    <svg
                      className='w-6 h-6 text-gray-400'
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
                  <CardTitle className='text-gray-500'>
                    Content Management
                  </CardTitle>
                  <CardDescription className='text-gray-400'>
                    Edit homepage content, services, and promotions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant='outline' className='w-full' disabled>
                    Manage Content
                  </Button>
                </CardContent>
              </Card>

              {/* Brand Management Card - NOT IMPLEMENTED */}
              <Card className='relative opacity-60 transition-all cursor-not-allowed'>
                <div className='top-2 right-2 absolute'>
                  <Badge
                    variant='secondary'
                    className='bg-gray-200 text-gray-600 text-xs'
                  >
                    Coming Soon
                  </Badge>
                </div>
                <CardHeader>
                  <div className='flex justify-center items-center bg-gray-100 mb-4 rounded-lg w-12 h-12'>
                    <svg
                      className='w-6 h-6 text-gray-400'
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
                  <CardTitle className='text-gray-500'>
                    Brand Management
                  </CardTitle>
                  <CardDescription className='text-gray-400'>
                    Add, edit, or remove brand logos and information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant='outline' className='w-full' disabled>
                    Manage Brands
                  </Button>
                </CardContent>
              </Card>

              {/* Contact Messages Card - IMPLEMENTED */}
              <Card
                className='relative bg-gradient-to-br from-white to-green-50 hover:shadow-lg border-green-200 hover:border-green-300 transition-all cursor-pointer'
                onClick={() => (window.location.href = '/admin/contacts')}
              >
                <div className='top-2 right-2 absolute'>
                  <Badge className='bg-green-600 text-white text-xs'>
                    <CheckCircle2 className='mr-1 w-3 h-3' />
                    Active
                  </Badge>
                </div>
                <CardHeader>
                  <div className='flex justify-center items-center bg-green-100 shadow-sm mb-4 rounded-lg w-12 h-12'>
                    <Mail className='w-6 h-6 text-green-600' />
                  </div>
                  <CardTitle className='text-green-900'>
                    Contact Messages
                  </CardTitle>
                  <CardDescription className='text-green-700'>
                    View and manage customer inquiries
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    className='bg-green-600 hover:bg-green-700 w-full'
                    onClick={(e) => {
                      e.stopPropagation();
                      window.location.href = '/admin/contacts';
                    }}
                  >
                    View Messages
                    <ArrowUpRight className='ml-2 w-4 h-4' />
                  </Button>
                </CardContent>
              </Card>

              {/* Branch Locations Card - IMPLEMENTED */}
              <Card
                className='relative bg-gradient-to-br from-white to-orange-50 hover:shadow-lg border-orange-200 hover:border-orange-300 transition-all cursor-pointer'
                onClick={() => (window.location.href = '/admin/branches')}
              >
                <div className='top-2 right-2 absolute'>
                  <Badge className='bg-orange-600 text-white text-xs'>
                    <CheckCircle2 className='mr-1 w-3 h-3' />
                    Active
                  </Badge>
                </div>
                <CardHeader>
                  <div className='flex justify-center items-center bg-orange-100 shadow-sm mb-4 rounded-lg w-12 h-12'>
                    <MapPin className='w-6 h-6 text-orange-600' />
                  </div>
                  <CardTitle className='text-orange-900'>
                    Branch Locations
                  </CardTitle>
                  <CardDescription className='text-orange-700'>
                    Update branch information and locations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    className='bg-orange-600 hover:bg-orange-700 w-full'
                    onClick={(e) => {
                      e.stopPropagation();
                      window.location.href = '/admin/branches';
                    }}
                  >
                    Manage Branches
                    <ArrowUpRight className='ml-2 w-4 h-4' />
                  </Button>
                </CardContent>
              </Card>

              {/* Specials Management Card - IMPLEMENTED */}
              <Card
                className='relative bg-gradient-to-br from-white to-yellow-50 hover:shadow-lg border-yellow-200 hover:border-yellow-300 transition-all cursor-pointer'
                onClick={() => (window.location.href = '/admin/specials')}
              >
                <div className='top-2 right-2 absolute'>
                  <Badge className='bg-yellow-600 text-white text-xs'>
                    <CheckCircle2 className='mr-1 w-3 h-3' />
                    Active
                  </Badge>
                </div>
                <CardHeader>
                  <div className='flex justify-center items-center bg-yellow-100 shadow-sm mb-4 rounded-lg w-12 h-12'>
                    <Tag className='w-6 h-6 text-yellow-600' />
                  </div>
                  <CardTitle className='text-yellow-900'>
                    Specials Management
                  </CardTitle>
                  <CardDescription className='text-yellow-700'>
                    Upload and manage promotional brochures
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    className='bg-yellow-600 hover:bg-yellow-700 w-full'
                    onClick={(e) => {
                      e.stopPropagation();
                      window.location.href = '/admin/specials';
                    }}
                  >
                    Manage Specials
                    <ArrowUpRight className='ml-2 w-4 h-4' />
                  </Button>
                </CardContent>
              </Card>

              {/* Navigation Management Card - IMPLEMENTED */}
              <Card
                className='relative bg-gradient-to-br from-white to-purple-50 hover:shadow-lg border-purple-200 hover:border-purple-300 transition-all cursor-pointer'
                onClick={() => (window.location.href = '/admin/navigation')}
              >
                <div className='top-2 right-2 absolute'>
                  <Badge className='bg-purple-600 text-white text-xs'>
                    <CheckCircle2 className='mr-1 w-3 h-3' />
                    Active
                  </Badge>
                </div>
                <CardHeader>
                  <div className='flex justify-center items-center bg-purple-100 shadow-sm mb-4 rounded-lg w-12 h-12'>
                    <Menu className='w-6 h-6 text-purple-600' />
                  </div>
                  <CardTitle className='text-purple-900'>
                    Navigation Management
                  </CardTitle>
                  <CardDescription className='text-purple-700'>
                    Manage website navigation menu items
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    className='bg-purple-600 hover:bg-purple-700 w-full'
                    onClick={(e) => {
                      e.stopPropagation();
                      window.location.href = '/admin/navigation';
                    }}
                  >
                    Manage Navigation
                    <ArrowUpRight className='ml-2 w-4 h-4' />
                  </Button>
                </CardContent>
              </Card>

              {/* SEO Settings Card - NOT IMPLEMENTED */}
              <Card className='relative opacity-60 transition-all cursor-not-allowed'>
                <div className='top-2 right-2 absolute'>
                  <Badge
                    variant='secondary'
                    className='bg-gray-200 text-gray-600 text-xs'
                  >
                    Coming Soon
                  </Badge>
                </div>
                <CardHeader>
                  <div className='flex justify-center items-center bg-gray-100 mb-4 rounded-lg w-12 h-12'>
                    <svg
                      className='w-6 h-6 text-gray-400'
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
                  <CardTitle className='text-gray-500'>SEO Settings</CardTitle>
                  <CardDescription className='text-gray-400'>
                    Optimize search engine visibility
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant='outline' className='w-full' disabled>
                    SEO Settings
                  </Button>
                </CardContent>
              </Card>

              {/* Site Settings Card - NOT IMPLEMENTED */}
              <Card className='relative opacity-60 transition-all cursor-not-allowed'>
                <div className='top-2 right-2 absolute'>
                  <Badge
                    variant='secondary'
                    className='bg-gray-200 text-gray-600 text-xs'
                  >
                    Coming Soon
                  </Badge>
                </div>
                <CardHeader>
                  <div className='flex justify-center items-center bg-gray-100 mb-4 rounded-lg w-12 h-12'>
                    <svg
                      className='w-6 h-6 text-gray-400'
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
                  <CardTitle className='text-gray-500'>Site Settings</CardTitle>
                  <CardDescription className='text-gray-400'>
                    Configure general website settings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant='outline' className='w-full' disabled>
                    Settings
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Recent Activity Sidebar */}
          <div className='lg:col-span-1'>
            <h3 className='mb-4 font-semibold text-lg'>Recent Activity</h3>
            <Card>
              <CardHeader>
                <CardTitle className='text-base'>Latest Updates</CardTitle>
                <CardDescription>Recent changes to your site</CardDescription>
              </CardHeader>
              <CardContent>
                {recentActivity.length > 0 ? (
                  <div className='space-y-4'>
                    {recentActivity.map((activity, index) => {
                      const Icon = activity.icon;
                      return (
                        <div
                          key={index}
                          className='flex items-start gap-3 pb-3 last:pb-0 last:border-0 border-b'
                        >
                          <div className='flex flex-shrink-0 justify-center items-center bg-gray-100 rounded-full w-8 h-8'>
                            <Icon className='w-4 h-4 text-gray-600' />
                          </div>
                          <div className='flex-1 min-w-0'>
                            <p className='font-medium text-sm'>
                              {activity.title}
                            </p>
                            <p className='text-gray-500 text-xs truncate'>
                              {activity.description}
                            </p>
                            <p className='mt-1 text-gray-400 text-xs'>
                              <Clock className='inline mr-1 w-3 h-3' />
                              {activity.time}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className='py-8 text-gray-500 text-sm text-center'>
                    No recent activity
                  </div>
                )}
              </CardContent>
            </Card>

            {/* System Status */}
            <Card className='mt-4'>
              <CardHeader>
                <CardTitle className='text-base'>System Status</CardTitle>
              </CardHeader>
              <CardContent className='space-y-3'>
                <div className='flex justify-between items-center'>
                  <span className='text-sm'>Database</span>
                  <Badge className='bg-green-600 text-white'>
                    <CheckCircle2 className='mr-1 w-3 h-3' />
                    Online
                  </Badge>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-sm'>CDN</span>
                  <Badge className='bg-green-600 text-white'>
                    <CheckCircle2 className='mr-1 w-3 h-3' />
                    Active
                  </Badge>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-sm'>API</span>
                  <Badge className='bg-green-600 text-white'>
                    <CheckCircle2 className='mr-1 w-3 h-3' />
                    Operational
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <AdminFooter />
    </div>
  );
}
