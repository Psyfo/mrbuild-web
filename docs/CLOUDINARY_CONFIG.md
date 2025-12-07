# Cloudinary Configuration - Mr Build

## 🔧 Configuration

### Next.js Image Configuration

**File**: `next.config.mjs`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
  // ... other config
};
```

**Purpose**: Allows Next.js `<Image>` component to load images from Cloudinary CDN.

**Important**: After changing this file, you must restart the dev server:

```bash
npm run dev
```

### Cloudinary Folder Structure

**Base Folder**: `mrbuild/`

**Subfolders** (current and planned):

- `mrbuild/specials/` - Promotional brochures and special offers
- `mrbuild/brands/` - Brand logos (future)
- `mrbuild/products/` - Product images (future)
- `mrbuild/services/` - Service images (future)
- `mrbuild/team/` - Team member photos (future)
- `mrbuild/portfolio/` - Portfolio/project images (future)

### Environment Variables

**File**: `.env.local`

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=dvzknqigl
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dvzknqigl
```

**Security Notes**:

- ✅ `CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET` are server-only (no `NEXT_PUBLIC_` prefix)
- ✅ `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` is safe to expose (public CDN identifier)
- ⚠️ Never commit `.env.local` to Git (already in `.gitignore`)

## 📂 Folder Strategy

### Why Nested Structure?

Using `mrbuild/specials/` instead of `mrbuild-specials/` allows for:

1. **Better Organization**: All Mr Build assets under one parent folder
2. **Easy Management**: View all subfolders in Cloudinary dashboard
3. **Scalability**: Add new categories without cluttering root
4. **Backup/Export**: Download entire `mrbuild/` folder at once
5. **Access Control**: Set permissions on parent folder

### Cloudinary Dashboard Navigation

```
📁 Root
  └── 📁 mrbuild/
      ├── 📁 specials/     (current - promotional brochures)
      ├── 📁 brands/       (future - brand logos)
      ├── 📁 products/     (future - product images)
      ├── 📁 services/     (future - service images)
      └── 📁 ...           (future - other categories)
```

## 🔍 How It Works

### Upload Flow

1. **Admin uploads image** → SpecialForm component
2. **Convert to Base64** → Client-side encoding
3. **Send to API** → POST /api/admin/specials
4. **Upload to Cloudinary** → `uploadToCloudinary(file, 'mrbuild/specials')`
5. **Save metadata** → MongoDB stores Cloudinary URLs + publicId
6. **Display image** → Next.js Image component loads from Cloudinary CDN

### Image URL Example

**Uploaded to**: `mrbuild/specials/`

**Public ID**: `mrbuild/specials/xyz123abc456`

**Generated URLs**:

- HTTP: `http://res.cloudinary.com/dvzknqigl/image/upload/v1234567890/mrbuild/specials/xyz123abc456.png`
- HTTPS: `https://res.cloudinary.com/dvzknqigl/image/upload/v1234567890/mrbuild/specials/xyz123abc456.png`

### Transformations Applied

All uploads automatically get:

- **Max dimensions**: 1200x1200 pixels (maintains aspect ratio)
- **Quality**: Auto (Cloudinary optimizes based on content)
- **Format**: Auto (WebP for modern browsers, fallback for older)
- **Crop**: Limit (never upscale, only downscale if needed)

### Delete Flow

1. **Admin deletes special** → Actions menu or bulk delete
2. **API receives request** → DELETE /api/admin/specials/[id]
3. **Service fetches special** → Get image publicId
4. **Delete from Cloudinary** → `deleteFromCloudinary(publicId)`
5. **Delete from MongoDB** → Remove database record

**Important**: Image is deleted from BOTH Cloudinary and MongoDB to prevent orphaned files and storage waste.

## 🚨 Common Issues & Solutions

### Issue 1: "Hostname not configured" Error

**Error Message**:

```
Invalid src prop (https://res.cloudinary.com/...) on `next/image`,
hostname "res.cloudinary.com" is not configured under images in your `next.config.js`
```

**Solution**:

1. Add hostname to `next.config.mjs` (already done ✅)
2. Restart dev server: `npm run dev`
3. Hard refresh browser: `Ctrl+Shift+R` (or `Cmd+Shift+R` on Mac)

### Issue 2: Images Upload to Wrong Folder

**Check**:

