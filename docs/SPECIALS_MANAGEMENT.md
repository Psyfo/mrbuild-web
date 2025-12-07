# Specials Management System - Complete Guide

## 📋 Overview

The Specials Management System allows admin users to upload, manage, and display promotional brochures or special offer images on the Mr Build website. The system integrates with Cloudinary for image management and automatically controls the visibility of the Specials section based on active content.

## 🎯 Features

### Admin Features

- ✅ **Complete CRUD Operations** - Create, read, update, and delete specials
- ✅ **Cloudinary Integration** - Automatic image upload, optimization, and deletion
- ✅ **Image Management** - Replace images, automatic transformations (max 1200x1200, auto format/quality)
- ✅ **Status Management** - Active, Inactive, Scheduled, Expired states
- ✅ **Validity Periods** - Set start and end dates for automatic display control
- ✅ **Display Ordering** - Control the order specials appear in the slider
- ✅ **Bulk Operations** - Delete multiple specials at once
- ✅ **Statistics Dashboard** - View counts by status
- ✅ **Visibility Toggle** - Quick enable/disable for individual specials
- ✅ **Image Preview** - See uploaded images in table and detail views
- ✅ **Filtering & Sorting** - Filter by status, sort by title, date, or display order
- ✅ **Pagination** - Configurable page size (5/10/20/50 items)

### Public Features

- ✅ **Automatic Section Display** - Specials section only shows when active specials exist
- ✅ **Responsive Slider** - Swiper.js carousel with navigation and pagination
- ✅ **Optimized Images** - Cloudinary transformations for fast loading
- ✅ **Cached API** - 1-hour revalidation for optimal performance

## 🏗️ Architecture

### Data Flow

```
User Upload → Base64 Encoding → API Route → Service Layer → Cloudinary Upload → MongoDB Storage
Public Request → Cached API → Service Layer → Repository Query → Active Specials Only
```

### File Structure

```
src/
├── types/
│   └── special.ts                          # TypeScript interfaces & enums
├── lib/
│   ├── cloudinary.ts                       # Cloudinary utilities
│   ├── repositories/
│   │   └── special.repository.ts           # Data access layer
│   └── services/
│       └── special.service.ts              # Business logic
├── components/
│   ├── admin/
│   │   └── SpecialForm.tsx                 # Reusable form component
│   └── ui/
│       └── textarea.tsx                    # Shadcn textarea component
├── app/
│   ├── api/
│   │   ├── admin/
│   │   │   └── specials/
│   │   │       ├── route.ts               # List, create, bulk delete
│   │   │       ├── [id]/route.ts          # Get, update, delete single
│   │   │       └── stats/route.ts         # Dashboard statistics
│   │   └── specials/
│   │       └── route.ts                   # Public API (active only)
│   ├── (admin)/
│   │   └── admin/
│   │       ├── page.tsx                   # Dashboard with specials link
│   │       └── specials/
│   │           ├── page.tsx               # List view
│   │           ├── new/
│   │           │   └── page.tsx           # Create special
│   │           └── edit/
│   │               └── [id]/page.tsx      # Edit special
│   └── (public)/
│       └── components/
│           └── SpecialsSection/
│               ├── SpecialsSection.tsx    # Section wrapper with API fetch
│               └── SpecialsSlider/
│                   └── SpecialsSlider.tsx # Swiper carousel
```

## 🔧 Technical Implementation

### 1. Environment Variables (.env.local)

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=dvzknqigl
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dvzknqigl
```

### 2. Type Definitions (src/types/special.ts)

#### Enums

```typescript
enum SpecialStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SCHEDULED = 'SCHEDULED',
  EXPIRED = 'EXPIRED',
}
```

#### Key Interfaces

```typescript
interface ICloudinaryImage {
  publicId: string; // Cloudinary unique identifier
  url: string; // HTTP URL
  secureUrl: string; // HTTPS URL
  width: number; // Image width in pixels
  height: number; // Image height in pixels
  format: string; // File format (jpg, png, webp, etc.)
  bytes: number; // File size in bytes
}

