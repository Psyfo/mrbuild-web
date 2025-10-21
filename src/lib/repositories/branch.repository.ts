/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Branch Repository
 * Data access layer for branch operations
 */

import { Document, Sort, WithId } from 'mongodb';
import { getDatabase } from '@/lib/mongodb';
import { IBranch, IBranchFilters, IBranchStats } from '@/types/branch';

const COLLECTION_NAME = 'branches';

export class BranchRepository {
  /**
   * Create a new branch
   */
  async create(branchData: Omit<IBranch, '_id'>): Promise<IBranch> {
    const db = await getDatabase();
    const collection = db.collection(COLLECTION_NAME);

    const now = new Date();
    const branch = {
      ...branchData,
      createdAt: now,
      updatedAt: now,
    };

    const result = await collection.insertOne(branch as any);
    return {
      ...branch,
      _id: result.insertedId.toString(),
    } as IBranch;
  }

  /**
   * Find branch by ID
   */
  async findById(id: string): Promise<IBranch | null> {
    const db = await getDatabase();
    const collection = db.collection(COLLECTION_NAME);

    const { ObjectId } = await import('mongodb');
    const branch = await collection.findOne({ _id: new ObjectId(id) });

    if (!branch) return null;

    return this.mapDocumentToBranch(branch);
  }

  /**
   * Find branch by slug
   */
  async findBySlug(slug: string): Promise<IBranch | null> {
    const db = await getDatabase();
    const collection = db.collection(COLLECTION_NAME);

    const branch = await collection.findOne({ slug });

    if (!branch) return null;

    return this.mapDocumentToBranch(branch);
  }

  /**
   * Find all branches with filters and pagination
   */
  async findAll(
    filters: IBranchFilters = {},
    page: number = 1,
    pageSize: number = 20,
    sortBy: string = 'displayOrder',
    sortOrder: 'asc' | 'desc' = 'asc'
  ): Promise<{ branches: IBranch[]; total: number }> {
    const db = await getDatabase();
    const collection = db.collection(COLLECTION_NAME);

    const query = this.buildFilterQuery(filters);
    const sort: Sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const skip = (page - 1) * pageSize;

    const [branches, total] = await Promise.all([
      collection.find(query).sort(sort).skip(skip).limit(pageSize).toArray(),
      collection.countDocuments(query),
    ]);

    return {
      branches: branches.map((doc) => this.mapDocumentToBranch(doc)),
      total,
    };
  }

  /**
   * Find all active branches (for public display)
   */
  async findAllActive(): Promise<IBranch[]> {
    const db = await getDatabase();
    const collection = db.collection(COLLECTION_NAME);

    const branches = await collection
      .find({ isActive: true })
      .sort({ displayOrder: 1, branchName: 1 })
      .toArray();

    return branches.map((doc) => this.mapDocumentToBranch(doc));
  }

