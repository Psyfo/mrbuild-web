/**
 * Special Type Definitions
 * Types for managing promotional specials/brochures with Cloudinary integration
 */

/**
 * Special Status Enum
 */
export enum SpecialStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SCHEDULED = 'SCHEDULED',
  EXPIRED = 'EXPIRED',
}

/**
 * Cloudinary Image Data
 */
export interface ICloudinaryImage {
  publicId: string; // Cloudinary public ID
  url: string; // Full URL to image
  secureUrl: string; // HTTPS URL to image
  width: number;
  height: number;
  format: string; // e.g., 'png', 'jpg'
  bytes: number; // File size in bytes
  createdAt: string;
}

/**
 * Special Interface
 * Represents a promotional special/brochure
 */
export interface ISpecial {
  _id?: string;
  title: string; // e.g., "January 2025 Specials"
  description?: string; // Optional description
  image: ICloudinaryImage; // Cloudinary image data
  status: SpecialStatus;
  displayOrder: number; // Order in slider (lower = first)
  validFrom?: Date; // Optional start date
  validUntil?: Date; // Optional end date
  isActive: boolean; // Quick toggle for visibility
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string; // Admin user ID
  updatedBy?: string; // Admin user ID
}

/**
 * Special Create/Update DTO
 */
export interface ISpecialInput {
  title: string;
  description?: string;
  image: ICloudinaryImage;
  status?: SpecialStatus;
  displayOrder?: number;
  validFrom?: Date;
  validUntil?: Date;
  isActive?: boolean;
}

/**
 * Special List Response
 */
export interface ISpecialListResponse {
  specials: ISpecial[];
  total: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasActiveSpecials: boolean; // Whether any specials are active
}

/**
 * Special Statistics
 */
export interface ISpecialStats {
  total: number;
  active: number;
  inactive: number;
  scheduled: number;
  expired: number;
  hasActiveSpecials: boolean; // Global flag for section display
}

/**
 * Cloudinary Upload Response
 */
export interface ICloudinaryUploadResponse {
  public_id: string;
  version: number;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  bytes: number;
  type: string;
  url: string;
  secure_url: string;
}