interface ISpecial {
  _id?: string;
  title: string; // Admin reference title
  description?: string; // Internal notes
  image: ICloudinaryImage; // Cloudinary image data
  status: SpecialStatus; // Current status
  displayOrder: number; // Sort order (lower = first)
  validFrom?: Date; // Start date (optional)
  validUntil?: Date; // End date (optional)
  isActive: boolean; // Visibility flag
  createdAt?: Date;
  updatedAt?: Date;
}
```

### 3. Cloudinary Integration (src/lib/cloudinary.ts)

#### Upload Function

```typescript
async function uploadToCloudinary(
  file: string, // Base64 encoded image
  folder: string = 'mrbuild/specials'
): Promise<ICloudinaryImage>;
```

Features:

- Automatic format conversion (WebP preferred)
- Quality optimization (auto)
- Max dimensions: 1200x1200 pixels
- Folder organization
- Returns complete image metadata

#### Delete Function

```typescript
async function deleteFromCloudinary(publicId: string): Promise<void>;
```

#### Validation Function

```typescript
function validateImage(
  file: string,
  maxSizeMB: number = 5
): { valid: boolean; error?: string };
```

Checks:

- Base64 format validity
- File size limit (default 5MB)
- Image format (PNG, JPG, GIF, WebP)

### 4. Repository Layer (src/lib/repositories/special.repository.ts)

#### Key Methods

**Create Special**

```typescript
async create(specialData: ISpecialInput): Promise<ISpecial>
```

**Find All with Filters**

```typescript
async findAll(params: {
  status?: SpecialStatus;
  page?: number;
  limit?: number;
  sortBy?: 'title' | 'createdAt' | 'displayOrder';
  sortOrder?: 'asc' | 'desc';
}): Promise<{ specials: ISpecial[]; total: number; page: number; limit: number }>
```

**Find Active Specials**

```typescript
async findAllActive(): Promise<ISpecial[]>
```

Returns only specials with:

- `isActive === true`
- `status === SpecialStatus.ACTIVE`
- Valid date range (if set)
- Sorted by `displayOrder` ascending

**Check Section Visibility**

```typescript
async hasActiveSpecials(): Promise<boolean>
```

Quick check to determine if Specials section should display

**Statistics**

```typescript
async getStats(): Promise<ISpecialStats>
```

Returns counts for each status + `hasActiveSpecials` flag

### 5. Service Layer (src/lib/services/special.service.ts)

#### Key Methods

**Create with Image Upload**

```typescript
async createSpecialWithUpload(
  title: string,
  imageFile: string,    // Base64
  options?: Partial<ISpecialInput>
): Promise<ISpecial>
```

Workflow:

1. Validate image (format, size)
2. Upload to Cloudinary
3. Save to MongoDB with image metadata
4. Return created special

**Update with Optional Image Replacement**

```typescript
async updateSpecialWithUpload(
  id: string,
  imageFile: string | null,  // null = keep existing
  updates: Partial<ISpecialInput>
): Promise<ISpecial>
```

Workflow:

1. Fetch existing special
2. If new image provided:
   - Delete old image from Cloudinary
   - Upload new image
   - Update image metadata
3. Apply other updates
4. Save to MongoDB

**Delete Special**

```typescript
async deleteSpecial(id: string): Promise<void>
```

Workflow:

1. Fetch special
2. Delete image from Cloudinary
3. Delete record from MongoDB

**Check Display Status**

```typescript
async shouldDisplaySpecials(): Promise<boolean>
```

Business logic to determine section visibility

### 6. API Routes

#### Admin Routes (Protected with NextAuth)

**GET /api/admin/specials**

- Query params: `status`, `page`, `limit`, `sortBy`, `sortOrder`
- Returns: Paginated list with metadata

**POST /api/admin/specials**

- Body: `{ title, image (base64), description?, status?, displayOrder?, validFrom?, validUntil?, isActive? }`
- Returns: Created special

**DELETE /api/admin/specials**

- Body: `{ ids: string[] }`
- Returns: Success message

**GET /api/admin/specials/[id]**

- Returns: Single special

**PATCH /api/admin/specials/[id]**

- Body: Any ISpecial fields, `image` (base64) is optional
- Returns: Updated special

**DELETE /api/admin/specials/[id]**

- Returns: Success message

**GET /api/admin/specials/stats**

- Returns: Dashboard statistics

#### Public Route

**GET /api/specials**

- No authentication required
- Returns: Active specials only + `hasActiveSpecials` flag
- Caching: `revalidate: 3600` (1 hour)

### 7. Admin UI Components

#### SpecialForm Component

- **Location**: `src/components/admin/SpecialForm.tsx`
- **Props**: `special?: ISpecial`, `isEdit?: boolean`
- **Features**:
  - Image upload with preview
  - Base64 conversion (max 5MB)
  - Form validation
  - Status selector
  - Date pickers for validity period
  - Display order input
  - Active/inactive toggle
  - Automatic image replacement on edit

#### Specials List Page

- **Location**: `src/app/(admin)/admin/specials/page.tsx`
- **Features**:
  - Stats cards (total, active, inactive, scheduled, expired)
  - Visibility alert (green if section visible, yellow if hidden)
  - Status filter dropdown
  - Sortable columns
  - Image thumbnails (60x60px)
  - Bulk selection and delete
  - Clickable rows for detail view
  - Detail modal with full image preview
  - Actions menu (View, Edit, Hide/Show, Delete)
  - Pagination with configurable page size

#### New Special Page

- **Location**: `src/app/(admin)/admin/specials/new/page.tsx`
- **Features**: Form wrapper for creation

#### Edit Special Page

- **Location**: `src/app/(admin)/admin/specials/edit/[id]/page.tsx`
- **Features**: Loads existing data, form wrapper for editing

### 8. Public UI Components

#### SpecialsSection Component

- **Location**: `src/app/(public)/components/SpecialsSection/SpecialsSection.tsx`
- **Behavior**:
  - Fetches from `/api/specials` on mount
  - Shows loading state
  - **Conditional Rendering**: Returns `null` if no active specials
  - Passes data to SpecialsSlider

#### SpecialsSlider Component

- **Location**: `src/app/(public)/components/SpecialsSection/SpecialsSlider/SpecialsSlider.tsx`
- **Props**: `specials: ISpecial[]`
- **Features**:
  - Swiper.js carousel
  - Navigation buttons
  - Pagination dots
  - Autoplay (5s delay)
  - Loop enabled
  - Responsive (3 slides desktop, 2 tablet, 1 mobile)
  - Next.js Image component with Cloudinary URLs

## 📝 Usage Guide

### Creating a New Special

1. Navigate to **Admin Dashboard** → **Specials Management**
2. Click **"+ Add Special"** button
3. Fill in the form:
   - **Title** (required) - Internal reference (not shown publicly)
   - **Description** (optional) - Internal notes
   - **Image** (required) - Upload promotional brochure
     - Max size: 5MB
     - Formats: PNG, JPG, GIF, WebP
     - Recommended: 1200x1200 pixels
   - **Status** - Select ACTIVE to display immediately
   - **Display Order** - Lower numbers appear first (0 = first)
   - **Valid From/Until** (optional) - Auto-display within date range
   - **Active** - Must be checked for public visibility
4. Click **"Create Special"**
5. Special appears in list with thumbnail

### Editing a Special

1. Navigate to **Specials Management**
2. Click on a special row or select **Edit** from actions menu
3. Modify fields as needed
4. To replace image:
   - Click **"Upload New Image"** or **"Change Image"**
   - Select new file
   - Old image is automatically deleted from Cloudinary
5. Click **"Update Special"**

### Deleting Specials

**Single Delete**:

1. Click actions menu (⋮) on special row
2. Select **"Delete"**
3. Confirm deletion

**Bulk Delete**:

1. Check boxes for specials to delete
2. Click **"Delete Selected"** button
3. Confirm deletion

### Managing Visibility

**Quick Toggle**:

- Use **"Hide"** or **"Show"** buttons in detail modal or actions menu

**Section Auto-Hide**:

- Specials section automatically hides when no active specials exist
- Check dashboard alert: "Specials section is currently visible/hidden"

### Status Management

- **ACTIVE** - Displayed to public (if isActive=true and within date range)
- **INACTIVE** - Hidden from public
- **SCHEDULED** - Prepared for future activation
- **EXPIRED** - Past validity period (can use auto-expire service)

## 🔍 Monitoring & Analytics

### Dashboard Statistics

Located at `/admin/specials`, the stats cards show:

- **Total** - All specials
- **Active** - Currently displayed
- **Inactive** - Hidden specials
- **Scheduled** - Future specials
- **Expired** - Past specials

### Visibility Alert

Color-coded alert shows current section status:

- **Green** - "Specials section is currently visible on the website"
- **Yellow** - "Specials section is currently hidden (no active specials)"

## 🚀 Performance Optimizations

### Image Optimization

- Automatic WebP conversion
- Quality optimization (auto)
- Lazy loading on public site
- Responsive srcset generation
- Max dimensions: 1200x1200px

### API Caching

- Public API cached for 1 hour
- Reduces database queries
- Fast page loads

### Database Indexes

```javascript
// Automatically created in repository
{ status: 1, isActive: 1, displayOrder: 1 }  // For active specials query
{ status: 1 }                                 // For filtering
{ displayOrder: 1 }                           // For sorting
{ createdAt: -1 }                             // For sorting by date
```

## 🛡️ Security

### Authentication

- All admin routes protected with NextAuth
- Session-based authentication
- Auto-redirect to login if unauthorized

### Validation

- Client-side form validation
- Server-side validation in API routes
- Image format/size validation
- Base64 validation

### Data Sanitization

- MongoDB query protection
- XSS prevention in form inputs
- Safe image URL generation

## 🐛 Troubleshooting

### Images Not Displaying

**Check**:

1. Cloudinary credentials in `.env.local`
2. `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` matches `CLOUDINARY_CLOUD_NAME`
3. Special status is ACTIVE
4. `isActive` is true
5. Valid date range (if set)

### Section Not Showing

**Check**:

1. At least one special with:
   - `status === SpecialStatus.ACTIVE`
   - `isActive === true`
   - Valid date range (or no dates set)
2. Clear cache: `npm run build` and restart server

### Upload Fails

**Check**:

1. Image size < 5MB
2. Valid format (PNG, JPG, GIF, WebP)
3. Cloudinary API credentials
4. Network connection

### TypeScript Errors

**Solutions**:

1. Restart TypeScript server: `Ctrl+Shift+P` → "TypeScript: Restart TS Server"
2. Delete `.next` folder: `rm -rf .next` (or `Remove-Item -Recurse .next` on Windows)
3. Reinstall dependencies: `npm install`

## 📚 API Reference

### Request/Response Examples

#### Create Special

```http
POST /api/admin/specials
Content-Type: application/json

