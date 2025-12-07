# Specials Management - Quick Reference

## 🚀 Quick Start

### Access Specials Management

1. Login to admin: `http://localhost:3000/login`
2. Dashboard → **Specials Management** card
3. Or directly: `http://localhost:3000/admin/specials`

### Create Your First Special

```
1. Click "+ Add Special"
2. Enter title (e.g., "January 2025 Specials")
3. Upload image (PNG/JPG, max 5MB, recommended 1200x1200px)
4. Set Status to "ACTIVE"
5. Check "Active" checkbox
6. Click "Create Special"
```

### Make Special Visible on Website

**All conditions must be met:**

- ✅ Status = ACTIVE
- ✅ Active checkbox = checked
- ✅ No date range OR current date within range

## 📋 Status Guide

| Status        | Description          | Public Visibility                 |
| ------------- | -------------------- | --------------------------------- |
| **ACTIVE**    | Currently displayed  | ✅ Visible (if isActive=true)     |
| **INACTIVE**  | Hidden from public   | ❌ Not visible                    |
| **SCHEDULED** | Prepared for future  | ❌ Not visible (until date range) |
| **EXPIRED**   | Past validity period | ❌ Not visible                    |

## 🎯 Common Tasks

### Replace an Image

```
1. Edit special
2. Click "Upload New Image"
3. Select new file
4. Click "Update Special"
→ Old image automatically deleted from Cloudinary
```

### Bulk Delete

```
1. Check boxes for specials to delete
2. Click "Delete Selected" (top right)
3. Confirm
→ Images automatically deleted from Cloudinary
```

### Quick Hide/Show

```
Detail modal → "Hide Special" or "Show Special" button
OR
Actions menu (⋮) → "Hide" or "Show"
```

### Control Display Order

```
Lower number = appears first in slider
Example: Order 0, 1, 2, 3
→ Displays in that order
```

### Set Date Range

```
Valid From: 2025-01-01
Valid Until: 2025-01-31
→ Auto-displays within this period (if ACTIVE + isActive=true)
```

## 🔍 Dashboard Insights

### Stats Cards

- **Total** - All specials (any status)
- **Active** - Currently displayed (green)
- **Inactive** - Hidden (gray)
- **Scheduled** - Future specials (blue)
- **Expired** - Past specials (red)

### Visibility Alert

- **Green** - Section is visible on website
- **Yellow** - Section is hidden (no active specials)

### Filters & Sorting

- **Filter**: All | Active | Inactive | Scheduled | Expired
- **Sort by**: Title | Status | Display Order | Created Date
- **Page size**: 5 | 10 | 20 | 50 items per page

## 🛠️ Image Requirements

### Optimal Specs

- **Format**: PNG, JPG, GIF, WebP
- **Size**: Max 5MB
- **Dimensions**: 1200x1200px recommended
- **Aspect ratio**: Any (auto-optimized)

### What Happens to Images

1. Upload → Base64 encoding
2. Server → Cloudinary upload
3. Cloudinary → Auto-optimize:
   - Convert to WebP (best quality/size)
   - Max 1200x1200px
   - Auto quality compression
4. Database → Save Cloudinary URL + metadata

### Cloudinary Transformations

- ✅ Format: auto (WebP preferred)
- ✅ Quality: auto
- ✅ Max dimensions: 1200x1200
- ✅ Folder: `mrbuild/specials`

## 🌐 Public Display

### When Section Shows

**ALL must be true:**

1. At least one special exists with:
   - Status = ACTIVE
   - isActive = true
   - Valid date range (or no dates)
2. API returns `hasActiveSpecials: true`

### When Section Hides

**ANY is true:**

- No specials in database
- All specials are INACTIVE/EXPIRED
- All specials have isActive = false
- Current date outside all valid ranges

### Slider Behavior

- **Desktop**: 3 specials per view
- **Tablet**: 2 specials per view
- **Mobile**: 1 special per view
- **Autoplay**: 5 seconds
- **Loop**: Enabled
- **Navigation**: Arrow buttons + pagination dots

## 🔐 Security

### Admin Access Required

