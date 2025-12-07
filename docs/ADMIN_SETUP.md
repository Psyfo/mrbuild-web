# Mr Build Admin Portal Setup Guide

## Overview

The Mr Build website now includes a secure admin portal where authorized users can manage website content, brands, promotions, and other settings.

## Features

- 🔐 Secure authentication with NextAuth.js
- 📊 Admin dashboard with quick stats
- 🎨 Modern UI with shadcn/ui components
- 🛡️ Route protection with middleware
- 💾 MongoDB integration for data persistence

## Initial Setup

### 1. Environment Variables

Make sure your `.env.local` file contains the following variables:

```env
# MongoDB Configuration
MONGODB_URI=your_mongodb_connection_string

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-change-this-in-production

# Admin Setup (for creating initial admin user)
ADMIN_SETUP_SECRET=setup-secret-key-change-this
```

**Important:**

- Change `NEXTAUTH_SECRET` to a secure random string (you can generate one using `openssl rand -base64 32`)
- Change `ADMIN_SETUP_SECRET` to a secure random string
- For production, update `NEXTAUTH_URL` to your production domain

### 2. Create Initial Admin User

1. Start the development server:

   ```bash
   npm run dev
   ```

2. Navigate to: `http://localhost:3000/setup`

3. Fill in the form:

   - **Full Name**: Your name
   - **Email**: Your admin email
   - **Password**: Choose a strong password (minimum 8 characters)
   - **Confirm Password**: Re-enter your password
   - **Setup Secret**: Enter the value from `ADMIN_SETUP_SECRET` in your `.env.local`

4. Click "Create Admin Account"

5. Once successful, you can log in at `/login`

### 3. Access the Admin Portal

1. Go to: `http://localhost:3000/admin`
2. You'll be automatically redirected to the login page if not authenticated
3. Enter your credentials created in step 2
4. You'll be redirected to the admin dashboard

## Routes

- `/admin` - Admin dashboard (protected)
- `/login` - Admin login page
- `/setup` - Initial admin setup (should be disabled in production)

## Route Protection

The `/admin` route and all sub-routes are protected by middleware. Unauthenticated users are automatically redirected to `/login`.

## Database Structure

### Collections

#### `admins`

Stores admin user credentials:

```javascript
{
  _id: ObjectId,
  email: String,
  password: String (bcrypt hashed),
  name: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Security Best Practices

1. **Delete or Protect the Setup Route**: After creating your admin account, either:

   - Delete the `/src/app/(auth)/setup` folder, or
   - Add authentication to protect it

2. **Use Strong Secrets**: Generate secure random strings for `NEXTAUTH_SECRET` and `ADMIN_SETUP_SECRET`

3. **HTTPS in Production**: Always use HTTPS in production environments

4. **Regular Password Updates**: Change admin passwords regularly

5. **Limit Admin Accounts**: Only create admin accounts for trusted users

## Troubleshooting

### Can't Login

- Verify MongoDB connection is working
- Check that the admin user was created successfully in the database
- Verify email and password are correct
- Check browser console for errors

### Redirected to Login Constantly

- Clear browser cookies
- Check that `NEXTAUTH_URL` matches your current URL
- Verify `NEXTAUTH_SECRET` is set correctly

### Setup Page Returns 401

- Verify `ADMIN_SETUP_SECRET` matches the value in your `.env.local`
- Check that you're using the correct secret value

## Next Steps

The admin dashboard is set up with placeholder cards for:

- Content Management
- Brand Management
- Contact Messages
- Branch Locations
- SEO Settings
- Site Settings

You can now build out these features by creating the appropriate pages and API routes.

## Production Deployment

Before deploying to production:

1. Update `NEXTAUTH_URL` in production environment variables
2. Generate new secure secrets for production
3. Disable or protect the `/setup` route
4. Enable HTTPS
5. Set up proper MongoDB indexes for performance
6. Consider adding rate limiting to prevent brute force attacks
7. Set up monitoring and logging

## Support

For issues or questions, contact the development team.
