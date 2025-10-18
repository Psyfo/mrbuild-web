# 🎯 Contact Management System - Setup Guide

## Quick Setup (5 minutes)

### Step 1: Environment Variables

Add these to your `.env.local`:

```bash
# MongoDB (should already be configured)
MONGODB_URI=your_mongodb_connection_string

# Email Configuration (SMTP)
MAIL_HOST=smtp.gmail.com          # or your SMTP host
MAIL_PORT=465                      # or 587 for TLS
MAIL_USER=your-email@gmail.com
MAIL_PASS=your-app-password       # App password, not regular password
MAIL_TO=admin@yourdomain.com      # Where to receive contact notifications
```

### Step 2: Start the Application

```bash
npm run dev
```

The system is now ready! No database initialization needed - indexes are created automatically.

### Step 3: Access Admin Panel

1. Login at `http://localhost:3000/login`
2. Go to `http://localhost:3000/admin/contacts`

### Step 4: Test It

1. Submit a test contact form on your website
2. Check the admin panel - you should see the new contact
3. Check your email - you should receive a notification
4. Check the test email inbox - they should receive a confirmation

## 📧 Email Setup Guide

### Using Gmail

1. Enable 2-Factor Authentication on your Google account
2. Generate an App Password:
   - Go to Google Account → Security → 2-Step Verification → App passwords
   - Create a new app password for "Mail"
   - Copy the 16-character password
3. Use these settings:
   ```bash
   MAIL_HOST=smtp.gmail.com
   MAIL_PORT=465
   MAIL_USER=your-email@gmail.com
   MAIL_PASS=your-16-char-app-password
   ```

### Using Other Email Providers

#### Microsoft/Outlook

```bash
MAIL_HOST=smtp-mail.outlook.com
MAIL_PORT=587
```

#### SendGrid

```bash
MAIL_HOST=smtp.sendgrid.net
MAIL_PORT=587
MAIL_USER=apikey
MAIL_PASS=your-sendgrid-api-key
```

#### Mailgun

```bash
MAIL_HOST=smtp.mailgun.org
MAIL_PORT=587
```

## 📚 Documentation

- **[Full Documentation](./CONTACT_MANAGEMENT.md)** - Complete technical reference
- **[Quick Reference](./CONTACT_QUICK_REFERENCE.md)** - Common tasks and shortcuts
- **[Implementation Summary](./CONTACT_IMPLEMENTATION_SUMMARY.md)** - What was built

## ✨ Features Overview

### What You Get

✅ **Contact Form Integration** - Saves all submissions to database  
✅ **Email Notifications** - Admin alert + customer confirmation  
✅ **Smart Categorization** - Auto-priority and auto-tags  
✅ **Admin Dashboard** - Full management interface  
✅ **Search & Filter** - Find contacts easily  
✅ **Bulk Operations** - Update/delete multiple at once  
✅ **Statistics** - Track contact metrics

### Auto-Features

The system automatically:

- Detects priority from message content (urgent, high, medium, low)
- Categorizes messages with tags (quote, support, inquiry, etc.)
- Sends email notifications
- Tracks timestamps (created, read, replied, archived)
- Creates database indexes for performance

## 🎯 Quick Tasks

### View New Contacts

1. Login to admin
2. Go to Contact Messages
3. Filter by Status: "New"

### Respond to Contact

1. Click on contact
2. Click "Reply via Email"
3. Send your response
4. Click "Mark as Replied"

### Bulk Archive Old Contacts

1. Select multiple contacts
2. Click "Bulk Actions"
3. Choose "Archive"

## 🔧 Troubleshooting

### Contacts Not Saving

- ✅ Check MongoDB connection in `.env.local`
- ✅ Verify `MONGODB_URI` is correct
- ✅ Check server logs for errors

### Emails Not Sending

- ✅ Verify SMTP credentials in `.env.local`
- ✅ Test with: `telnet smtp.gmail.com 465`
- ✅ Check spam folder
- ✅ Enable "Less secure apps" or use App Password

### Can't Access Admin Panel

- ✅ Make sure you're logged in
- ✅ Check NextAuth configuration
- ✅ Clear browser cache and cookies

### Search Not Working

- ✅ Database indexes should be created automatically
- ✅ Try restarting the dev server
- ✅ Check MongoDB connection

## 📊 Database Structure

The system creates a `contacts` collection in MongoDB with these fields:

```javascript
{
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  message: "I need a quote...",
  status: "new",              // new | read | replied | archived | spam
  priority: "high",           // low | medium | high | urgent
  tags: ["quote"],            // Auto-generated
  ipAddress: "192.168.1.1",
  userAgent: "Mozilla/5.0...",
  createdAt: Date,
  updatedAt: Date
}
```

## 🚀 Next Steps

1. **Test the system** - Submit a few test contacts
2. **Configure email** - Set up your SMTP credentials
3. **Customize** - Adjust auto-tag keywords if needed
4. **Train your team** - Share the Quick Reference guide
5. **Monitor** - Check the statistics dashboard regularly

## 💡 Tips

- Check "New" contacts daily
- Use search to find specific inquiries
- Archive old contacts monthly
- Review spam folder weekly
- Respond within 24-48 hours

## 🆘 Support

For issues or questions:

1. Check the **[Full Documentation](./CONTACT_MANAGEMENT.md)**
2. Review **[Troubleshooting](#🔧-troubleshooting)** section
3. Contact your development team

## 🎉 You're All Set!

The contact management system is ready to use. Start by testing the contact form and checking the admin panel!

---

**Quick Links:**

- Admin Panel: `/admin/contacts`
- Full Docs: `./CONTACT_MANAGEMENT.md`
- Quick Reference: `./CONTACT_QUICK_REFERENCE.md`
