import { Metadata } from 'next';
import { SpecialForm } from '@/components/admin/SpecialForm';
import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb';

export const metadata: Metadata = {
  title: 'New Special | Mr Build Admin',
  description: 'Create a new special',
};

export default function NewSpecialPage() {
  return (
    <div className='flex flex-col bg-gray-50 min-h-screen'>
      {/* Header */}
      <header className='bg-white border-gray-200 border-b'>
        <div className='mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl'>
          <div className='flex justify-between items-center h-16'>
            <h1 className='font-bold text-gray-900 text-2xl'>
              Create New Special
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className='flex-1 mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full max-w-7xl'>
        <AdminBreadcrumb />
        <SpecialForm />
      </main>
    </div>
  );
}
