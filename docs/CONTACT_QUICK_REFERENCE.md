# Contact Management - Quick Reference

## Quick Start

### Access Contact Management

1. Log in to admin portal: `/login`
2. Navigate to `/admin/contacts`
3. Or click "Contact Messages" from dashboard

## Common Tasks

### View New Contacts

- Filter by Status: "New"
- New contacts are highlighted in blue
- Priority indicated by color (Red = Urgent, Orange = High, Blue = Medium, Green = Low)

### Respond to Contact

1. Click on contact row or "•••" menu
2. Click "View Details"
3. Click "Reply via Email" button
4. Click "Mark as Replied" after sending

### Search Contacts

- Type in search box (searches name, email, message)
- Results update automatically
- Use filters for status/priority

### Bulk Operations

1. Select contacts using checkboxes
2. Click "Bulk Actions"
3. Choose action:
   - Mark as Read
   - Mark as Replied
   - Archive
   - Mark as Spam
   - Delete Selected

### Delete Contact

- Single: Click "•••" → Delete
- Multiple: Select → Bulk Actions → Delete Selected

## Status Workflow

```
NEW (auto) → READ (manual) → REPLIED (manual) → ARCHIVED (manual)
                    ↓
                  SPAM (manual)
```

## Priority Levels

Auto-detected from message content:

- 🔴 **URGENT**: "urgent", "emergency", "asap", "immediately"
- 🟠 **HIGH**: "important", "priority", "soon"
- 🔵 **MEDIUM**: Default
- 🟢 **LOW**: Set manually if needed

## Auto-Tags

Automatically applied based on message:

- **quote**: Quote/pricing requests
- **support**: Help/support requests
- **inquiry**: General questions
- **complaint**: Complaints
- **feedback**: Feedback/suggestions

## API Endpoints (for developers)

```javascript
// Get contacts
GET /api/admin/contacts?page=1&status=new&search=urgent

// Update contact
PATCH /api/admin/contacts/[id]
Body: { status: 'replied', priority: 'high' }

// Bulk update
PATCH /api/admin/contacts
Body: { ids: [...], updates: { status: 'archived' } }

// Get stats
GET /api/admin/contacts/stats
```

## Keyboard Shortcuts (Future)

- `Ctrl/Cmd + K`: Focus search
- `A`: Select all
- `R`: Mark as read
- `Delete`: Delete selected

## Best Practices

1. ✅ **Respond within 24-48 hours**
2. ✅ **Mark as 'Replied' after responding**
3. ✅ **Archive old conversations**
4. ✅ **Use search to find duplicate inquiries**
5. ✅ **Review spam folder weekly**
6. ✅ **Check 'New' filter daily**

## Troubleshooting

**Contacts not loading?**

- Refresh the page
- Check your internet connection
- Verify you're logged in

**Can't mark as replied?**

- Ensure you're logged in
- Try refreshing the page
- Contact tech support

**Email not working?**

- Ensure email client is configured
- Try copying email address manually

## Statistics Dashboard

- **Total**: All contacts in system
- **New**: Unread contacts
- **Read**: Read but not replied
- **Replied**: Contacts you've responded to
- **This Week**: Contacts from last 7 days

## Pro Tips

💡 **Tip 1**: Use search to find contacts by email or keywords from their message

💡 **Tip 2**: Filter by priority to handle urgent matters first

💡 **Tip 3**: Bulk archive old replied contacts monthly

💡 **Tip 4**: Check auto-tags to understand customer intent quickly

💡 **Tip 5**: Use the detail modal to see full message and metadata

## Support

For technical issues or feature requests, contact the development team.
