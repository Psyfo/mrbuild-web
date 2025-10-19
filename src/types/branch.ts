/**
 * Branch Type Definitions
 * Defines interfaces and enums for branch management system
 */

/**
 * Branch Status
 */
export enum BranchStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  COMING_SOON = 'COMING_SOON',
}

/**
 * Branch Type (Mr. Build vs The Builder)
 */
export enum BranchType {
  MR_BUILD = 'MR_BUILD',
  THE_BUILDER = 'THE_BUILDER',
}

/**
 * Operating Hours for a single day
 */
export interface IDayHours {
  isOpen: boolean;
  openTime?: string; // Format: "HH:MM" (24-hour)
  closeTime?: string; // Format: "HH:MM" (24-hour)
  breakStart?: string; // Optional lunch break start
  breakEnd?: string; // Optional lunch break end
  note?: string; // e.g., "Hours might differ"
}

/**
 * Weekly Operating Hours
 */
export interface IOperatingHours {
  monday: IDayHours;
  tuesday: IDayHours;
  wednesday: IDayHours;
  thursday: IDayHours;
  friday: IDayHours;
  saturday: IDayHours;
  sunday: IDayHours;
  publicHolidays?: string; // Special note for public holidays
}

/**
 * Branch Location Coordinates
 */
export interface ICoordinates {
  latitude: number;
  longitude: number;
}

/**
 * Branch Interface
 */
export interface IBranch {
  _id?: string;
  branchName: string;
  branchType: BranchType;
  status: BranchStatus;

  // Contact Information
  email: string;
  telephone: string;
  alternativePhone?: string;

  // Address
  address1: string;
  address2?: string;
  city: string;
  province: string;
  postalCode: string;

  // Location
  coordinates: ICoordinates;

  // Operating Hours
  operatingHours: IOperatingHours;

  // Additional Info
  description?: string;
  facilities?: string[]; // e.g., ["Parking", "Wheelchair Access", "ATM"]
  services?: string[]; // e.g., ["Delivery", "Online Orders", "Expert Advice"]
  imageUrl?: string;

  // SEO
  slug: string; // URL-friendly identifier

  // Metadata
  displayOrder?: number; // For controlling order in lists
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Branch Filters for queries
 */
export interface IBranchFilters {
  status?: BranchStatus;
  branchType?: BranchType;
  city?: string;
  province?: string;
  isActive?: boolean;
  search?: string; // Search in name, city, or address
}

/**
 * Branch Statistics
 */
export interface IBranchStats {
  total: number;
  active: number;
  inactive: number;
  comingSoon: number;
  byType: {
    mrBuild: number;
    theBuilder: number;
  };
  byProvince: Record<string, number>;
}

/**
 * Branch List Response (for pagination)
 */
export interface IBranchListResponse {
  branches: IBranch[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Branch Form Data (for create/update)
 */
export type IBranchFormData = Omit<IBranch, '_id' | 'createdAt' | 'updatedAt'>;
