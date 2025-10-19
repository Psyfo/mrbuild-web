'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { IBranch, BranchStatus, BranchType } from '@/types/branch';
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

interface BranchFormProps {
  branch?: IBranch;
  isEdit?: boolean;
}

interface OperatingHours {
  monday: { open: string; close: string; closed: boolean };
  tuesday: { open: string; close: string; closed: boolean };
  wednesday: { open: string; close: string; closed: boolean };
  thursday: { open: string; close: string; closed: boolean };
  friday: { open: string; close: string; closed: boolean };
  saturday: { open: string; close: string; closed: boolean };
  sunday: { open: string; close: string; closed: boolean };
}

const defaultHours: OperatingHours = {
  monday: { open: '08:00', close: '17:00', closed: false },
  tuesday: { open: '08:00', close: '17:00', closed: false },
  wednesday: { open: '08:00', close: '17:00', closed: false },
  thursday: { open: '08:00', close: '17:00', closed: false },
  friday: { open: '08:00', close: '17:00', closed: false },
  saturday: { open: '08:00', close: '13:00', closed: false },
  sunday: { open: '08:00', close: '13:00', closed: true },
};

const daysOfWeek: (keyof OperatingHours)[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

export function BranchForm({ branch, isEdit = false }: BranchFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Form state
  const [branchName, setBranchName] = useState(branch?.branchName || '');
  const [branchType, setBranchType] = useState<BranchType>(
    branch?.branchType || BranchType.MR_BUILD
  );
  const [status, setStatus] = useState<BranchStatus>(
    branch?.status || BranchStatus.ACTIVE
  );
  const [address1, setAddress1] = useState(branch?.address1 || '');
  const [address2, setAddress2] = useState(branch?.address2 || '');
  const [city, setCity] = useState(branch?.city || '');
  const [province, setProvince] = useState(branch?.province || '');
  const [postalCode, setPostalCode] = useState(branch?.postalCode || '');
  const [email, setEmail] = useState(branch?.email || '');
  const [telephone, setTelephone] = useState(branch?.telephone || '');
  const [latitude, setLatitude] = useState(
    branch?.coordinates?.latitude?.toString() || ''
  );
  const [longitude, setLongitude] = useState(
    branch?.coordinates?.longitude?.toString() || ''
  );
  const [isActive, setIsActive] = useState(branch?.isActive ?? true);
  const [displayOrder, setDisplayOrder] = useState(
    branch?.displayOrder?.toString() || '0'
  );

  const [operatingHours, setOperatingHours] =
    useState<OperatingHours>(defaultHours);

  // Initialize operating hours from branch data
  useEffect(() => {
    if (branch?.operatingHours) {
      const hours = branch.operatingHours as unknown as OperatingHours;
      setOperatingHours(hours);
    }
  }, [branch]);

  // Validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!branchName.trim()) {
      newErrors.branchName = 'Branch name is required';
    }

    if (!address1.trim()) {
      newErrors.address1 = 'Address is required';
    }

    if (!city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!province.trim()) {
      newErrors.province = 'Province is required';
    }

    if (!postalCode.trim()) {
      newErrors.postalCode = 'Postal code is required';
    } else if (!/^\d{4}$/.test(postalCode)) {
      newErrors.postalCode = 'Postal code must be 4 digits';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!telephone.trim()) {
      newErrors.telephone = 'Telephone is required';
    } else if (!/^[\d\s\-\+\(\)]+$/.test(telephone)) {
      newErrors.telephone = 'Invalid telephone format';
    }

    if (!latitude.trim()) {
      newErrors.latitude = 'Latitude is required';
    } else if (isNaN(parseFloat(latitude))) {
      newErrors.latitude = 'Latitude must be a number';
    }

    if (!longitude.trim()) {
      newErrors.longitude = 'Longitude is required';
    } else if (isNaN(parseFloat(longitude))) {
      newErrors.longitude = 'Longitude must be a number';
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
      const branchData = {
        branchName,
        branchType,
        status,
        address1,
        address2,
        city,
        province,
        postalCode,
        email,
        telephone,
        coordinates: {
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
        },
        operatingHours,
        isActive,
        displayOrder: parseInt(displayOrder) || 0,
      };

      const url = isEdit
        ? `/api/admin/branches/${branch?._id}`
        : '/api/admin/branches';

      const method = isEdit ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(branchData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save branch');
      }

      toast.success(
        isEdit ? 'Branch updated successfully!' : 'Branch created successfully!'
      );
      router.push('/admin/branches');
      router.refresh();
    } catch (error) {
      console.error('Error saving branch:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to save branch'
      );
    } finally {
      setLoading(false);
    }
  };

  const updateOperatingHours = (
    day: keyof OperatingHours,
    field: 'open' | 'close' | 'closed',
    value: string | boolean
  ) => {
    setOperatingHours((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }));
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            Enter the basic details for the branch
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='gap-4 grid grid-cols-1 md:grid-cols-2'>
            <div className='space-y-2'>
              <Label htmlFor='branchName'>
                Branch Name <span className='text-red-500'>*</span>
              </Label>
              <Input
                id='branchName'
                value={branchName}
                onChange={(e) => setBranchName(e.target.value)}
                placeholder='e.g., Mr. Build Tzaneen'
                className={errors.branchName ? 'border-red-500' : ''}
              />
              {errors.branchName && (
                <p className='text-red-500 text-sm'>{errors.branchName}</p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='branchType'>
                Branch Type <span className='text-red-500'>*</span>
              </Label>
              <Select
                value={branchType}
                onValueChange={(value) => setBranchType(value as BranchType)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={BranchType.MR_BUILD}>Mr Build</SelectItem>
                  <SelectItem value={BranchType.THE_BUILDER}>
                    The Builder
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className='gap-4 grid grid-cols-1 md:grid-cols-2'>
            <div className='space-y-2'>
              <Label htmlFor='status'>Status</Label>
              <Select
                value={status}
                onValueChange={(value) => setStatus(value as BranchStatus)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={BranchStatus.ACTIVE}>Active</SelectItem>
                  <SelectItem value={BranchStatus.INACTIVE}>
                    Inactive
                  </SelectItem>
                  <SelectItem value={BranchStatus.COMING_SOON}>
                    Coming Soon
                  </SelectItem>
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
              />
              <p className='text-gray-500 text-xs'>
                Lower numbers appear first
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
              Active (visible to public)
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Address Information */}
      <Card>
        <CardHeader>
          <CardTitle>Address Information</CardTitle>
          <CardDescription>Physical location of the branch</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='address1'>
              Address Line 1 <span className='text-red-500'>*</span>
            </Label>
            <Input
              id='address1'
              value={address1}
              onChange={(e) => setAddress1(e.target.value)}
              placeholder='Street address'
              className={errors.address1 ? 'border-red-500' : ''}
            />
            {errors.address1 && (
              <p className='text-red-500 text-sm'>{errors.address1}</p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='address2'>Address Line 2</Label>
            <Input
              id='address2'
              value={address2}
              onChange={(e) => setAddress2(e.target.value)}
              placeholder='Suburb, unit, etc. (optional)'
            />
          </div>

          <div className='gap-4 grid grid-cols-1 md:grid-cols-3'>
            <div className='space-y-2'>
              <Label htmlFor='city'>
                City <span className='text-red-500'>*</span>
              </Label>
              <Input
                id='city'
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder='City'
                className={errors.city ? 'border-red-500' : ''}
              />
              {errors.city && (
                <p className='text-red-500 text-sm'>{errors.city}</p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='province'>
                Province <span className='text-red-500'>*</span>
              </Label>
              <Input
                id='province'
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                placeholder='Province'
                className={errors.province ? 'border-red-500' : ''}
              />
              {errors.province && (
                <p className='text-red-500 text-sm'>{errors.province}</p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='postalCode'>
                Postal Code <span className='text-red-500'>*</span>
              </Label>
              <Input
                id='postalCode'
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder='0000'
                maxLength={4}
                className={errors.postalCode ? 'border-red-500' : ''}
              />
              {errors.postalCode && (
                <p className='text-red-500 text-sm'>{errors.postalCode}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>How customers can reach this branch</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='gap-4 grid grid-cols-1 md:grid-cols-2'>
            <div className='space-y-2'>
              <Label htmlFor='email'>
                Email <span className='text-red-500'>*</span>
              </Label>
              <Input
                id='email'
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='branch@example.com'
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className='text-red-500 text-sm'>{errors.email}</p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='telephone'>
                Telephone <span className='text-red-500'>*</span>
              </Label>
              <Input
                id='telephone'
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                placeholder='015 123 4567'
                className={errors.telephone ? 'border-red-500' : ''}
              />
              {errors.telephone && (
                <p className='text-red-500 text-sm'>{errors.telephone}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Coordinates */}
      <Card>
        <CardHeader>
          <CardTitle>Map Coordinates</CardTitle>
          <CardDescription>
            GPS coordinates for map display (use Google Maps to find exact
            coordinates)
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='gap-4 grid grid-cols-1 md:grid-cols-2'>
            <div className='space-y-2'>
              <Label htmlFor='latitude'>
                Latitude <span className='text-red-500'>*</span>
              </Label>
              <Input
                id='latitude'
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                placeholder='-23.8962'
                className={errors.latitude ? 'border-red-500' : ''}
              />
              {errors.latitude && (
                <p className='text-red-500 text-sm'>{errors.latitude}</p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='longitude'>
                Longitude <span className='text-red-500'>*</span>
              </Label>
              <Input
                id='longitude'
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                placeholder='30.1475'
                className={errors.longitude ? 'border-red-500' : ''}
              />
              {errors.longitude && (
                <p className='text-red-500 text-sm'>{errors.longitude}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Operating Hours */}
      <Card>
        <CardHeader>
          <CardTitle>Operating Hours</CardTitle>
          <CardDescription>Set the business hours for each day</CardDescription>
        </CardHeader>
        <CardContent className='space-y-3'>
          {daysOfWeek.map((day) => (
            <div
              key={day}
              className='items-center gap-4 grid grid-cols-[120px_1fr_1fr_80px]'
            >
              <Label className='capitalize'>{day}</Label>
              <Input
                type='time'
                value={operatingHours[day].open}
                onChange={(e) =>
                  updateOperatingHours(day, 'open', e.target.value)
                }
                disabled={operatingHours[day].closed}
              />
              <Input
                type='time'
                value={operatingHours[day].close}
                onChange={(e) =>
                  updateOperatingHours(day, 'close', e.target.value)
                }
                disabled={operatingHours[day].closed}
              />
              <div className='flex items-center space-x-2'>
                <Checkbox
                  id={`${day}-closed`}
                  checked={operatingHours[day].closed}
                  onCheckedChange={(checked) =>
                    updateOperatingHours(day, 'closed', checked as boolean)
                  }
                />
                <Label htmlFor={`${day}-closed`} className='text-xs'>
                  Closed
                </Label>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className='flex justify-end gap-4'>
        <Button
          type='button'
          variant='outline'
          onClick={() => router.back()}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type='submit' disabled={loading}>
          {loading
            ? isEdit
              ? 'Updating...'
              : 'Creating...'
            : isEdit
            ? 'Update Branch'
            : 'Create Branch'}
        </Button>
      </div>
    </form>
  );
}
