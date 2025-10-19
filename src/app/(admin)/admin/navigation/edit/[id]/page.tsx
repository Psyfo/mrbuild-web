import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import NavigationForm from '../../components/NavigationForm';

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
      <div className='p-8'>
        <h1 className='mb-6 font-bold text-3xl'>Navigation Not Found</h1>
        <p>The navigation item you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <div className='p-8'>
      <h1 className='mb-6 font-bold text-3xl'>Edit Navigation Item</h1>
      <NavigationForm navigation={navigation} isEdit />
    </div>
  );
}
