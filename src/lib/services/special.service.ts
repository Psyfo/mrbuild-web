/**
 * Special Service
 * Business logic for specials management
 */

import * as specialRepository from '../repositories/special.repository';
import {
  ISpecial,
  ISpecialInput,
  ISpecialListResponse,
  ISpecialStats,
  SpecialStatus,
} from '@/types/special';
import {
  uploadToCloudinary,
  deleteFromCloudinary,
  validateImage,
} from '../cloudinary';

/**
 * Create a new special with image upload
 */
export async function createSpecial(
  specialData: ISpecialInput
): Promise<ISpecial> {
  // Validate that image data exists
  if (!specialData.image) {
    throw new Error('Image is required');
  }

  // Create the special
  const special = await specialRepository.create(specialData);
  return special;
}

/**
 * Upload image and create special
 */
export async function createSpecialWithUpload(
  title: string,
  imageFile: string,
  options: {
    description?: string;
    status?: SpecialStatus;
    displayOrder?: number;
    validFrom?: Date;
    validUntil?: Date;
    isActive?: boolean;
  } = {}
): Promise<ISpecial> {
  // Validate image
  const validation = validateImage(imageFile);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  // Upload to Cloudinary
  const imageData = await uploadToCloudinary(imageFile);

  // Create special with image data
  const specialData: ISpecialInput = {
    title,
    image: imageData,
    description: options.description,
    status: options.status || SpecialStatus.ACTIVE,
    displayOrder: options.displayOrder || 0,
    validFrom: options.validFrom,
    validUntil: options.validUntil,
    isActive: options.isActive ?? true,
  };

  return await createSpecial(specialData);
}

/**
 * Get paginated list of specials
 */
export async function getSpecials(params: {
  page?: number;
  pageSize?: number;
  status?: SpecialStatus;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}): Promise<ISpecialListResponse> {
  const { specials, total } = await specialRepository.findAll(params);

  const page = params.page || 1;
  const pageSize = params.pageSize || 10;
  const totalPages = Math.ceil(total / pageSize);

  // Check if there are any active specials
  const hasActiveSpecials = await specialRepository.hasActiveSpecials();

  return {
    specials,
    total,
    totalPages,
    currentPage: page,
    pageSize,
    hasActiveSpecials,
  };
}

/**
 * Get all active specials for public display
 */
export async function getActiveSpecials(): Promise<ISpecial[]> {
  return await specialRepository.findAllActive();
}

/**
 * Check if specials section should be displayed
 */
export async function shouldDisplaySpecials(): Promise<boolean> {
  return await specialRepository.hasActiveSpecials();
}

/**
 * Get special by ID
 */
export async function getSpecialById(id: string): Promise<ISpecial | null> {
  return await specialRepository.findById(id);
}

/**
 * Update special
 */
export async function updateSpecial(
  id: string,
  updates: Partial<ISpecialInput>
): Promise<ISpecial | null> {
  return await specialRepository.update(id, updates);
}

/**
 * Update special with new image upload
 */
export async function updateSpecialWithUpload(
  id: string,
  imageFile: string,
  updates: Partial<ISpecialInput> = {}
): Promise<ISpecial | null> {
  // Get existing special
  const existing = await specialRepository.findById(id);
  if (!existing) {
    throw new Error('Special not found');
  }

  // Validate new image
  const validation = validateImage(imageFile);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  // Delete old image from Cloudinary
  try {
    await deleteFromCloudinary(existing.image.publicId);
  } catch (error) {
    console.error('Failed to delete old image:', error);
    // Continue anyway - don't fail the update
  }

  // Upload new image
  const imageData = await uploadToCloudinary(imageFile);

  // Update special with new image
  return await specialRepository.update(id, {
    ...updates,
    image: imageData,
  });
}

/**
 * Delete special and its image
 */
export async function deleteSpecial(id: string): Promise<boolean> {
  // Get special to get image public ID
  const special = await specialRepository.findById(id);
  if (!special) {
    return false;
  }

  // Delete from Cloudinary
  try {
    await deleteFromCloudinary(special.image.publicId);
  } catch (error) {
    console.error('Failed to delete image from Cloudinary:', error);
    // Continue with database deletion
  }

  // Delete from database
  return await specialRepository.deleteOne(id);
}

/**
 * Bulk delete specials
 */
export async function bulkDeleteSpecials(ids: string[]): Promise<number> {
  // Get all specials to delete their images
  const specials = await Promise.all(
    ids.map((id) => specialRepository.findById(id))
  );

  // Delete images from Cloudinary
  await Promise.all(
    specials
      .filter((s): s is ISpecial => s !== null)
      .map((special) =>
        deleteFromCloudinary(special.image.publicId).catch((error) => {
          console.error('Failed to delete image:', error);
        })
      )
  );

  // Delete from database
  return await specialRepository.bulkDelete(ids);
}

/**
 * Toggle special active status
 */
export async function toggleSpecialStatus(
  id: string
): Promise<ISpecial | null> {
  const special = await specialRepository.findById(id);
  if (!special) {
    return null;
  }

  return await specialRepository.update(id, {
    isActive: !special.isActive,
  });
}

/**
 * Get special statistics
 */
export async function getSpecialStats(): Promise<ISpecialStats> {
  return await specialRepository.getStats();
}

/**
 * Reorder specials
 */
export async function reorderSpecials(
  reorderData: Array<{ id: string; displayOrder: number }>
): Promise<void> {
  await Promise.all(
    reorderData.map(({ id, displayOrder }) =>
      specialRepository.update(id, { displayOrder })
    )
  );
}

/**
 * Auto-expire specials based on validUntil date
 */
export async function autoExpireSpecials(): Promise<number> {
  const { specials } = await specialRepository.findAll({
    status: SpecialStatus.ACTIVE,
    pageSize: 1000,
  });

  const now = new Date();
  let expiredCount = 0;

  for (const special of specials) {
    if (special.validUntil && special.validUntil < now) {
      await specialRepository.update(special._id!, {
        status: SpecialStatus.EXPIRED,
        isActive: false,
      });
      expiredCount++;
    }
  }

  return expiredCount;
}
