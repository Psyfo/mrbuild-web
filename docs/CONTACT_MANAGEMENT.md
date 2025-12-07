# Contact Management System Documentation

## Overview

The Contact Management System provides a comprehensive solution for handling customer inquiries submitted through the website's contact form. It follows a modular, service-oriented architecture with clear separation of concerns.

## Architecture

### Layer Structure

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│   (React Components, Admin UI)          │
└───────────────┬─────────────────────────┘
                │
┌───────────────▼─────────────────────────┐
│            API Layer                    │
│   (Next.js API Routes)                  │
└───────────────┬─────────────────────────┘
                │
┌───────────────▼─────────────────────────┐
│         Service Layer                   │
│   (Business Logic, Validation)          │
└───────────────┬─────────────────────────┘
                │
┌───────────────▼─────────────────────────┐
│        Repository Layer                 │
│   (Database Operations)                 │
└───────────────┬─────────────────────────┘
                │
┌───────────────▼─────────────────────────┐
│         Data Layer                      │
│   (MongoDB)                             │
└─────────────────────────────────────────┘
```

## Core Components

### 1. Types (`src/types/contact.ts`)

Defines TypeScript interfaces and enums for type safety:

- **ContactStatus**: Enum for contact states (NEW, READ, REPLIED, ARCHIVED, SPAM)
- **ContactPriority**: Enum for priority levels (LOW, MEDIUM, HIGH, URGENT)
- **IContact**: Main contact interface with all fields
- **IContactFilters**: Filter options for querying contacts
- **IContactStats**: Statistics interface
- **IContactUpdatePayload**: Update operation interface

### 2. Repository Layer (`src/lib/repositories/contact.repository.ts`)

Handles all database operations following the Repository pattern:

**Key Methods:**

- `create(contact)` - Create new contact
- `findById(id)` - Get contact by ID
- `findAll(filters, page, pageSize, sortBy, sortOrder)` - Get paginated contacts with filters
- `update(id, updates)` - Update contact
- `delete(id)` - Delete contact
- `bulkUpdate(ids, updates)` - Bulk update multiple contacts
- `bulkDelete(ids)` - Bulk delete multiple contacts
- `getStats()` - Get contact statistics
- `createIndexes()` - Create database indexes for performance

**Features:**

- Dynamic query building based on filters
- Text search across multiple fields
- Date range filtering
- Tag-based filtering
- Automatic indexing for performance

### 3. Service Layer (`src/lib/services/contact.service.ts`)

Contains business logic and orchestrates repository operations:

**Key Methods:**

- `createContact(data)` - Create contact with auto-tagging and priority detection
- `getContacts(filters, page, pageSize, sortBy, sortOrder)` - Get contacts with pagination
- `getContactById(id)` - Get single contact
- `updateContact(id, updates)` - Update with automatic timestamp tracking
- `bulkUpdateContacts(ids, updates)` - Bulk update
- `bulkDeleteContacts(ids)` - Bulk delete
- `getContactStats()` - Get statistics
- `markAsRead(id)` - Quick status update
- `markAsReplied(id)` - Quick status update
- `archiveContact(id)` - Quick status update
- `markAsSpam(id)` - Quick status update

**Smart Features:**

- **Auto-Priority Detection**: Analyzes message content for urgency keywords
- **Auto-Tagging**: Extracts relevant tags from message content
- **Email Notifications**: Sends admin notification and user confirmation
- **Automatic Timestamps**: Tracks readAt, repliedAt, archivedAt

### 4. API Routes

#### `/api/contact` - Public Contact Form Submission

- **POST**: Submit new contact message
- Captures IP address and user agent
- Calls contactService.createContact()
- Returns success/error response

#### `/api/admin/contacts` - Contact List Management

- **GET**: Fetch paginated contacts with filters
  - Query params: page, pageSize, sortBy, sortOrder, status, priority, search, startDate, endDate
- **PATCH**: Bulk update contacts
  - Body: `{ ids: string[], updates: Partial<IContact> }`
- **DELETE**: Bulk delete contacts
  - Body: `{ ids: string[] }`

#### `/api/admin/contacts/[id]` - Single Contact Operations

- **GET**: Get contact by ID
- **PATCH**: Update contact
  - Body: `Partial<IContact>`
- **DELETE**: Delete contact

#### `/api/admin/contacts/stats` - Statistics

- **GET**: Get contact statistics

All admin routes require authentication via NextAuth.

### 5. Admin UI (`src/app/(admin)/admin/contacts/page.tsx`)

Full-featured contact management interface:

**Features:**

- Statistics dashboard with key metrics
- Real-time search across all fields
- Filter by status and priority
- Sortable, paginated table
- Bulk selection and operations
- Individual contact actions
- Detailed contact modal view
- Direct email reply integration

**Bulk Actions:**

- Mark as Read
- Mark as Replied
- Archive
- Mark as Spam
- Delete

**Visual Indicators:**

- New contacts highlighted in blue
- Color-coded priority levels
- Status badges
- Auto-generated tags

## Database Schema

### Collection: `contacts`

```javascript
{
  _id: ObjectId,
  firstName: String,
  lastName: String,
  email: String,
  message: String,
  status: String, // Enum: 'new', 'read', 'replied', 'archived', 'spam'
  priority: String, // Enum: 'low', 'medium', 'high', 'urgent'
  notes: String, // Optional admin notes
  assignedTo: String, // Optional admin assignment
  tags: [String], // Auto-generated and manual tags
  ipAddress: String,
  userAgent: String,
  source: String, // 'website', 'promotion', etc.
  createdAt: Date,
  updatedAt: Date,
  readAt: Date, // Optional
  repliedAt: Date, // Optional
  archivedAt: Date // Optional
}
```

### Indexes

- `email` - Single field
- `status` - Single field
- `priority` - Single field
- `createdAt` - Descending
- `updatedAt` - Descending
- `assignedTo` - Single field
- `tags` - Single field
- Text index on: `firstName`, `lastName`, `email`, `message`

## Features

### Auto-Priority Detection

Analyzes message content for keywords:

- **URGENT**: "urgent", "emergency", "asap", "immediately", "critical"
- **HIGH**: "important", "priority", "soon", "quickly"
- **MEDIUM**: Default for other messages

### Auto-Tagging

Automatically tags messages based on content:

- **quote**: "quote", "quotation", "estimate", "pricing"
- **support**: "help", "support", "issue", "problem"
- **inquiry**: "question", "ask", "wondering", "inquiry"
- **complaint**: "complaint", "unhappy", "disappointed", "terrible"
- **feedback**: "feedback", "suggestion", "recommend"

### Email Notifications

When a contact is created:

1. **Admin Notification**:

   - Includes priority badge
   - Auto-generated tags
   - Full message content
   - Reply-to set to customer email

2. **Customer Confirmation**:
   - Professional thank you message
   - Sets expectations for response time

### Status Tracking

Automatic timestamp tracking:

- When status changes to READ → sets `readAt`
- When status changes to REPLIED → sets `repliedAt`
- When status changes to ARCHIVED → sets `archivedAt`

## Usage Examples

### Creating a Contact (Frontend)

```typescript
const response = await fetch('/api/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    message: 'I need an urgent quote for materials',
  }),
});
```

### Fetching Contacts with Filters (Admin)

```typescript
const params = new URLSearchParams({
  page: '1',
  pageSize: '20',
  sortBy: 'createdAt',
  sortOrder: 'desc',
  status: 'new',
  priority: 'urgent',
  search: 'quote',
});

