'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { INavigation } from '@/types/navigation';
import { toast } from 'sonner';

interface NavigationFormProps {
  navigation?: INavigation;
  isEdit?: boolean;
}

export default function NavigationForm({
  navigation,
  isEdit = false,
}: NavigationFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    label: navigation?.label || '',
    href: navigation?.href || '',
    order: navigation?.order || 1,
    isActive: navigation?.isActive ?? true,
    openInNewTab: navigation?.openInNewTab || false,
    isExternal: navigation?.isExternal || false,
  });

  // Auto-detect if href is external
  useEffect(() => {
    if (formData.href) {
      const isExternal =
        formData.href.startsWith('http://') ||
        formData.href.startsWith('https://');
      if (isExternal !== formData.isExternal) {
        setFormData((prev) => ({ ...prev, isExternal }));
      }
    }
  }, [formData.href]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isEdit
        ? `/api/admin/navigation/${navigation?._id}`
        : '/api/admin/navigation';
      const method = isEdit ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success(
          isEdit
            ? 'Navigation item updated successfully'
            : 'Navigation item created successfully'
        );
        router.push('/admin/navigation');
        router.refresh();
      } else {
        toast.error(
          `Failed to ${isEdit ? 'update' : 'create'} navigation item`
        );
      }
    } catch (error) {
      console.error('Error saving navigation:', error);
      toast.error('Error saving navigation item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-6 max-w-2xl'>
      <div>
        <Label htmlFor='label'>Label *</Label>
        <Input
          id='label'
          value={formData.label}
          onChange={(e) => setFormData({ ...formData, label: e.target.value })}
          placeholder='e.g., About, Services, Contact'
          required
        />
        <p className='mt-1 text-gray-500 text-sm'>
          The text displayed in the navigation
        </p>
      </div>

      <div>
        <Label htmlFor='href'>Link *</Label>
        <Input
          id='href'
          value={formData.href}
          onChange={(e) => setFormData({ ...formData, href: e.target.value })}
          placeholder='e.g., #about, /about, https://example.com'
          required
        />
        <p className='mt-1 text-gray-500 text-sm'>
          Use #section-id for anchor links, /path for internal pages, or full
          URL for external sites
        </p>
      </div>

      <div>
        <Label htmlFor='order'>Display Order *</Label>
        <Input
          id='order'
          type='number'
          value={formData.order}
          onChange={(e) =>
            setFormData({ ...formData, order: parseInt(e.target.value) })
          }
          min='1'
          required
        />
        <p className='mt-1 text-gray-500 text-sm'>
          Lower numbers appear first (1, 2, 3...)
        </p>
      </div>

      <div className='space-y-4'>
        <div className='flex items-center space-x-2'>
          <Checkbox
            id='isActive'
            checked={formData.isActive}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, isActive: checked as boolean })
            }
          />
          <Label htmlFor='isActive' className='cursor-pointer'>
            Active (show in navigation)
          </Label>
        </div>

        <div className='flex items-center space-x-2'>
          <Checkbox
            id='isExternal'
            checked={formData.isExternal}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, isExternal: checked as boolean })
            }
          />
          <Label htmlFor='isExternal' className='cursor-pointer'>
            External link (points to another website)
          </Label>
        </div>

        <div className='flex items-center space-x-2'>
          <Checkbox
            id='openInNewTab'
            checked={formData.openInNewTab}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, openInNewTab: checked as boolean })
            }
          />
          <Label htmlFor='openInNewTab' className='cursor-pointer'>
            Open in new tab
          </Label>
        </div>
      </div>

      <div className='flex gap-4'>
        <Button type='submit' disabled={loading}>
          {loading
            ? 'Saving...'
            : isEdit
            ? 'Update Navigation'
            : 'Create Navigation'}
        </Button>
        <Button type='button' variant='outline' onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
