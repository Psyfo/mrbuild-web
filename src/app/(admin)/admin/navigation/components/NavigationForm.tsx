'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
    <form onSubmit={handleSubmit} className='space-y-6'>
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Navigation Item Details</CardTitle>
          <CardDescription>
            Configure the navigation item label, link, and display properties
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='gap-4 grid grid-cols-1 md:grid-cols-2'>
            <div className='space-y-2'>
              <Label htmlFor='label'>
                Label <span className='text-red-500'>*</span>
              </Label>
              <Input
                id='label'
                value={formData.label}
                onChange={(e) =>
                  setFormData({ ...formData, label: e.target.value })
                }
                placeholder='e.g., About, Services, Contact'
                required
              />
              <p className='text-muted-foreground text-xs'>
                The text displayed in the navigation menu
              </p>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='order'>
                Display Order <span className='text-red-500'>*</span>
              </Label>
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
              <p className='text-muted-foreground text-xs'>
                Lower numbers appear first (1, 2, 3...)
              </p>
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='href'>
              Link <span className='text-red-500'>*</span>
            </Label>
            <Input
              id='href'
              value={formData.href}
              onChange={(e) =>
                setFormData({ ...formData, href: e.target.value })
              }
              placeholder='e.g., #about, /about, https://example.com'
              required
            />
            <p className='text-muted-foreground text-xs'>
              Use #section-id for anchor links, /path for internal pages, or
              full URL for external sites
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>
            Configure visibility and link behavior
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex items-center space-x-2'>
            <Checkbox
              id='isActive'
              checked={formData.isActive}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, isActive: checked as boolean })
              }
            />
            <Label htmlFor='isActive' className='font-normal cursor-pointer'>
              <span className='font-medium'>Active</span> - Show this item in
              the navigation
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
            <Label htmlFor='isExternal' className='font-normal cursor-pointer'>
              <span className='font-medium'>External link</span> - Points to
              another website
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
            <Label
              htmlFor='openInNewTab'
              className='font-normal cursor-pointer'
            >
              <span className='font-medium'>Open in new tab</span> - Opens link
              in a new browser tab
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardContent className='flex gap-4 pt-6'>
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
        </CardContent>
      </Card>
    </form>
  );
}