  /**
   * Update branch
   */
  async update(id: string, updates: Partial<IBranch>): Promise<IBranch | null> {
    const db = await getDatabase();
    const collection = db.collection(COLLECTION_NAME);

    const { ObjectId } = await import('mongodb');
    const { _id, createdAt, ...updateData } = updates as any;

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...updateData,
          updatedAt: new Date(),
        },
      },
      { returnDocument: 'after' }
    );

    if (!result) return null;

    return this.mapDocumentToBranch(result);
  }

  /**
   * Delete branch
   */
  async delete(id: string): Promise<boolean> {
    const db = await getDatabase();
    const collection = db.collection(COLLECTION_NAME);

    const { ObjectId } = await import('mongodb');
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    return result.deletedCount > 0;
  }

  /**
   * Bulk delete branches
   */
  async bulkDelete(ids: string[]): Promise<number> {
    const db = await getDatabase();
    const collection = db.collection(COLLECTION_NAME);

    const { ObjectId } = await import('mongodb');
    const objectIds = ids.map((id) => new ObjectId(id));

    const result = await collection.deleteMany({
      _id: { $in: objectIds },
    });

    return result.deletedCount;
  }

  /**
   * Get branch statistics
   */
  async getStats(): Promise<IBranchStats> {
    const db = await getDatabase();
    const collection = db.collection(COLLECTION_NAME);

    const [totalResult, statusResults, typeResults, provinceResults] =
      await Promise.all([
        collection.countDocuments(),
        collection
          .aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }])
          .toArray(),
        collection
          .aggregate([{ $group: { _id: '$branchType', count: { $sum: 1 } } }])
          .toArray(),
        collection
          .aggregate([{ $group: { _id: '$province', count: { $sum: 1 } } }])
          .toArray(),
      ]);

    const statusCounts = statusResults.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {} as Record<string, number>);

    const typeCounts = typeResults.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {} as Record<string, number>);

    const provinceMap = provinceResults.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: totalResult,
      active: statusCounts['ACTIVE'] || 0,
      inactive: statusCounts['INACTIVE'] || 0,
      comingSoon: statusCounts['COMING_SOON'] || 0,
      byType: {
        mrBuild: typeCounts['MR_BUILD'] || 0,
        theBuilder: typeCounts['THE_BUILDER'] || 0,
      },
      byProvince: provinceMap,
    };
  }

  /**
   * Build MongoDB filter query from filters
   */
  private buildFilterQuery(filters: IBranchFilters): Document {
    const query: Document = {};

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.branchType) {
      query.branchType = filters.branchType;
    }

    if (filters.city) {
      query.city = filters.city;
    }

    if (filters.province) {
      query.province = filters.province;
    }

    if (filters.isActive !== undefined) {
      query.isActive = filters.isActive;
    }

    if (filters.search) {
      query.$or = [
        { branchName: { $regex: filters.search, $options: 'i' } },
        { city: { $regex: filters.search, $options: 'i' } },
        { address1: { $regex: filters.search, $options: 'i' } },
        { address2: { $regex: filters.search, $options: 'i' } },
      ];
    }

    return query;
  }

  /**
   * Map MongoDB document to IBranch
   */
  private mapDocumentToBranch(doc: WithId<Document>): IBranch {
    return {
      _id: doc._id.toString(),
      branchName: doc.branchName,
      branchType: doc.branchType,
      status: doc.status,
      email: doc.email,
      telephone: doc.telephone,
      alternativePhone: doc.alternativePhone,
      address1: doc.address1,
      address2: doc.address2,
      city: doc.city,
      province: doc.province,
      postalCode: doc.postalCode,
      coordinates: doc.coordinates,
      operatingHours: doc.operatingHours,
      description: doc.description,
      facilities: doc.facilities,
      services: doc.services,
      imageUrl: doc.imageUrl,
      slug: doc.slug,
      displayOrder: doc.displayOrder,
      isActive: doc.isActive,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    } as IBranch;
  }

  /**
   * Create indexes for better query performance
   */
  async createIndexes(): Promise<void> {
    const db = await getDatabase();
    const collection = db.collection(COLLECTION_NAME);

    await Promise.all([
      collection.createIndex({ slug: 1 }, { unique: true }),
      collection.createIndex({ branchName: 1 }),
      collection.createIndex({ status: 1 }),
      collection.createIndex({ branchType: 1 }),
      collection.createIndex({ city: 1 }),
      collection.createIndex({ province: 1 }),
      collection.createIndex({ isActive: 1 }),
      collection.createIndex({ displayOrder: 1 }),
      collection.createIndex({ createdAt: -1 }),
      collection.createIndex(
        {
          branchName: 'text',
          city: 'text',
          address1: 'text',
          address2: 'text',
        },
        { weights: { branchName: 10, city: 5, address1: 3, address2: 1 } }
      ),
    ]);
  }
}

export const branchRepository = new BranchRepository();
