/* eslint-disable @typescript-eslint/no-explicit-any */
import { ObjectId } from 'mongodb';

import { getDatabase } from '@/lib/mongodb';
import { INavigation } from '@/types/navigation';

const COLLECTION_NAME = 'navigation';

export async function findAll(): Promise<INavigation[]> {
  const db = await getDatabase();
  const collection = db.collection<INavigation>(COLLECTION_NAME);
  const items = await collection.find({}).sort({ order: 1 }).toArray();
  return items.map((item) => ({ ...item, _id: item._id.toString() }));
}

export async function findAllActive(): Promise<INavigation[]> {
  const db = await getDatabase();
  const collection = db.collection<INavigation>(COLLECTION_NAME);
  const items = await collection
    .find({
      isActive: true,
    })
    .sort({ order: 1 })
    .toArray();
  return items.map((item) => ({ ...item, _id: item._id.toString() }));
}

export async function findById(id: string): Promise<INavigation | null> {
  const db = await getDatabase();
  const collection = db.collection<INavigation>(COLLECTION_NAME);
  const item = await collection.findOne({ _id: new ObjectId(id) } as any);
  if (!item) return null;
  return { ...item, _id: item._id.toString() };
}

export async function create(
  navigation: Omit<INavigation, '_id'>
): Promise<INavigation> {
  const db = await getDatabase();
  const collection = db.collection<INavigation>(COLLECTION_NAME);
  const now = new Date();
  const result = await collection.insertOne({
    ...navigation,
    createdAt: now,
    updatedAt: now,
  } as INavigation);

  return {
    _id: result.insertedId.toString(),
    ...navigation,
    createdAt: now,
    updatedAt: now,
  };
}

export async function update(
  id: string,
  updates: Partial<INavigation>
): Promise<boolean> {
  const db = await getDatabase();
  const collection = db.collection<INavigation>(COLLECTION_NAME);

  // Filter out undefined values
  const cleanUpdates: any = {};
  Object.keys(updates).forEach((key) => {
    const value = (updates as any)[key];
    if (value !== undefined) {
      cleanUpdates[key] = value;
    }
  });

  const result = await collection.updateOne({ _id: new ObjectId(id) } as any, {
    $set: {
      ...cleanUpdates,
      updatedAt: new Date(),
    },
  });

  return result.modifiedCount > 0;
}

export async function deleteNavigation(id: string): Promise<boolean> {
  const db = await getDatabase();
  const collection = db.collection<INavigation>(COLLECTION_NAME);
  const result = await collection.deleteOne({ _id: new ObjectId(id) } as any);
  return result.deletedCount > 0;
}

export async function reorder(
  items: { id: string; order: number }[]
): Promise<boolean> {
  const db = await getDatabase();
  const collection = db.collection<INavigation>(COLLECTION_NAME);
  const bulkOps = items.map((item) => ({
    updateOne: {
      filter: { _id: new ObjectId(item.id) } as any,
      update: { $set: { order: item.order, updatedAt: new Date() } },
    },
  }));

  const result = await collection.bulkWrite(bulkOps);
  return result.modifiedCount > 0;
}
