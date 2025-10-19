# Branch Management System - Quick Reference

## Overview

Complete branch management system for Mr Build and The Builder locations with dynamic data from MongoDB.

## Components Created

### 1. Type Definitions (`src/types/branch.ts`)

- **BranchStatus**: ACTIVE, INACTIVE, COMING_SOON
- **BranchType**: MR_BUILD, THE_BUILDER
- **IBranch**: Complete branch interface with coordinates, operating hours, contact info
- **IBranchStats**: Statistics interface
- **IBranchListResponse**: Paginated response interface

### 2. Repository Layer (`src/lib/repositories/branch.repository.ts`)

- **create()**: Add new branch
- **findById()**: Get branch by ID
- **findBySlug()**: Get branch by URL slug
- **findAll()**: Paginated list with filters
- **findAllActive()**: Public active branches only
- **update()**: Update branch details
- **delete()**: Delete single branch
- **bulkDelete()**: Delete multiple branches
- **getStats()**: Get branch statistics
- **createIndexes()**: Set up MongoDB indexes

### 3. Service Layer (`src/lib/services/branch.service.ts`)

- **createBranch()**: Create with auto-slug generation
- **getBranches()**: Paginated list
- **getActiveBranches()**: Public branches
- **getBranchById()**: Single branch
- **getBranchBySlug()**: By URL slug
- **updateBranch()**: Update with slug regeneration
- **deleteBranch()**: Delete single
- **bulkDeleteBranches()**: Delete multiple
- **getBranchStats()**: Statistics
- **toggleBranchStatus()**: Toggle active/inactive
- **reorderBranches()**: Update display order

### 4. API Routes

#### Admin Routes (Authentication Required)

- `GET /api/admin/branches` - List branches with filters
- `POST /api/admin/branches` - Create new branch
- `DELETE /api/admin/branches?ids=...` - Bulk delete
- `GET /api/admin/branches/[id]` - Get single branch
- `PATCH /api/admin/branches/[id]` - Update branch
- `DELETE /api/admin/branches/[id]` - Delete branch
- `GET /api/admin/branches/stats` - Get statistics

#### Public Routes

- `GET /api/branches` - Get all active branches

### 5. Admin UI (`src/app/(admin)/admin/branches/page.tsx`)

Features:

- ✅ Stats cards (Total, Active, Inactive, Coming Soon, By Type)
- ✅ Search functionality
- ✅ Filter by status and type
- ✅ Sortable columns
- ✅ Pagination with configurable page size (5, 10, 20, 50)
- ✅ Bulk selection and delete
- ✅ Clickable rows for quick view
- ✅ Detail modal with full branch info
- ✅ Actions dropdown (View, Activate/Deactivate, Delete)
- ✅ Responsive design
- ✅ Fixed footer

### 6. Public Display (`src/app/(public)/components/BranchLocator/BranchMap/BranchMap.tsx`)

- Fetches branches from `/api/branches`
- Maps IBranch to legacy format for LeafletMap
- Shows loading state
- Displays all active branches on map

## Database Structure

### Branches Collection

```javascript
{
  _id: ObjectId,
  branchName: String,
  branchType: "MR_BUILD" | "THE_BUILDER",
  status: "ACTIVE" | "INACTIVE" | "COMING_SOON",
  email: String,
  telephone: String,
  alternativePhone: String?,
  address1: String,
  address2: String?,
  city: String,
  province: String,
  postalCode: String,
  coordinates: {
    latitude: Number,
    longitude: Number
  },
  operatingHours: {
    monday: { isOpen, openTime, closeTime, breakStart?, breakEnd? },
    // ... other days
    publicHolidays: String?
  },
  description: String?,
  facilities: [String]?,
  services: [String]?,
  imageUrl: String?,
  slug: String (unique),
  displayOrder: Number?,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Indexes

- `slug` (unique)
- `branchName`
- `status`
- `branchType`
- `city`
- `province`
- `isActive`
- `displayOrder`
- `createdAt`
- Text search on: branchName, city, address1, address2

## Setup & Initialization

### 1. Run Database Initialization

```bash
node scripts/init-branch-db.js
```

This will:

- Create all necessary indexes
- Import 8 existing branches
- Set up proper structure

### 2. Access Admin Panel

Navigate to: `/admin/branches`

### 3. View Public Display

Navigate to: `/#branch-locator`

## Common Operations

### Add New Branch

1. Go to `/admin/branches`
2. Click "+ Add Branch" button
3. Fill in all required fields
4. Save

### Edit Branch

1. Click on branch row or "View Details"
2. Click "Edit Branch"
3. Update fields
4. Save

### Toggle Active Status

- Use actions dropdown "Activate/Deactivate"
- Or click row → "Activate/Deactivate" button

### Delete Branches

- **Single**: Actions dropdown → Delete
- **Bulk**: Select checkboxes → "Delete Selected"

### Search & Filter

- **Search**: Type in search box (searches name, city, address)
- **Status Filter**: Dropdown (All, Active, Inactive, Coming Soon)
- **Type Filter**: Dropdown (All, Mr Build, The Builder)

### Sort

Click column headers to sort:

- Branch Name
- Type
- City
- Status

### Change Page Size

Use "Show:" dropdown (5, 10, 20, 50 per page)

## API Query Parameters

### GET /api/admin/branches

```
?page=1
&pageSize=10
&sortBy=displayOrder
&sortOrder=asc
&status=ACTIVE
&branchType=MR_BUILD
&city=Tzaneen
&province=Limpopo
&isActive=true
&search=build
```

## Statistics

Stats show:

- **Total**: All branches
- **Active**: Status = ACTIVE
- **Inactive**: Status = INACTIVE
- **Coming Soon**: Status = COMING_SOON
- **Mr Build**: branchType = MR_BUILD
- **The Builder**: branchType = THE_BUILDER
- **By Province**: Count per province

## Files Modified

### Created

- `src/types/branch.ts`
- `src/lib/repositories/branch.repository.ts`
- `src/lib/services/branch.service.ts`
- `src/app/api/admin/branches/route.ts`
- `src/app/api/admin/branches/[id]/route.ts`
- `src/app/api/admin/branches/stats/route.ts`
- `src/app/api/branches/route.ts`
- `src/app/(admin)/admin/branches/page.tsx`
- `scripts/init-branch-db.js`

### Modified

- `src/app/(public)/components/BranchLocator/BranchMap/BranchMap.tsx` - Fetches from API
- `src/app/(admin)/admin/page.tsx` - Added branch management link

## Architecture

```
User Request
     ↓
API Routes (/api/admin/branches/*)
     ↓
Service Layer (branch.service.ts)
     ↓
Repository Layer (branch.repository.ts)
     ↓
MongoDB (branches collection)
```

## Security

- All admin routes protected by NextAuth
- Input validation in service layer
- Unique slug enforcement
- Proper error handling

## Best Practices

1. Always run init script before first use
2. Use slug for public URLs (SEO-friendly)
3. Set displayOrder for custom ordering
4. Keep isActive separate from status for flexibility
5. Use bulkDelete for multiple items
6. Set coordinates accurately for map display

## Troubleshooting

### Branches not showing on map

- Check `/api/branches` returns data
- Verify isActive = true
- Check coordinates are valid

### Slug conflicts

- Service auto-appends timestamp if duplicate
- Edit to create unique slug

### Search not working

- Ensure text indexes are created
- Run init script again if needed

## Future Enhancements

- Branch image uploads
- Operating hours editor UI
- Facilities/services management
- Branch analytics
- Customer reviews per branch
- Stock availability per branch