const response = await fetch(`/api/admin/contacts?${params}`);
const data = await response.json();
```

### Bulk Update Contacts

```typescript
const response = await fetch('/api/admin/contacts', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    ids: ['id1', 'id2', 'id3'],
    updates: { status: 'read' },
  }),
});
```

### Get Statistics

```typescript
const response = await fetch('/api/admin/contacts/stats');
const stats = await response.json();
// Returns: { total, new, read, replied, archived, spam, todayCount, weekCount, monthCount }
```

## Security

- All admin routes protected by NextAuth session
- Input validation on all API endpoints
- XSS protection through React's built-in escaping
- Rate limiting recommended for contact form (not implemented)
- IP tracking for spam detection

## Performance Optimizations

- Database indexes on frequently queried fields
- Text search index for full-text search
- Pagination to limit data transfer
- Debounced search to reduce API calls
- Efficient bulk operations

## Best Practices

1. **Always use the service layer** - Don't call repository directly from API routes
2. **Validate input** - Check required fields and data types
3. **Handle errors gracefully** - Return appropriate HTTP status codes
4. **Use transactions** - For operations affecting multiple contacts (future enhancement)
5. **Monitor email sending** - Log failures for debugging
6. **Regular cleanup** - Archive or delete old spam contacts
7. **Backup database** - Regular MongoDB backups

## Future Enhancements

Potential improvements:

1. **Email Templates**: Rich HTML templates for notifications
2. **Assignment System**: Assign contacts to specific admin users
3. **Custom Tags**: Allow admins to add custom tags
4. **Response Templates**: Quick reply templates
5. **Internal Notes**: Add private notes visible only to admins
6. **Attachments**: Support file uploads in contact form
7. **Integration**: Integrate with CRM systems
8. **Analytics**: Advanced reporting and analytics dashboard
9. **Notifications**: Real-time notifications for new contacts
10. **Export**: Export contacts to CSV/Excel
11. **Rate Limiting**: Prevent spam submissions
12. **CAPTCHA**: Add reCAPTCHA to contact form

## Troubleshooting

### Contacts not saving

- Check MongoDB connection string in `.env`
- Verify database name in `getDatabase()` function
- Check server logs for errors

### Email not sending

- Verify email credentials in `.env`
- Check SMTP host and port settings
- Ensure firewall allows SMTP traffic
- Check spam folder

### Search not working

- Ensure text indexes are created
- Run `contactRepository.createIndexes()` manually
- Check search query syntax

### Performance issues

- Create database indexes
- Implement pagination properly
- Add caching layer (Redis)
- Optimize MongoDB queries

## Environment Variables

Required in `.env.local`:

```bash
# MongoDB
MONGODB_URI=mongodb+srv://...

