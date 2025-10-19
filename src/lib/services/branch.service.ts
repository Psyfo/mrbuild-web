/**
 * Branch Service
 * Business logic layer for branch management
 */

import { branchRepository } from '@/lib/repositories/branch.repository';
import {
  IBranch,
  IBranchFilters,
  IBranchFormData,
  IBranchListResponse,
  IBranchStats,
} from '@/types/branch';

export class BranchService {
  /**
   * Create a new branch
   */
  async createBranch(branchData: IBranchFormData): Promise<IBranch> {
    // Generate slug from branch name if not provided
    if (!branchData.slug) {
      branchData.slug = this.generateSlug(branchData.branchName);
    }

    // Ensure slug is unique
    const existing = await branchRepository.findBySlug(branchData.slug);
    if (existing) {
      branchData.slug = `${branchData.slug}-${Date.now()}`;
    }

    return branchRepository.create(branchData);
  }

  /**
   * Get all branches with pagination and filtering
   */
  async getBranches(
    filters: IBranchFilters = {},
    page: number = 1,
    pageSize: number = 20,
    sortBy: string = 'displayOrder',
    sortOrder: 'asc' | 'desc' = 'asc'
  ): Promise<IBranchListResponse> {
    const { branches, total } = await branchRepository.findAll(
      filters,
      page,
      pageSize,
      sortBy,
      sortOrder
    );

    const totalPages = Math.ceil(total / pageSize);

    return {
      branches,
      total,
      page,
      pageSize,
      totalPages,
    };
  }

  /**
   * Get all active branches (for public display)
   */
  async getActiveBranches(): Promise<IBranch[]> {
    return branchRepository.findAllActive();
  }

  /**
   * Get branch by ID
   */
  async getBranchById(id: string): Promise<IBranch | null> {
    return branchRepository.findById(id);
  }

  /**
   * Get branch by slug
   */
  async getBranchBySlug(slug: string): Promise<IBranch | null> {
    return branchRepository.findBySlug(slug);
  }

  /**
   * Update branch
   */
  async updateBranch(
    id: string,
    updates: Partial<IBranch>
  ): Promise<IBranch | null> {
    // If branch name is updated, regenerate slug
    if (updates.branchName && !updates.slug) {
      updates.slug = this.generateSlug(updates.branchName);

      // Ensure slug is unique
      const existing = await branchRepository.findBySlug(updates.slug);
      if (existing && existing._id !== id) {
        updates.slug = `${updates.slug}-${Date.now()}`;
      }
    }

    return branchRepository.update(id, updates);
  }

  /**
   * Delete branch
   */
  async deleteBranch(id: string): Promise<boolean> {
    return branchRepository.delete(id);
  }

  /**
   * Bulk delete branches
   */
  async bulkDeleteBranches(ids: string[]): Promise<number> {
    return branchRepository.bulkDelete(ids);
  }

  /**
   * Get branch statistics
   */
  async getBranchStats(): Promise<IBranchStats> {
    return branchRepository.getStats();
  }

  /**
   * Toggle branch active status
   */
  async toggleBranchStatus(id: string): Promise<IBranch | null> {
    const branch = await branchRepository.findById(id);
    if (!branch) return null;

    return branchRepository.update(id, { isActive: !branch.isActive });
  }

  /**
   * Reorder branches
   */
  async reorderBranches(
    branchIds: string[],
    startOrder: number = 1
  ): Promise<void> {
    const updates = branchIds.map((id, index) =>
      branchRepository.update(id, { displayOrder: startOrder + index })
    );

    await Promise.all(updates);
  }

  /**
   * Generate URL-friendly slug from branch name
   */
  private generateSlug(branchName: string): string {
    return branchName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  /**
   * Initialize database indexes
   */
  async initializeIndexes(): Promise<void> {
    await branchRepository.createIndexes();
  }
}

export const branchService = new BranchService();
