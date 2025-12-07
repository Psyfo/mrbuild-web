'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ISpecial, SpecialStatus } from '@/types/special';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';

interface SpecialFormProps {
  special?: ISpecial;
  isEdit?: boolean;
}

export function SpecialForm({ special, isEdit = false }: SpecialFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form state
  const [title, setTitle] = useState(special?.title || '');
  const [description, setDescription] = useState(special?.description || '');
  const [status, setStatus] = useState<SpecialStatus>(
    special?.status || SpecialStatus.ACTIVE
  );
  const [displayOrder, setDisplayOrder] = useState(
    special?.displayOrder?.toString() || ''
  );
  const [validFrom, setValidFrom] = useState(
    special?.validFrom
      ? new Date(special.validFrom).toISOString().split('T')[0]
      : ''
  );
  const [validUntil, setValidUntil] = useState(
    special?.validUntil
      ? new Date(special.validUntil).toISOString().split('T')[0]
      : ''
  );
  const [isActive, setIsActive] = useState(special?.isActive ?? true);

  // Image state
  const [imageFile, setImageFile] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    special?.image?.secureUrl || null
  );

  // Validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch next display order for new specials
  useEffect(() => {
    if (!isEdit && !displayOrder) {
      const fetchNextOrder = async () => {
        try {
          const response = await fetch(
            '/api/admin/specials?pageSize=1&sortBy=displayOrder&sortOrder=desc'
          );
          if (response.ok) {
            const data = await response.json();
            const highestOrder = data.specials[0]?.displayOrder ?? -1;
            setDisplayOrder((highestOrder + 1).toString());
          }
        } catch (error) {
          console.error('Error fetching next display order:', error);
          setDisplayOrder('0');
        }
      };
      fetchNextOrder();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit]);

  // Handle image selection
  const handleImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }

      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      setUploading(true);

      // Convert to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImageFile(base64);
        setImagePreview(base64);
        setUploading(false);
      };
      reader.onerror = () => {
        toast.error('Failed to read image file');
        setUploading(false);
      };
      reader.readAsDataURL(file);
    },
    []
  );

  // Remove image
  const removeImage = () => {
    setImageFile(null);
    setImagePreview(special?.image?.secureUrl || null);
  };

  // Validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!isEdit && !imageFile) {
      newErrors.image = 'Image is required';
    }

    // Date validation: if one date is provided, both must be provided
    if (validFrom && !validUntil) {
      newErrors.validUntil = 'Valid Until is required when Valid From is set';
    }
    if (validUntil && !validFrom) {
      newErrors.validFrom = 'Valid From is required when Valid Until is set';
    }

    // If both dates are provided, validate the range
    if (validFrom && validUntil) {
      const from = new Date(validFrom);
      const until = new Date(validUntil);
      if (from >= until) {
        newErrors.validUntil = 'Valid Until must be after Valid From';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the validation errors');
      return;
    }

    setLoading(true);

    try {
      const specialData: {
        title: string;
        description?: string;
        status: SpecialStatus;
        displayOrder: number;
        validFrom?: string;
        validUntil?: string;
        isActive: boolean;
        image?: string;
      } = {
        title,
        description: description || undefined,
        status,
        displayOrder: parseInt(displayOrder) || 0,
        validFrom: validFrom || undefined,
        validUntil: validUntil || undefined,
        isActive,
      };

      // Add image if new upload or creating
      if (imageFile) {
        specialData.image = imageFile;
      }

      const url = isEdit
        ? `/api/admin/specials/${special?._id}`
        : '/api/admin/specials';

      const method = isEdit ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(specialData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save special');
      }

      toast.success(
        isEdit
          ? 'Special updated successfully!'
          : 'Special created successfully!'
      );
      router.push('/admin/specials');
      router.refresh();
    } catch (error) {
      console.error('Error saving special:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to save special'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            Enter the basic details for the special
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='title'>
              Title <span className='text-red-500'>*</span>
            </Label>
            <Input
              id='title'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder='e.g., January 2025 Specials'
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && (
              <p className='text-red-500 text-sm'>{errors.title}</p>
            )}
            <p className='text-gray-500 text-xs'>
              This title is for admin reference and not shown publicly
            </p>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='description'>Description</Label>
            <Textarea
              id='description'
              value={description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setDescription(e.target.value)
              }
              placeholder='Optional internal notes or description'
              rows={3}
            />
            <p className='text-gray-500 text-xs'>
              Internal notes only - not displayed on website
            </p>
          </div>

          <div className='gap-4 grid grid-cols-1 md:grid-cols-2'>
            <div className='space-y-2'>
              <Label htmlFor='status'>Status</Label>
              <Select
                value={status}
                onValueChange={(value) => setStatus(value as SpecialStatus)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={SpecialStatus.ACTIVE}>Active</SelectItem>
                  <SelectItem value={SpecialStatus.INACTIVE}>
                    Inactive
                  </SelectItem>
                  <SelectItem value={SpecialStatus.SCHEDULED}>
                    Scheduled
                  </SelectItem>
                  <SelectItem value={SpecialStatus.EXPIRED}>Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='displayOrder'>Display Order</Label>
              <Input
                id='displayOrder'
                type='number'
                value={displayOrder}
                onChange={(e) => setDisplayOrder(e.target.value)}
                placeholder='0'
                disabled
              />
              <p className='text-gray-500 text-xs'>
                Order is auto-assigned. Use ▲▼ buttons in the specials list to
                reorder after creation.
              </p>
            </div>
          </div>

          <div className='flex items-center space-x-2'>
            <Checkbox
              id='isActive'
              checked={isActive}
              onCheckedChange={(checked) => setIsActive(checked as boolean)}
            />
            <Label htmlFor='isActive' className='font-normal'>
              Active (visible to public when status is ACTIVE)
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Validity Period */}
      <Card>
        <CardHeader>
          <CardTitle>Validity Period (Optional)</CardTitle>
          <CardDescription>
            Set dates when this special should be shown. Both dates must be
            provided together, or leave both empty.
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='gap-4 grid grid-cols-1 md:grid-cols-2'>
            <div className='space-y-2'>
              <Label htmlFor='validFrom'>Valid From</Label>
              <Input
                id='validFrom'
                type='date'
                value={validFrom}
                onChange={(e) => setValidFrom(e.target.value)}
                className={errors.validFrom ? 'border-red-500' : ''}
              />
              {errors.validFrom && (
                <p className='text-red-500 text-sm'>{errors.validFrom}</p>
              )}
              <p className='text-gray-500 text-xs'>
                Special will show from this date
              </p>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='validUntil'>Valid Until</Label>
              <Input
                id='validUntil'
                type='date'
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
                className={errors.validUntil ? 'border-red-500' : ''}
              />
              {errors.validUntil && (
                <p className='text-red-500 text-sm'>{errors.validUntil}</p>
              )}
              <p className='text-gray-500 text-xs'>
                Special will hide after this date
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Image Upload */}
      <Card>
        <CardHeader>
          <CardTitle>
            Special Image {!isEdit && <span className='text-red-500'>*</span>}
          </CardTitle>
          <CardDescription>
            Upload the promotional brochure or special image (max 5MB)
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          {imagePreview ? (
            <div className='space-y-4'>
              <div className='relative'>
                <Image
                  src={imagePreview}
                  alt='Special preview'
                  width={600}
                  height={400}
                  className='mx-auto border rounded-lg'
                  style={{ maxHeight: '400px', width: 'auto' }}
                />
              </div>
              <div className='flex gap-2'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={removeImage}
                  disabled={uploading}
                >
                  Remove Image
                </Button>
                <Label
                  htmlFor='image-upload'
                  className='inline-flex justify-center items-center bg-background hover:bg-accent px-4 py-2 border border-input rounded-md h-10 font-medium text-sm hover:text-accent-foreground cursor-pointer'
                >
                  {imageFile ? 'Change Image' : 'Upload New Image'}
                </Label>
                <input
                  id='image-upload'
                  type='file'
                  accept='image/*'
                  onChange={handleImageChange}
                  disabled={uploading}
                  className='hidden'
                  aria-label='Upload special image'
                />
              </div>
            </div>
          ) : (
            <div>
              <Label
                htmlFor='image-upload'
                className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 cursor-pointer hover:bg-gray-50 ${
                  errors.image ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <div className='text-center'>
                  <div className='mb-4 text-4xl'>📷</div>
                  <p className='mb-2 font-medium'>Click to upload image</p>
                  <p className='text-gray-500 text-sm'>
                    PNG, JPG, GIF up to 5MB
                  </p>
                </div>
              </Label>
              <input
                id='image-upload'
                type='file'
                accept='image/*'
                onChange={handleImageChange}
                disabled={uploading}
                className='hidden'
                aria-label='Upload special image'
              />
              {errors.image && (
                <p className='mt-2 text-red-500 text-sm'>{errors.image}</p>
              )}
            </div>
          )}

          {uploading && (
            <div className='text-gray-600 text-center'>Processing image...</div>
          )}

          <div className='bg-blue-50 p-4 rounded-lg'>
            <p className='font-medium text-sm'>💡 Tips:</p>
            <ul className='space-y-1 mt-2 text-gray-700 text-sm list-disc list-inside'>
              <li>Use high-quality images for best results</li>
              <li>Recommended size: 1200x1200 pixels</li>
              <li>Images are automatically optimized</li>
              <li>Supported formats: PNG, JPG, GIF, WebP</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className='flex justify-end gap-4'>
        <Button
          type='button'
          variant='outline'
          onClick={() => router.back()}
          disabled={loading || uploading}
        >
          Cancel
        </Button>
        <Button type='submit' disabled={loading || uploading}>
          {loading
            ? isEdit
              ? 'Updating...'
              : 'Creating...'
            : isEdit
            ? 'Update Special'
            : 'Create Special'}
        </Button>
      </div>
    </form>
  );
}