- All management pages protected
- Auto-redirect to login if not authenticated
- Session-based authentication (NextAuth)

### Public API

- No authentication needed
- Only returns ACTIVE specials
- Cached for 1 hour (revalidate: 3600)

## 🐛 Troubleshooting

### "Image too large" error

→ Reduce file size or compress image (max 5MB)

### Special not showing on website

**Check:**

1. Status = ACTIVE? ✅
2. Active checkbox checked? ✅
3. Date range valid? ✅
4. Clear browser cache
5. Check dashboard alert (should be green)

### Upload fails

**Check:**

1. Image format (PNG/JPG/GIF/WebP)
2. Image size < 5MB
3. Cloudinary credentials in `.env.local`
4. Internet connection

### Section disappeared

→ All specials inactive/expired → Expected behavior

### Changes not visible immediately

→ Public API cached 1 hour → Wait or restart dev server

## 📂 File Locations

### Admin Pages

- List: `/admin/specials`
- Create: `/admin/specials/new`
- Edit: `/admin/specials/edit/[id]`

### API Endpoints

- Admin: `/api/admin/specials`, `/api/admin/specials/[id]`, `/api/admin/specials/stats`
- Public: `/api/specials`

### Components

- Form: `src/components/admin/SpecialForm.tsx`
- List: `src/app/(admin)/admin/specials/page.tsx`
- Public Section: `src/app/(public)/components/SpecialsSection/`

### Configuration

- Types: `src/types/special.ts`
- Cloudinary: `src/lib/cloudinary.ts`
- Repository: `src/lib/repositories/special.repository.ts`
- Service: `src/lib/services/special.service.ts`

## 🎨 UI Elements

### Table Columns

1. Checkbox (bulk selection)
2. Image (60x60px thumbnail)
3. Title
4. Status (colored badge)
5. Display Order
6. Created Date
7. Actions menu (⋮)

### Status Badges

- 🟢 **ACTIVE** - Green
- ⚫ **INACTIVE** - Gray
- 🔵 **SCHEDULED** - Blue
- 🔴 **EXPIRED** - Red

### Action Buttons

- **+ Add Special** - Create new (top right)
- **Delete Selected** - Bulk delete (top right, appears when items selected)
- **Edit** - Actions menu or detail modal
- **View** - Actions menu (opens detail modal)
- **Hide/Show** - Actions menu or detail modal
- **Delete** - Actions menu

## 💡 Pro Tips

### Tip 1: Numbering Display Order

```
Use increments of 10 for easy reordering:
10, 20, 30, 40...
→ Can insert new special at 15 between 10 and 20
```

### Tip 2: Internal Titles

```
Use descriptive titles for easy management:
✅ "January 2025 New Year Promo"
❌ "Special 1"
```

### Tip 3: Scheduled Specials

```
Prepare future specials:
1. Upload special
2. Set Status to SCHEDULED
3. Set validFrom to future date
→ Change to ACTIVE when ready to publish
```

### Tip 4: Image Optimization

```
Before upload:
1. Resize to ~1200x1200px
2. Compress with tools like TinyPNG
→ Faster uploads, better performance
```

### Tip 5: Testing Visibility

```
After upload:
1. Check dashboard alert (green = visible)
2. Open website in incognito tab
3. Navigate to specials section
4. Wait 1-2 seconds for cache
```

## 📞 Support

### Need Help?

1. Check [SPECIALS_MANAGEMENT.md](./SPECIALS_MANAGEMENT.md) for detailed guide
2. Review troubleshooting section above
3. Check browser console for errors
4. Verify environment variables

### Common Questions

**Q: Why isn't my special showing?**
A: Check all visibility conditions (status, isActive, date range)

**Q: Can I have multiple active specials?**
A: Yes! Slider will show all active specials in display order

**Q: How do I hide the entire section?**
A: Set all specials to INACTIVE or delete them

**Q: Do I need to manually delete old images?**
A: No! Cloudinary images auto-delete when you delete/replace specials

**Q: Can I edit a special without replacing the image?**
A: Yes! Just don't upload a new image during edit

---

**Ready to get started? Click "+ Add Special" and upload your first promotional brochure! 🚀**
