/**
 * Contact Types and Interfaces
 * Defines the structure for contact messages throughout the application
 */

export enum ContactStatus {
  NEW = 'new',
  READ = 'read',
  REPLIED = 'replied',
  ARCHIVED = 'archived',
  SPAM = 'spam',
}

export enum ContactPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export interface IContact {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  message: string;
  status: ContactStatus;
  priority: ContactPriority;
  notes?: string;
  assignedTo?: string;
  tags?: string[];
  ipAddress?: string;
  userAgent?: string;
  source?: string; // 'website', 'promotion', etc.
  createdAt: Date;
  updatedAt: Date;
  readAt?: Date;
  repliedAt?: Date;
  archivedAt?: Date;
}

export interface IContactFilters {
  status?: ContactStatus | ContactStatus[];
  priority?: ContactPriority | ContactPriority[];
  search?: string; // Search in firstName, lastName, email, message
  startDate?: Date;
  endDate?: Date;
  assignedTo?: string;
  tags?: string[];
}

export interface IContactListResponse {
  contacts: IContact[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface IContactStats {
  total: number;
  new: number;
  read: number;
  replied: number;
  archived: number;
  spam: number;
  todayCount: number;
  weekCount: number;
  monthCount: number;
  averageResponseTime?: number; // in hours
}

export interface IContactUpdatePayload {
  status?: ContactStatus;
  priority?: ContactPriority;
  notes?: string;
  assignedTo?: string;
  tags?: string[];
}
