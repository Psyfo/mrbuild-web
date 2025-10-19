'use client';

import { BranchForm } from '@/components/admin/BranchForm';
import { AdminFooter } from '@/components/admin/AdminFooter';

export default function NewBranchPage() {
  return (
    <div className='flex flex-col bg-gray-50 min-h-screen'>
      {/* Header */}
      <header className='bg-white border-gray-200 border-b'>
        <div className='mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl'>
          <div className='h-16'>
            <h1 className='flex items-center h-full font-bold text-gray-900 text-2xl'>
              Add New Branch
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className='flex-1 mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full max-w-7xl'>
        <BranchForm />
      </main>

      <AdminFooter />
    </div>
  );
}
