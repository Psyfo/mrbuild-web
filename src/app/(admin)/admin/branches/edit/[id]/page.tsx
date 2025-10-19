'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { IBranch } from '@/types/branch';
import { BranchForm } from '@/components/admin/BranchForm';
import { AdminFooter } from '@/components/admin/AdminFooter';
import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function EditBranchPage() {
  const params = useParams();
  const router = useRouter();
  const [branch, setBranch] = useState<IBranch | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBranch = async () => {
      try {
        const response = await fetch(`/api/admin/branches/${params.id}`);
        if (!response.ok) {
          throw new Error('Branch not found');
        }
        const data = await response.json();
        setBranch(data.branch);
      } catch (error) {
        console.error('Error fetching branch:', error);
        toast.error('Failed to load branch');
        router.push('/admin/branches');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchBranch();
    }
  }, [params.id, router]);

  if (loading) {
    return (
      <div className='flex justify-center items-center bg-gray-50 min-h-screen'>
        <LoadingSpinner />
      </div>
    );
  }

  if (!branch) {
    return null;
  }

  return (
    <div className='flex flex-col bg-gray-50 min-h-screen'>
      {/* Header */}
      <header className='bg-white border-gray-200 border-b'>
        <div className='mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl'>
          <div className='flex justify-between items-center h-16'>
            <h1 className='font-bold text-gray-900 text-2xl'>
              Edit Branch: {branch.branchName}
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className='flex-1 mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full max-w-7xl'>
        <AdminBreadcrumb />
        <BranchForm branch={branch} isEdit={true} />
      </main>

      <AdminFooter />
    </div>
  );
}
