/**
 * Special Repository
 * Data access layer for specials management
 */

import { ObjectId } from 'mongodb';
import { getDatabase } from '../mongodb';
import {
  ISpecial,
  ISpecialInput,
  SpecialStatus,
  ISpecialStats,
} from '@/types/special';

const COLLECTION_NAME = 'specials';

/**
 * Create a new special
 */
export async function create(specialData: ISpecialInput): Promise<ISpecial> {
  const db = await getDatabase();
  const collection = db.collection<ISpecial>(COLLECTION_NAME);

  const special: Omit<ISpecial, '_id'> = {
    ...specialData,
    status: specialData.status || SpecialStatus.ACTIVE,
    displayOrder: specialData.displayOrder || 0,
    isActive: specialData.isActive ?? true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await collection.insertOne(special as ISpecial);
  return { ...special, _id: result.insertedId.toString() };
}

/**
 * Find special by ID
 */
export async function findById(id: string): Promise<ISpecial | null> {
  const db = await getDatabase();
  const collection = db.collection<ISpecial>(COLLECTION_NAME);

  const special = await collection.findOne({ _id: new ObjectId(id) as any });
  if (!special) return null;

  return {
    ...special,
    _id: special._id.toString(),
  };
}

/**
 * Find all specials with filters and pagination
 */
export async function findAll(params: {
  page?: number;
  pageSize?: number;
  status?: SpecialStatus;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}): Promise<{ specials: ISpecial[]; total: number }> {
  const db = await getDatabase();
  const collection = db.collection<ISpecial>(COLLECTION_NAME);

  const {
    page = 1,
    pageSize = 10,
    status,
    isActive,
    sortBy = 'displayOrder',
    sortOrder = 'asc',
  } = params;

  // Build filter
  const filter: any = {};
  if (status) filter.status = status;
  if (isActive !== undefined) filter.isActive = isActive;

  // Build sort
  const sort: any = {};
  sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

  // Get total count
  const total = await collection.countDocuments(filter);

  // Get paginated results
  const specials = await collection
    .find(filter)
    .sort(sort)
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .toArray();

  return {
    specials: specials.map((special) => ({
      ...special,
      _id: special._id.toString(),
    })),
    total,
  };
}

/**
 * Find all active specials (for public display)
 */
export async function findAllActive(): Promise<ISpecial[]> {
  const db = await getDatabase();
  const collection = db.collection<ISpecial>(COLLECTION_NAME);

  const now = new Date();

  const query = {
    isActive: true,
    status: SpecialStatus.ACTIVE,
    $or: [{ validFrom: { $exists: false } }, { validFrom: { $lte: now } }],
    $and: [
      {
        $or: [
          { validUntil: { $exists: false } },
          { validUntil: { $gte: now } },
        ],
      },
    ],
  };

  const specials = await collection
    .find(query)
    .sort({ displayOrder: 1, createdAt: -1 })
    .toArray();

  return specials.map((special) => ({
    ...special,
    _id: special._id.toString(),
  }));
}

/**
 * Check if there are any active specials
 */
export async function hasActiveSpecials(): Promise<boolean> {
  const db = await getDatabase();
  const collection = db.collection<ISpecial>(COLLECTION_NAME);

  const now = new Date();

  const count = await collection.countDocuments({
    isActive: true,
    status: SpecialStatus.ACTIVE,
    $or: [{ validFrom: { $exists: false } }, { validFrom: { $lte: now } }],
    $and: [
      {
        $or: [
          { validUntil: { $exists: false } },
          { validUntil: { $gte: now } },
        ],
      },
    ],
  });

  return count > 0;
}

/**
 * Update special
 */
export async function update(
  id: string,
  updates: Partial<ISpecialInput>
): Promise<ISpecial | null> {
  const db = await getDatabase();
  const collection = db.collection<ISpecial>(COLLECTION_NAME);

  // Filter out undefined values to prevent clearing fields
  const cleanUpdates: any = {};
  Object.keys(updates).forEach((key) => {
    const value = (updates as any)[key];
    if (value !== undefined) {
      cleanUpdates[key] = value;
    }
  });

  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(id) as any },
    {
      $set: {
        ...cleanUpdates,
        updatedAt: new Date(),
      },
    },
    { returnDocument: 'after' }
  );

  if (!result) return null;

  return {
    ...result,
    _id: result._id.toString(),
  };
}

/**
 * Delete special
 */
export async function deleteOne(id: string): Promise<boolean> {
  const db = await getDatabase();
  const collection = db.collection<ISpecial>(COLLECTION_NAME);

  const result = await collection.deleteOne({ _id: new ObjectId(id) as any });
  return result.deletedCount === 1;
}

/**
 * Bulk delete specials
 */
export async function bulkDelete(ids: string[]): Promise<number> {
  const db = await getDatabase();
  const collection = db.collection<ISpecial>(COLLECTION_NAME);

  const objectIds = ids.map((id) => new ObjectId(id) as any);
  const result = await collection.deleteMany({ _id: { $in: objectIds } });

  return result.deletedCount;
}

/**
 * Get special statistics
 */
export async function getStats(): Promise<ISpecialStats> {
  const db = await getDatabase();
  const collection = db.collection<ISpecial>(COLLECTION_NAME);

  const total = await collection.countDocuments();
  const active = await collection.countDocuments({
    status: SpecialStatus.ACTIVE,
  });
  const inactive = await collection.countDocuments({
    status: SpecialStatus.INACTIVE,
  });
  const scheduled = await collection.countDocuments({
    status: SpecialStatus.SCHEDULED,
  });
  const expired = await collection.countDocuments({
    status: SpecialStatus.EXPIRED,
  });

  const hasActive = await hasActiveSpecials();

  return {
    total,
    active,
    inactive,
    scheduled,
    expired,
    hasActiveSpecials: hasActive,
  };
}

/**
 * Create indexes for better performance
 */
export async function createIndexes(): Promise<void> {
  const db = await getDatabase();
  const collection = db.collection<ISpecial>(COLLECTION_NAME);

  await collection.createIndexes([
    { key: { status: 1 } },
    { key: { isActive: 1 } },
    { key: { displayOrder: 1 } },
    { key: { createdAt: -1 } },
    { key: { validFrom: 1 } },
    { key: { validUntil: 1 } },
    { key: { 'image.publicId': 1 } },
  ]);
}
