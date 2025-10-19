import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SpecialForm } from '@/components/admin/SpecialForm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'Edit Special | Mr Build Admin',
  description: 'Edit special details',
};

interface EditSpecialPageProps {
  params: Promise<{
    id: string;
  }>;
}

async function getSpecial(id: string) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return null;
  }

  try {
    // Import the service directly for server-side data fetching
    const { getSpecialById } = await import('@/lib/services/special.service');
    const special = await getSpecialById(id);
    return special;
  } catch (error) {
    console.error('Error fetching special:', error);
    return null;
  }
}

export default async function EditSpecialPage({
  params,
}: EditSpecialPageProps) {
  const { id } = await params;
  const special = await getSpecial(id);

  if (!special) {
    notFound();
  }

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
            <h1 className='font-bold text-3xl'>Edit Special</h1>
            <p className='mt-1 text-gray-600'>
              Update promotional brochure details
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <SpecialForm special={special} isEdit />
    </div>
  );
}
