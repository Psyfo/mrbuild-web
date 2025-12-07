/**
 * Contact Service
 * Business logic layer for contact management
 * Handles validation, notifications, and orchestrates repository operations
 */

import { contactRepository } from '@/lib/repositories/contact.repository';
import {
  IContact,
  ContactStatus,
  ContactPriority,
  IContactFilters,
  IContactListResponse,
  IContactStats,
  IContactUpdatePayload,
} from '@/types/contact';
import nodemailer from 'nodemailer';

export class ContactService {
  /**
   * Create a new contact and send notifications
   */
  async createContact(data: {
    firstName: string;
    lastName: string;
    email: string;
    message: string;
    ipAddress?: string;
    userAgent?: string;
    source?: string;
  }): Promise<IContact> {
    // Create contact in database
    const contact = await contactRepository.create({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      message: data.message,
      status: ContactStatus.NEW,
      priority: this.determinePriority(data.message),
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
      source: data.source || 'website',
      tags: this.extractTags(data.message),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Send email notifications (don't block on this)
    this.sendEmailNotifications(contact).catch((error) => {
      console.error('Failed to send email notifications:', error);
    });

    return contact;
  }

  /**
   * Get paginated list of contacts
   */
  async getContacts(
    filters: IContactFilters = {},
    page: number = 1,
    pageSize: number = 20,
    sortBy: string = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc'
  ): Promise<IContactListResponse> {
    const { contacts, total } = await contactRepository.findAll(
      filters,
      page,
      pageSize,
      sortBy,
      sortOrder
    );

    const totalPages = Math.ceil(total / pageSize);

    return {
      contacts,
      total,
      page,
      pageSize,
      totalPages,
    };
  }

  /**
   * Get contact by ID
   */
  async getContactById(id: string): Promise<IContact | null> {
    return contactRepository.findById(id);
  }

  /**
   * Update contact
   */
  async updateContact(
    id: string,
    updates: IContactUpdatePayload
  ): Promise<IContact | null> {
    const updateData: Partial<IContact> = { ...updates };

    // Automatically set readAt if status changed to READ or REPLIED
    // (Replying implies reading)
    if (
      updates.status === ContactStatus.READ ||
      updates.status === ContactStatus.REPLIED
    ) {
      const contact = await contactRepository.findById(id);
      if (contact && !contact.readAt) {
        updateData.readAt = new Date();
      }
    }

    // Automatically set repliedAt if status changed to REPLIED
    if (updates.status === ContactStatus.REPLIED) {
      const contact = await contactRepository.findById(id);
      if (contact && !contact.repliedAt) {
        updateData.repliedAt = new Date();
      }
    }

    // Automatically set archivedAt if status changed to ARCHIVED
    if (updates.status === ContactStatus.ARCHIVED) {
      const contact = await contactRepository.findById(id);
      if (contact && !contact.archivedAt) {
        updateData.archivedAt = new Date();
      }
    }

    return contactRepository.update(id, updateData);
  }

  /**
   * Delete contact
   */
  async deleteContact(id: string): Promise<boolean> {
    return contactRepository.delete(id);
  }

  /**
   * Bulk update contacts
   */
  async bulkUpdateContacts(
    ids: string[],
    updates: IContactUpdatePayload
  ): Promise<number> {
    const updateData: Partial<IContact> = { ...updates };

    // Automatically set readAt if status changed to READ or REPLIED
    if (
      updates.status === ContactStatus.READ ||
      updates.status === ContactStatus.REPLIED
    ) {
      updateData.readAt = new Date();
    }
    if (updates.status === ContactStatus.REPLIED) {
      updateData.repliedAt = new Date();
    }
    if (updates.status === ContactStatus.ARCHIVED) {
      updateData.archivedAt = new Date();
    }

    return contactRepository.bulkUpdate(ids, updateData);
  }

  /**
   * Bulk delete contacts
   */
  async bulkDeleteContacts(ids: string[]): Promise<number> {
    return contactRepository.bulkDelete(ids);
  }

  /**
   * Get contact statistics
   */
  async getContactStats(): Promise<IContactStats> {
    const stats = await contactRepository.getStats();

    return {
      total: stats.total,
      new: stats.byStatus[ContactStatus.NEW],
      read: stats.byStatus[ContactStatus.READ],
      replied: stats.byStatus[ContactStatus.REPLIED],
      archived: stats.byStatus[ContactStatus.ARCHIVED],
      spam: stats.byStatus[ContactStatus.SPAM],
      todayCount: stats.todayCount,
      weekCount: stats.weekCount,
      monthCount: stats.monthCount,
    };
  }

  /**
   * Mark contact as read
   */
  async markAsRead(id: string): Promise<IContact | null> {
    return this.updateContact(id, { status: ContactStatus.READ });
  }

  /**
   * Mark contact as replied
   */
  async markAsReplied(id: string): Promise<IContact | null> {
    return this.updateContact(id, { status: ContactStatus.REPLIED });
  }

  /**
   * Archive contact
   */
  async archiveContact(id: string): Promise<IContact | null> {
    return this.updateContact(id, { status: ContactStatus.ARCHIVED });
  }

  /**
   * Mark contact as spam
   */
  async markAsSpam(id: string): Promise<IContact | null> {
    return this.updateContact(id, { status: ContactStatus.SPAM });
  }

  /**
   * Determine priority based on message content
   */
  private determinePriority(message: string): ContactPriority {
    const urgentKeywords = [
      'urgent',
      'emergency',
      'asap',
      'immediately',
      'critical',
    ];
    const highKeywords = ['important', 'priority', 'soon', 'quickly'];

    const lowerMessage = message.toLowerCase();

    if (urgentKeywords.some((keyword) => lowerMessage.includes(keyword))) {
      return ContactPriority.URGENT;
    }

    if (highKeywords.some((keyword) => lowerMessage.includes(keyword))) {
      return ContactPriority.HIGH;
    }

    return ContactPriority.MEDIUM;
  }

  /**
   * Extract relevant tags from message
   */
  private extractTags(message: string): string[] {
    const tags: string[] = [];
    const lowerMessage = message.toLowerCase();

    const tagKeywords = {
      quote: ['quote', 'quotation', 'estimate', 'pricing'],
      support: ['help', 'support', 'issue', 'problem'],
      inquiry: ['question', 'ask', 'wondering', 'inquiry'],
      complaint: ['complaint', 'unhappy', 'disappointed', 'terrible'],
      feedback: ['feedback', 'suggestion', 'recommend'],
    };

    Object.entries(tagKeywords).forEach(([tag, keywords]) => {
      if (keywords.some((keyword) => lowerMessage.includes(keyword))) {
        tags.push(tag);
      }
    });

    return tags;
  }

  /**
   * Send email notifications
   */
  private async sendEmailNotifications(contact: IContact): Promise<void> {
    if (!process.env.MAIL_HOST || !process.env.MAIL_USER) {
      console.warn('Email configuration missing, skipping notifications');
      return;
    }

    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: parseInt(process.env.MAIL_PORT ?? '465', 10),
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    // Send notification to admin
    const adminMailOptions = {
      from: `"Contact Form" <${process.env.MAIL_USER}>`,
      to: process.env.MAIL_TO,
      replyTo: contact.email,
      subject: `[${contact.priority.toUpperCase()}] New Contact Form Submission`,
      text: `You have a new message from ${contact.firstName} ${
        contact.lastName
      } (${contact.email}):\n\nPriority: ${contact.priority}\nTags: ${
        contact.tags?.join(', ') || 'None'
      }\n\n${contact.message}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New Contact Message</h2>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>From:</strong> ${contact.firstName} ${
        contact.lastName
      }</p>
            <p><strong>Email:</strong> <a href="mailto:${contact.email}">${
        contact.email
      }</a></p>
            <p><strong>Priority:</strong> <span style="background: ${this.getPriorityColor(
              contact.priority
            )}; color: white; padding: 3px 8px; border-radius: 3px;">${contact.priority.toUpperCase()}</span></p>
            ${
              contact.tags && contact.tags.length > 0
                ? `<p><strong>Tags:</strong> ${contact.tags.join(', ')}</p>`
                : ''
            }
          </div>
          <div style="background: white; padding: 15px; border: 1px solid #ddd; border-radius: 5px;">
            <h3 style="margin-top: 0;">Message:</h3>
            <p style="white-space: pre-wrap;">${contact.message}</p>
          </div>
        </div>
      `,
    };

    // Send confirmation to user
    const confirmationMailOptions = {
      from: `"MrBuild" <${process.env.MAIL_USER}>`,
      to: contact.email,
      subject: 'Thanks for reaching out to us!',
      text: `Hi ${contact.firstName},\n\nThank you for your message. We've received it and will get back to you as soon as possible.\n\n— The MrBuild Team`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Thank You for Contacting Us!</h2>
          <p>Hi <strong>${contact.firstName}</strong>,</p>
          <p>Thank you for reaching out. We've received your message and will be in touch shortly.</p>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0; color: #666;">Our team typically responds within 24-48 hours during business days.</p>
          </div>
          <p>— The <strong>MrBuild</strong> Team</p>
        </div>
      `,
    };

    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(confirmationMailOptions),
    ]);
  }

  /**
   * Get priority color for email styling
   */
  private getPriorityColor(priority: ContactPriority): string {
    const colors = {
      [ContactPriority.LOW]: '#10b981',
      [ContactPriority.MEDIUM]: '#3b82f6',
      [ContactPriority.HIGH]: '#f59e0b',
      [ContactPriority.URGENT]: '#ef4444',
    };
    return colors[priority];
  }
}

export const contactService = new ContactService();