1. `src/lib/cloudinary.ts` → default folder parameter
2. Should be: `folder: string = 'mrbuild/specials'`

**Fix Existing Images** (if needed):

- Go to Cloudinary dashboard
- Select images in `mrbuild-specials/` folder
- Move to `mrbuild/specials/` folder
- Update MongoDB records with new publicIds

### Issue 3: Images Not Displaying

**Checklist**:

- ✅ Environment variables set in `.env.local`
- ✅ `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` matches `CLOUDINARY_CLOUD_NAME`
- ✅ Next.js config includes `res.cloudinary.com` hostname
- ✅ Dev server restarted after config changes
- ✅ Image exists in Cloudinary (check dashboard)
- ✅ URL in MongoDB matches Cloudinary URL

### Issue 4: Upload Fails

**Common Causes**:

1. **Invalid Credentials**: Check `.env.local` API key/secret
2. **Network Issues**: Check internet connection
3. **File Size**: Max 5MB (adjust in SpecialForm.tsx if needed)
4. **Invalid Format**: Only PNG, JPG, GIF, WebP allowed
5. **Quota Exceeded**: Check Cloudinary usage limits

## 📊 Cloudinary Dashboard

### Accessing Dashboard

1. Go to: https://cloudinary.com/console
2. Login with your account
3. Navigate to **Media Library**
4. Filter by folder: `mrbuild/specials`

### Useful Actions

- **View Image**: Click thumbnail
- **Copy URL**: Right-click → Copy link
- **Delete Image**: Select → Delete (⚠️ will break links)
- **Move Image**: Select → Move to folder
- **Download**: Select → Download
- **Transform**: Click image → Edit → Add transformations

### Monitoring Usage

**Dashboard → Account → Usage**

Track:

- Storage used (MB/GB)
- Bandwidth used (MB/GB)
- Transformations count
- Video duration (if used)
- API requests

**Free Tier Limits** (as of 2024):

- Storage: 25 GB
- Bandwidth: 25 GB/month
- Transformations: 25,000/month
- Images/Videos: Unlimited

## 🔐 Security Best Practices

### Environment Variables

✅ **DO**:

- Keep `.env.local` out of version control
- Use different credentials for dev/staging/production
- Rotate API keys periodically
- Limit API key permissions if possible

❌ **DON'T**:

- Commit `.env.local` to Git
- Share API secrets in chat/email
- Use production credentials in development
- Hardcode credentials in source code

### Image Upload Validation

**Already Implemented**:

- ✅ File size validation (max 5MB)
- ✅ File format validation (PNG/JPG/GIF/WebP only)
- ✅ Base64 validation
- ✅ Server-side upload (not direct from client)

### Access Control

**Already Implemented**:

- ✅ Admin routes protected with NextAuth
- ✅ Public API returns active specials only
- ✅ Upload only through authenticated API routes

## 🎯 Future Cloudinary Features

### Potential Enhancements

1. **Multiple Image Sizes**

   - Responsive srcset generation
   - Thumbnail, medium, large, original
   - Automatic lazy loading

2. **Advanced Transformations**

   - Watermarking
   - Background removal
   - Smart cropping (face detection)
   - Image effects (blur, sepia, etc.)

3. **Video Support**

   - Upload promotional videos
   - Automatic transcoding
   - Adaptive streaming

4. **AI Features**

   - Auto-tagging
   - Content-aware cropping
   - Image upscaling
   - Background replacement

5. **Analytics**
   - Track image views
   - Monitor bandwidth usage
   - Identify unused images
   - Optimize popular images

## 📚 Resources

- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Cloudinary Node.js SDK](https://cloudinary.com/documentation/node_integration)
- [Next.js Image Optimization](https://nextjs.org/docs/app/api-reference/components/image)
- [Next.js Remote Patterns](https://nextjs.org/docs/app/api-reference/components/image#remotepatterns)

## ✅ Configuration Checklist

Current status:

- ✅ Cloudinary account created
- ✅ Environment variables set
- ✅ Next.js hostname configured
- ✅ Folder structure updated to `mrbuild/specials`
- ✅ Upload utility configured
- ✅ Delete utility configured
- ✅ Admin UI working
- ✅ Public display working
- ✅ Dev server restarted

---

**All configuration complete! Images should now load without errors.** 🎉
