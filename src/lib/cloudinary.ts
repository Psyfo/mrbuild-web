/**
 * Cloudinary Configuration and Utilities
 * Handles image upload, deletion, and transformation for specials
 */

import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload image to Cloudinary
 * @param file - Base64 encoded image or file buffer
 * @param folder - Cloudinary folder (default: 'mrbuild/specials')
 * @returns Upload result with image data
 */
export async function uploadToCloudinary(
  file: string,
  folder: string = 'mrbuild/specials'
) {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder,
      resource_type: 'image',
      transformation: [
        { width: 1200, height: 1200, crop: 'limit' }, // Max dimensions
        { quality: 'auto' }, // Auto quality
        { fetch_format: 'auto' }, // Auto format (WebP when supported)
      ],
    });

    return {
      publicId: result.public_id,
      url: result.url,
      secureUrl: result.secure_url,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
      createdAt: result.created_at,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image to Cloudinary');
  }
}

/**
 * Delete image from Cloudinary
 * @param publicId - Cloudinary public ID
 */
export async function deleteFromCloudinary(publicId: string) {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error('Failed to delete image from Cloudinary');
  }
}

/**
 * Get optimized image URL with transformations
 * @param publicId - Cloudinary public ID
 * @param width - Desired width
 * @param height - Desired height
 */
export function getOptimizedImageUrl(
  publicId: string,
  width?: number,
  height?: number
): string {
  return cloudinary.url(publicId, {
    width,
    height,
    crop: 'limit',
    quality: 'auto',
    fetch_format: 'auto',
  });
}

/**
 * Validate image file
 * @param file - Base64 encoded image
 * @param maxSizeMB - Maximum file size in MB (default: 5MB)
 */
export function validateImage(
  file: string,
  maxSizeMB: number = 5
): { valid: boolean; error?: string } {
  // Check if it's a valid base64 data URL
  const base64Pattern = /^data:image\/(png|jpg|jpeg|gif|webp);base64,/;
  if (!base64Pattern.test(file)) {
    return { valid: false, error: 'Invalid image format' };
  }

  // Estimate file size (base64 is roughly 33% larger than actual file)
  const base64Length = file.split(',')[1].length;
  const fileSizeInBytes = (base64Length * 3) / 4;
  const fileSizeInMB = fileSizeInBytes / (1024 * 1024);

  if (fileSizeInMB > maxSizeMB) {
    return {
      valid: false,
      error: `File size exceeds ${maxSizeMB}MB limit`,
    };
  }

  return { valid: true };
}

export default cloudinary;