# Email (SMTP)
MAIL_HOST=smtp.example.com
MAIL_PORT=465
MAIL_USER=your-email@example.com
MAIL_PASS=your-password
MAIL_TO=admin@example.com
```

## Testing

Recommended test scenarios:

1. Submit contact form with various message types
2. Test priority detection with urgent keywords
3. Test auto-tagging with different message content
4. Verify email notifications sent correctly
5. Test bulk operations with large selections
6. Test pagination and filtering
7. Test search functionality
8. Verify authentication on admin routes

## Maintenance

Regular maintenance tasks:

1. **Weekly**: Review new contacts and respond
2. **Monthly**: Archive old replied contacts
3. **Quarterly**: Delete old spam contacts
4. **Annually**: Review and update auto-tag keywords

## API Reference Summary

| Endpoint                    | Method | Auth Required | Description         |
| --------------------------- | ------ | ------------- | ------------------- |
| `/api/contact`              | POST   | No            | Submit contact form |
| `/api/admin/contacts`       | GET    | Yes           | List contacts       |
| `/api/admin/contacts`       | PATCH  | Yes           | Bulk update         |
| `/api/admin/contacts`       | DELETE | Yes           | Bulk delete         |
| `/api/admin/contacts/[id]`  | GET    | Yes           | Get single contact  |
| `/api/admin/contacts/[id]`  | PATCH  | Yes           | Update contact      |
| `/api/admin/contacts/[id]`  | DELETE | Yes           | Delete contact      |
| `/api/admin/contacts/stats` | GET    | Yes           | Get statistics      |

## Conclusion

This contact management system provides a robust, scalable solution for handling customer inquiries. The modular architecture ensures maintainability, while smart features like auto-tagging and priority detection improve efficiency. The comprehensive admin interface makes it easy to manage and respond to contacts effectively.
