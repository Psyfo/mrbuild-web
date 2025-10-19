'use client';

import { usePathname, useRouter } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BreadcrumbSegment {
  label: string;
  href: string;
}

export function AdminBreadcrumb() {
  const pathname = usePathname();
  const router = useRouter();

  // Generate breadcrumb segments from pathname
  const generateBreadcrumbs = (): BreadcrumbSegment[] => {
    const segments: BreadcrumbSegment[] = [
      { label: 'Dashboard', href: '/admin' },
    ];

    // Remove /admin prefix and split path
    const pathWithoutAdmin = pathname.replace('/admin', '');
    if (!pathWithoutAdmin || pathWithoutAdmin === '/') {
      return segments;
    }

    const parts = pathWithoutAdmin.split('/').filter(Boolean);
    let currentPath = '/admin';

    parts.forEach((part, index) => {
      currentPath += `/${part}`;

      // Skip dynamic route segments (like [id])
      if (part.startsWith('[') && part.endsWith(']')) {
        return;
      }

      // Format the label (capitalize, replace hyphens with spaces)
      let label = part
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      // Special cases for better labels
      const labelMap: Record<string, string> = {
        new: 'New',
        edit: 'Edit',
        contacts: 'Contact Management',
        branches: 'Branch Management',
        specials: 'Specials Management',
        navigation: 'Navigation Management',
      };

      label = labelMap[part] || label;

      // Only add if not an action word on the last segment
      const isLastSegment = index === parts.length - 1;
      const isActionWord = ['new', 'edit'].includes(part.toLowerCase());

      if (!isActionWord || !isLastSegment) {
        segments.push({ label, href: currentPath });
      } else if (isActionWord && isLastSegment) {
        // For 'new' and 'edit', add them with modified label
        const actionLabel = part === 'new' ? 'Create New' : 'Edit';
        segments.push({ label: actionLabel, href: currentPath });
      }
    });

    return segments;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Don't show breadcrumb if we're on the dashboard
  if (pathname === '/admin' || pathname === '/admin/') {
    return null;
  }

  return (
    <nav className='flex items-center space-x-1 text-gray-600 text-sm'>
      {breadcrumbs.map((segment, index) => {
        const isLast = index === breadcrumbs.length - 1;
        const isFirst = index === 0;

        return (
          <div key={segment.href} className='flex items-center'>
            {/* Separator */}
            {!isFirst && (
              <ChevronRight className='mx-2 w-4 h-4 text-gray-400' />
            )}

            {/* Breadcrumb Link/Text */}
            {isLast ? (
              <span className='font-medium text-gray-900'>{segment.label}</span>
            ) : (
              <Button
                variant='ghost'
                size='sm'
                onClick={() => router.push(segment.href)}
                className='hover:bg-transparent p-0 h-auto font-normal text-gray-600 hover:text-gray-900'
              >
                {isFirst && <Home className='mr-1 w-4 h-4' />}
                {segment.label}
              </Button>
            )}
          </div>
        );
      })}
    </nav>
  );
}
