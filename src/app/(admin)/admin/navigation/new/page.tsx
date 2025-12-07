'use client';
import NavigationForm from '../components/NavigationForm';
import { AdminFooter } from '@/components/admin/AdminFooter';
import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb';

export default function NewNavigationPage() {
  return (
    <div className='flex flex-col bg-gray-50 min-h-screen'>
      {/* Header */}
      <header className='bg-white border-gray-200 border-b'>
        <div className='mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl'>
          <div className='flex justify-between items-center h-16'>
            <h1 className='font-bold text-gray-900 text-2xl'>
              Add Navigation Item
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className='flex-1 mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl'>
        <AdminBreadcrumb />
        <NavigationForm />
      </main>

      {/* Footer */}
      <AdminFooter />
    </div>
  );
}
