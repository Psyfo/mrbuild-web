import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import EditNavigationPageClient from '../EditNavigationPageClient';

export default async function EditNavigationPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/login');
  }

  const { getNavigationById } = await import(
    '@/lib/services/navigation.service'
  );
  const navigation = await getNavigationById(params.id);

  if (!navigation) {
    return (
      <div className='flex flex-col bg-gray-50 min-h-screen'>
        <header className='bg-white border-gray-200 border-b'>
          <div className='mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl'>
            <div className='flex justify-between items-center h-16'>
              <h1 className='font-bold text-gray-900 text-2xl'>
                Navigation Not Found
              </h1>
            </div>
          </div>
        </header>
        <main className='flex-1 mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl'>
          <p>The navigation item you're looking for doesn't exist.</p>
        </main>
      </div>
    );
  }

  return <EditNavigationPageClient navigation={navigation} />;
}
