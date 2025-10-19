'use client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { AdminFooter } from '@/components/admin/AdminFooter';
import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb';
import { INavigation } from '@/types/navigation';
import NavigationForm from '../components/NavigationForm';

export default function EditNavigationPageClient({
  navigation,
}: {
  navigation: INavigation;
}) {
  const router = useRouter();

  return (
    <div className='flex flex-col bg-gray-50 min-h-screen'>
      {/* Header */}
      <header className='bg-white border-gray-200 border-b'>
        <div className='mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl'>
          <div className='space-y-2 py-4'>
            <AdminBreadcrumb />
            <h1 className='font-bold text-gray-900 text-2xl'>
              Edit Navigation Item
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className='flex-1 mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl'>
        <NavigationForm navigation={navigation} isEdit />
      </main>

      {/* Footer */}
      <AdminFooter />
    </div>
  );
}
