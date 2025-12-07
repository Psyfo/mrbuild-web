/**
 * Contact Repository
 * Handles all database operations for contacts
 * Following Repository pattern for separation of concerns
 */

import { Collection, ObjectId, Document } from 'mongodb';
import { getDatabase } from '@/lib/mongodb';
import {
  IContact,
  ContactStatus,
  ContactPriority,
  IContactFilters,
} from '@/types/contact';

// MongoDB document type for Contact
type ContactDocument = Omit<IContact, '_id'> & { _id?: ObjectId };

export class ContactRepository {
  private collectionName = 'contacts';

  private async getCollection(): Promise<Collection<ContactDocument>> {
    const db = await getDatabase();
    return db.collection<ContactDocument>(this.collectionName);
  }

  /**
   * Create a new contact
   */
  async create(contact: Omit<IContact, '_id'>): Promise<IContact> {
    const collection = await this.getCollection();
    const result = await collection.insertOne(contact as ContactDocument);
    return {
      ...contact,
      _id: result.insertedId.toString(),
    } as IContact;
  }

  /**
   * Find contact by ID
   */
  async findById(id: string): Promise<IContact | null> {
    const collection = await this.getCollection();
    const contact = await collection.findOne({ _id: new ObjectId(id) });
    if (!contact) return null;
    return {
      ...contact,
      _id: contact._id?.toString(),
    } as IContact;
  }

  /**
   * Find all contacts with filters and pagination
   */
  async findAll(
    filters: IContactFilters = {},
    page: number = 1,
    pageSize: number = 20,
    sortBy: string = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc'
  ): Promise<{ contacts: IContact[]; total: number }> {
    const collection = await this.getCollection();
    const query = this.buildFilterQuery(filters);

    const skip = (page - 1) * pageSize;
    const sortDirection = sortOrder === 'desc' ? -1 : 1;

    const [contacts, total] = await Promise.all([
      collection
        .find(query)
        .sort({ [sortBy]: sortDirection })
        .skip(skip)
        .limit(pageSize)
        .toArray(),
      collection.countDocuments(query),
    ]);

    return {
      contacts: contacts.map((c) => ({
        ...c,
        _id: c._id?.toString(),
      })) as IContact[],
      total,
    };
  }

  /**
   * Update contact by ID
   */
  async update(
    id: string,
    updates: Partial<IContact>
  ): Promise<IContact | null> {
    const collection = await this.getCollection();

    // Remove _id from updates if present (can't update _id)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id: _removedId, ...updateFields } =
      updates as Partial<ContactDocument>;

    const updateDoc = {
      $set: {
        ...updateFields,
        updatedAt: new Date(),
      },
    };

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      updateDoc as Document,
      { returnDocument: 'after' }
    );

    if (!result) return null;

    return {
      ...result,
      _id: result._id?.toString(),
    } as IContact;
  }

  /**
   * Delete contact by ID
   */
  async delete(id: string): Promise<boolean> {
    const collection = await this.getCollection();
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  }

  /**
   * Bulk delete contacts
   */
  async bulkDelete(ids: string[]): Promise<number> {
    const collection = await this.getCollection();
    const objectIds = ids.map((id) => new ObjectId(id));
    const result = await collection.deleteMany({
      _id: { $in: objectIds },
    });
    return result.deletedCount;
  }

  /**
   * Bulk update contacts
   */
  async bulkUpdate(ids: string[], updates: Partial<IContact>): Promise<number> {
    const collection = await this.getCollection();
    const objectIds = ids.map((id) => new ObjectId(id));

    // Remove _id from updates if present (can't update _id)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id: _removedId, ...updateFields } =
      updates as Partial<ContactDocument>;

    const updateDoc = {
      $set: {
        ...updateFields,
        updatedAt: new Date(),
      },
    };

    const result = await collection.updateMany(
      { _id: { $in: objectIds } },
      updateDoc as Document
    );
    return result.modifiedCount;
  }

  /**
   * Get contact statistics
   */
  async getStats(): Promise<{
    total: number;
    byStatus: Record<ContactStatus, number>;
    byPriority: Record<ContactPriority, number>;
    todayCount: number;
    weekCount: number;
    monthCount: number;
  }> {
    const collection = await this.getCollection();

    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - 7);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [total, byStatus, byPriority, todayCount, weekCount, monthCount] =
      await Promise.all([
        collection.countDocuments(),
        collection
          .aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }])
          .toArray(),
        collection
          .aggregate([{ $group: { _id: '$priority', count: { $sum: 1 } } }])
          .toArray(),
        collection.countDocuments({ createdAt: { $gte: startOfDay } }),
        collection.countDocuments({ createdAt: { $gte: startOfWeek } }),
        collection.countDocuments({ createdAt: { $gte: startOfMonth } }),
      ]);

    const statusCounts = Object.values(ContactStatus).reduce((acc, status) => {
      acc[status] = 0;
      return acc;
    }, {} as Record<ContactStatus, number>);

    byStatus.forEach((item) => {
      if (item._id) {
        statusCounts[item._id as ContactStatus] = item.count;
      }
    });

    const priorityCounts = Object.values(ContactPriority).reduce(
      (acc, priority) => {
        acc[priority] = 0;
        return acc;
      },
      {} as Record<ContactPriority, number>
    );

    byPriority.forEach((item) => {
      if (item._id) {
        priorityCounts[item._id as ContactPriority] = item.count;
      }
    });

    return {
      total,
      byStatus: statusCounts,
      byPriority: priorityCounts,
      todayCount,
      weekCount,
      monthCount,
    };
  }

  /**
   * Build MongoDB query from filters
   */
  private buildFilterQuery(filters: IContactFilters): Document {
    const query: Document = {};

    if (filters.status) {
      if (Array.isArray(filters.status)) {
        query.status = { $in: filters.status };
      } else {
        query.status = filters.status;
      }
    }

    if (filters.priority) {
      if (Array.isArray(filters.priority)) {
        query.priority = { $in: filters.priority };
      } else {
        query.priority = filters.priority;
      }
    }

    if (filters.search) {
      query.$or = [
        { firstName: { $regex: filters.search, $options: 'i' } },
        { lastName: { $regex: filters.search, $options: 'i' } },
        { email: { $regex: filters.search, $options: 'i' } },
        { message: { $regex: filters.search, $options: 'i' } },
      ];
    }

    if (filters.startDate || filters.endDate) {
      query.createdAt = {};
      if (filters.startDate) {
        query.createdAt.$gte = filters.startDate;
      }
      if (filters.endDate) {
        query.createdAt.$lte = filters.endDate;
      }
    }

    if (filters.assignedTo) {
      query.assignedTo = filters.assignedTo;
    }

    if (filters.tags && filters.tags.length > 0) {
      query.tags = { $in: filters.tags };
    }

    return query;
  }

  /**
   * Create indexes for better performance
   */
  async createIndexes(): Promise<void> {
    const collection = await this.getCollection();
    await collection.createIndexes([
      { key: { email: 1 } },
      { key: { status: 1 } },
      { key: { priority: 1 } },
      { key: { createdAt: -1 } },
      { key: { updatedAt: -1 } },
      { key: { assignedTo: 1 } },
      { key: { tags: 1 } },
      // Text index for search
      {
        key: {
          firstName: 'text',
          lastName: 'text',
          email: 'text',
          message: 'text',
        },
      },
    ]);
  }
}

export const contactRepository = new ContactRepository();
