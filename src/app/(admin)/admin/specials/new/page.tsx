import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SpecialForm } from '@/components/admin/SpecialForm';

export const metadata: Metadata = {
  title: 'New Special | Mr Build Admin',
  description: 'Create a new special',
};

export default function NewSpecialPage() {
  return (
    <div className='space-y-6 p-8'>
      {/* Header */}
      <div className='flex justify-between items-center'>
        <div className='flex items-center gap-4'>
          <Link href='/admin/specials'>
            <Button variant='ghost' size='icon'>
              <ChevronLeft className='w-5 h-5' />
            </Button>
          </Link>
          <div>
            <h1 className='font-bold text-3xl'>Create New Special</h1>
            <p className='mt-1 text-gray-600'>
              Upload a new promotional brochure or special
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <SpecialForm />
    </div>
  );
}
