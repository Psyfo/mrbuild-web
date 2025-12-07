# Quick Start Guide - Admin Portal

## 🚀 Getting Started

Your admin portal is now set up! Follow these steps to start managing your Mr Build website:

### Step 1: Create Your Admin Account

1. Make sure the development server is running:

   ```bash
   npm run dev
   ```

2. Open your browser and go to: **http://localhost:3000/setup**

3. Fill in the setup form:

   - **Full Name**: Your full name
   - **Email**: Your admin email address
   - **Password**: Choose a strong password (min. 8 characters)
   - **Confirm Password**: Re-enter your password
   - **Setup Secret**: Use this value → `YOUYvgJ/zgf4nc5sS71zRsC4HYw1u7ZFe8fSnIM8h9I=`

4. Click "Create Admin Account"

### Step 2: Login to Admin Portal

1. Once your account is created, go to: **http://localhost:3000/admin**
2. You'll be redirected to the login page
3. Enter your email and password
4. Click "Sign In"

### Step 3: Explore the Dashboard

You'll see the admin dashboard with several management sections:

- **Content Management** - Edit homepage content
- **Brand Management** - Manage brand logos and info
- **Contact Messages** - View customer inquiries
- **Branch Locations** - Update branch information
- **SEO Settings** - Optimize search visibility
- **Site Settings** - General configuration

## 🔒 Security Notes

- Keep your admin credentials secure
- Don't share the setup secret with others
- After creating your admin account, consider removing the `/setup` page in production
- The NEXTAUTH_SECRET and ADMIN_SETUP_SECRET are already configured with secure values

## 📝 What's Been Configured

✅ NextAuth.js authentication
✅ MongoDB connection for admin users
✅ Protected admin routes with middleware
✅ Modern UI with shadcn/ui components
✅ Secure password hashing with bcrypt
✅ Session management
✅ Route guards and redirects

## 🎯 Next Steps

The dashboard cards are placeholders. You can now:

1. Create API routes for each management section
2. Build out the individual admin pages
3. Connect to your MongoDB collections for content
4. Add more admin users if needed

## Need Help?

Refer to `ADMIN_SETUP.md` for detailed documentation and troubleshooting.

---

**Important:** When deploying to production, remember to:

- Update `NEXTAUTH_URL` in your production environment
- Generate new secrets for production
- Use HTTPS
- Disable or protect the `/setup` route
