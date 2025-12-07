# Cloudinary Folder Migration Guide

## 📦 Migration from `mrbuild-specials` to `mrbuild/specials`

### Overview

The folder structure has been updated from:

- ❌ Old: `mrbuild-specials/`
- ✅ New: `mrbuild/specials/`

### Why the Change?

The new structure allows for better organization:

```
mrbuild/
  ├── specials/      (promotional brochures)
  ├── brands/        (future: brand logos)
  ├── products/      (future: product images)
  ├── services/      (future: service images)
  └── ...
```

### What Changed?

**Files Updated**:

1. ✅ `next.config.mjs` - Added Cloudinary hostname
2. ✅ `src/lib/cloudinary.ts` - Changed default folder to `mrbuild/specials`
3. ✅ Documentation updated

**Action Required**:

- ✅ Dev server restarted
- 🔄 **If you have existing images in old folder**: Follow migration steps below

---

## 🔄 Migration Steps (If Needed)

### Option 1: Manual Migration (Cloudinary Dashboard)

**Step 1: Check for Existing Images**

1. Login to Cloudinary dashboard
2. Go to Media Library
3. Search for folder: `mrbuild-specials`
4. If empty → No action needed ✅
5. If has images → Continue to Step 2

**Step 2: Move Images**

1. Select all images in `mrbuild-specials/` folder
2. Click "Move" button (folder icon)
3. Enter new folder: `mrbuild/specials`
4. Click "Move"
5. Confirm migration

**Step 3: Update Database (if images exist)**

You'll need to update MongoDB records with new publicIds:

```javascript
// Run this script in MongoDB Compass or mongosh
db.specials.find({ 'image.publicId': /^mrbuild-specials\// }).forEach((doc) => {
  const newPublicId = doc.image.publicId.replace(
    'mrbuild-specials/',
    'mrbuild/specials/'
  );
  const newUrl = doc.image.url.replace(
    'mrbuild-specials/',
    'mrbuild/specials/'
  );
  const newSecureUrl = doc.image.secureUrl.replace(
    'mrbuild-specials/',
    'mrbuild/specials/'
  );

  db.specials.updateOne(
    { _id: doc._id },
    {
      $set: {
        'image.publicId': newPublicId,
        'image.url': newUrl,
        'image.secureUrl': newSecureUrl,
      },
    }
  );

  print(`Updated: ${doc.title}`);
});
```

### Option 2: Fresh Start (Recommended if No Production Data)

**If you haven't uploaded any important images yet**:

1. Delete all test specials from admin panel
2. Images will auto-delete from Cloudinary
3. Upload new specials
4. New images will use correct folder structure ✅

---

## ✅ Verification

### Check 1: New Uploads

1. Go to admin: `http://localhost:3001/admin/specials`
2. Click "+ Add Special"
3. Upload an image
4. After creation, check Cloudinary dashboard
5. Image should be in: `mrbuild/specials/` ✅

### Check 2: Image Display

1. Go to admin specials list
2. Images should display without errors
3. Check browser console (F12) - no hostname errors
4. Go to public homepage
5. Specials section should show images correctly

### Check 3: Public ID Format

In MongoDB, check a special document:

```json
{
  "image": {
    "publicId": "mrbuild/specials/xyz123", // ✅ Should have forward slash
    "secureUrl": "https://res.cloudinary.com/.../mrbuild/specials/xyz123.png"
  }
}
```

---

## 🚨 Troubleshooting

### Images Still Going to Old Folder

**Check**:

```bash
# Search for old folder reference
grep -r "mrbuild-specials" src/
```

**Should only find**:

- Maybe in documentation (historical reference)
- Should NOT find in: cloudinary.ts, service files, API routes

### Database Has Mixed Folder Structures

**Identify affected records**:

```javascript
// Count old format
db.specials.countDocuments({ 'image.publicId': /^mrbuild-specials\// });

// Count new format
db.specials.countDocuments({ 'image.publicId': /^mrbuild\/specials\// });
```

**Fix**: Run migration script from Option 1, Step 3

### Images Display in Admin but Not Public

**Check**:

1. Status = ACTIVE?
2. isActive = true?
3. Valid date range?
4. Browser cache - hard refresh: `Ctrl+Shift+R`

---

## 📋 Migration Checklist

Before migration:

- [ ] Backup database (mongodump or export)
- [ ] Note count of existing specials
- [ ] List Cloudinary folder contents

After migration:

- [ ] All images in `mrbuild/specials/` folder
- [ ] No images left in old `mrbuild-specials/` folder
- [ ] All MongoDB records updated
- [ ] Images display correctly in admin
- [ ] Images display correctly on public site
- [ ] New uploads use correct folder
- [ ] No console errors

---

## 💡 Pro Tips

### Prevent Future Issues

1. **Always use service layer** - Don't hardcode folder paths
2. **Check Cloudinary dashboard** - Verify folder structure after first upload
3. **Monitor uploads** - Check browser network tab for upload destination
4. **Document changes** - Update team when folder structure changes

### Cloudinary Folder Best Practices

```
✅ DO:
- Use forward slashes: mrbuild/specials/
- Use lowercase: mrbuild not MrBuild
- Use hyphens for words: special-offers not special_offers
- Keep consistent: don't mix / and -

❌ DON'T:
- Use backslashes: mrbuild\specials
- Use spaces: mrbuild/special offers
- Mix separators: mrbuild-specials/images
- Change structure frequently
```

---

## 🎯 Current Status

- ✅ Code updated to use `mrbuild/specials/`
- ✅ Next.js config updated
- ✅ Documentation updated
- ✅ Dev server restarted
- ⏳ Migration required only if you have existing images in old folder

**Next steps**:

1. Test by creating a new special
2. Verify it uploads to `mrbuild/specials/` folder
3. If successful, migrate any existing images (if applicable)
4. You're done! 🎉

---

**Questions? Check [CLOUDINARY_CONFIG.md](./CLOUDINARY_CONFIG.md) for detailed configuration info.**
