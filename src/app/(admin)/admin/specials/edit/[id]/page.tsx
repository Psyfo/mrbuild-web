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
    <div className='flex flex-col bg-gray-50 min-h-screen'>
      {/* Header */}
      <header className='bg-white border-gray-200 border-b'>
        <div className='mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl'>
          <div className='flex justify-between items-center h-16'>
            <div className='flex items-center gap-4'>
              <Link href='/admin/specials'>
                <Button
                  variant='ghost'
                  className='text-gray-600 hover:text-gray-900'
                >
                  ← Back to Specials
                </Button>
              </Link>
              <h1 className='font-bold text-gray-900 text-2xl'>Edit Special</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className='flex-1 mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full max-w-7xl'>
        <SpecialForm special={special} isEdit />
      </main>
    </div>
  );
}