{
  "title": "January 2025 Specials",
  "description": "New year promotional brochure",
  "image": "data:image/jpeg;base64,...",
  "status": "ACTIVE",
  "displayOrder": 0,
  "validFrom": "2025-01-01",
  "validUntil": "2025-01-31",
  "isActive": true
}
```

Response:

```json
{
  "special": {
    "_id": "60d5ec49a1b2c3d4e5f6g7h8",
    "title": "January 2025 Specials",
    "description": "New year promotional brochure",
    "image": {
      "publicId": "mrbuild/specials/abc123",
      "url": "http://res.cloudinary.com/...",
      "secureUrl": "https://res.cloudinary.com/...",
      "width": 1200,
      "height": 800,
      "format": "webp",
      "bytes": 125000
    },
    "status": "ACTIVE",
    "displayOrder": 0,
    "validFrom": "2025-01-01T00:00:00.000Z",
    "validUntil": "2025-01-31T23:59:59.999Z",
    "isActive": true,
    "createdAt": "2024-12-15T10:30:00.000Z",
    "updatedAt": "2024-12-15T10:30:00.000Z"
  }
}
```

## 🔮 Future Enhancements

### Potential Features

- [ ] Auto-expire cron job (scheduled task to update status)
- [ ] Click tracking (analytics for special views)
- [ ] A/B testing (test different images)
- [ ] Draft mode (prepare specials without publishing)
- [ ] Multi-image support (image galleries)
- [ ] PDF upload support (brochure PDFs)
- [ ] Email notifications (when specials expire)
- [ ] Duplicate special feature
- [ ] Import/export functionality
- [ ] Revision history

## 📖 Related Documentation

- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [MongoDB Queries](https://www.mongodb.com/docs/manual/crud/)
- [Swiper.js Documentation](https://swiperjs.com/react)
- [NextAuth.js Documentation](https://next-auth.js.org/)

## ✅ Testing Checklist

### Admin Testing

- [ ] Login to admin dashboard
- [ ] Navigate to Specials Management
- [ ] Create new special with image upload
- [ ] Edit special and replace image
- [ ] Toggle special visibility
- [ ] Delete single special
- [ ] Bulk delete specials
- [ ] Filter by status
- [ ] Sort by different columns
- [ ] Change pagination size
- [ ] View detail modal
- [ ] Check statistics accuracy

### Public Testing

- [ ] View homepage specials section
- [ ] Navigate through slider
- [ ] Check responsive design (mobile/tablet/desktop)
- [ ] Verify images load optimized (WebP format)
- [ ] Delete all active specials → section should disappear
- [ ] Create one active special → section should reappear

### Edge Cases

- [ ] Upload maximum size image (5MB)
- [ ] Try uploading invalid format
- [ ] Create special with past end date
- [ ] Create special with future start date
- [ ] Test with no specials in database
- [ ] Test with 50+ specials (pagination)

## 🎉 Summary

The Specials Management System is now fully operational with:

- ✅ Complete admin CRUD interface
- ✅ Cloudinary image management
- ✅ Public display with conditional rendering
- ✅ Database integration
- ✅ Type-safe TypeScript throughout
- ✅ Responsive UI
- ✅ Performance optimizations
- ✅ Security measures

All components follow the same architecture pattern as the Contacts and Branches systems for consistency and maintainability.
