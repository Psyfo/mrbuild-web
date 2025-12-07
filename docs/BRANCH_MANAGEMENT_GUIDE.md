# Branch Management System - Complete Guide

## 📋 Overview

The Branch Management System allows admins to create, edit, view, and manage branch locations for Mr Build and The Builder stores. All branches are displayed on the public branch locator map and managed through a comprehensive admin interface.

## 🎯 Features

### Admin UI Features

- ✅ **Full CRUD Operations**: Create, Read, Update, Delete branches
- ✅ **Advanced Filtering**: Filter by status, type, search term
- ✅ **Sorting**: Sort by any column (name, city, type, status, order, dates)
- ✅ **Pagination**: Configurable page size (5, 10, 20, 50)
- ✅ **Bulk Operations**: Delete multiple branches at once
- ✅ **Statistics Dashboard**: View totals by status and type
- ✅ **Detail Modal**: Quick view with edit/activate actions
- ✅ **Responsive Design**: Works on all device sizes

### Branch Form Features

- ✅ **Comprehensive Form**: All branch fields with validation
- ✅ **Operating Hours**: Per-day schedules with open/close times
- ✅ **GPS Coordinates**: Latitude/longitude for map display
- ✅ **Status Management**: Active, Inactive, Coming Soon
- ✅ **Type Selection**: Mr Build or The Builder
- ✅ **Display Order**: Control order in public display
- ✅ **Form Validation**: Real-time validation with error messages

## 📂 File Structure

```
src/
├── types/
│   └── branch.ts                    # TypeScript interfaces and enums
├── lib/
│   ├── repositories/
│   │   └── branch.repository.ts     # Data access layer
│   └── services/
│       └── branch.service.ts        # Business logic layer
├── app/
│   ├── api/
│   │   ├── admin/
│   │   │   └── branches/
│   │   │       ├── route.ts         # Admin list/create/bulk delete
│   │   │       ├── [id]/route.ts    # Single branch CRUD
│   │   │       └── stats/route.ts   # Statistics endpoint
│   │   └── branches/
│   │       └── route.ts             # Public API (active branches only)
│   └── (admin)/
│       └── admin/
│           └── branches/
│               ├── page.tsx         # Branch list/management UI
│               ├── new/
│               │   └── page.tsx     # Create new branch
│               └── edit/
│                   └── [id]/
│                       └── page.tsx # Edit existing branch
├── components/
│   └── admin/
│       ├── BranchForm.tsx           # Reusable branch form component
│       └── AdminFooter.tsx          # Admin footer
└── (public)/
    └── components/
        └── BranchLocator/
            └── BranchMap/
                └── BranchMap.tsx    # Public map display

scripts/
└── init-branch-db.js                # Database seeding script
```

## 🗄️ Database Schema

### Branch Collection

```typescript
interface IBranch {
  _id?: string;
  branchName: string; // e.g., "Mr. Build Tzaneen"
  branchType: BranchType; // MR_BUILD | THE_BUILDER
  slug: string; // Auto-generated URL-friendly name
  status: BranchStatus; // ACTIVE | INACTIVE | COMING_SOON

  // Address
  address1: string;
  address2?: string;
  city: string;
  province: string;
  postalCode: string;

  // Contact
  email: string;
  telephone: string;

  // Location
  coordinates: {
    latitude: number;
    longitude: number;
  };

  // Operating Hours
  operatingHours: {
    monday: { open: string; close: string; closed: boolean };
    tuesday: { open: string; close: string; closed: boolean };
    wednesday: { open: string; close: string; closed: boolean };
    thursday: { open: string; close: string; closed: boolean };
    friday: { open: string; close: string; closed: boolean };
    saturday: { open: string; close: string; closed: boolean };
    sunday: { open: string; close: string; closed: boolean };
  };

  // Metadata
  isActive: boolean; // Public visibility flag
  displayOrder: number; // Sort order in public display
  createdAt: Date;
  updatedAt: Date;
}
```

### Enums

```typescript
enum BranchStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  COMING_SOON = 'COMING_SOON',
}

enum BranchType {
  MR_BUILD = 'MR_BUILD',
  THE_BUILDER = 'THE_BUILDER',
}
```

### Database Indexes

- **slug**: Unique index for URL-friendly lookups
- **branchName**: Text index for search functionality
- **status**: Filter index
- **branchType**: Filter index
- **city**: Search/filter index
- **province**: Search/filter index
- **isActive**: Public visibility filter
- **displayOrder**: Sorting index
- **createdAt**: Date sorting

## 🔌 API Endpoints

### Admin Endpoints (Protected)

#### 1. List/Create/Bulk Delete Branches

```
GET    /api/admin/branches
POST   /api/admin/branches
DELETE /api/admin/branches (bulk delete)
```

**GET Query Parameters:**

- `page`: Page number (default: 1)
- `pageSize`: Items per page (default: 10)
- `sortBy`: Field to sort by (default: 'displayOrder')
- `sortOrder`: 'asc' or 'desc' (default: 'asc')
- `search`: Search term for name/city/address
- `status`: Filter by status (ACTIVE, INACTIVE, COMING_SOON)
- `branchType`: Filter by type (MR_BUILD, THE_BUILDER)

**GET Response:**

```json
{
  "branches": [
    {
      "_id": "...",
      "branchName": "Mr. Build Tzaneen",
      "branchType": "MR_BUILD",
      "status": "ACTIVE",
      "city": "Tzaneen",
      ...
    }
  ],
  "total": 8,
  "totalPages": 1,
  "currentPage": 1,
  "pageSize": 10
}
```

**POST Request Body:**

```json
{
  "branchName": "Mr. Build New Location",
  "branchType": "MR_BUILD",
  "status": "ACTIVE",
  "address1": "123 Main Street",
  "city": "Polokwane",
  "province": "Limpopo",
  "postalCode": "0700",
  "email": "polokwane@mrbuild.co.za",
  "telephone": "015 123 4567",
  "coordinates": {
    "latitude": -23.9045,
    "longitude": 29.4689
  },
  "operatingHours": { ... },
  "isActive": true,
  "displayOrder": 0
}
```

**DELETE Request Body (Bulk Delete):**

```json
{
  "ids": ["id1", "id2", "id3"]
}
```

#### 2. Single Branch Operations

```
GET    /api/admin/branches/:id
PATCH  /api/admin/branches/:id
DELETE /api/admin/branches/:id
```

**GET Response:**

```json
{
  "branch": {
    "_id": "...",
    "branchName": "Mr. Build Tzaneen",
    ...
  }
}
```

**PATCH Request Body:**

```json
{
  "branchName": "Updated Name",
  "status": "INACTIVE",
  "isActive": false
}
```

#### 3. Branch Statistics

```
GET /api/admin/branches/stats
```

**Response:**

```json
{
  "stats": {
    "total": 8,
    "byStatus": {
      "ACTIVE": 6,
      "INACTIVE": 1,
      "COMING_SOON": 1
    },
    "byType": {
      "MR_BUILD": 6,
      "THE_BUILDER": 2
    },
    "active": 7,
    "inactive": 1
  }
}
```

### Public Endpoints

#### Get Active Branches

```
GET /api/branches
```

**Response:**

```json
{
  "branches": [
    {
      "_id": "...",
      "branchName": "Mr. Build Tzaneen",
      "branchType": "MR_BUILD",
      "city": "Tzaneen",
      "coordinates": {
        "latitude": -23.8323,
        "longitude": 30.1627
      },
      ...
    }
  ]
}
```

_Note: Only returns branches where `isActive: true` and `status: ACTIVE`_

## 🎨 Admin UI Usage

### Accessing Branch Management

1. Navigate to `/admin`
2. Click "Branch Management" card
3. Or go directly to `/admin/branches`

### Creating a New Branch

1. Click "+ Add Branch" button (top right)
2. Fill in all required fields (marked with \*)
3. Set operating hours for each day
4. Enter GPS coordinates (use Google Maps)
5. Click "Create Branch"

### Editing a Branch

**Method 1 - From List:**

1. Click the row of the branch you want to edit
2. Click "Edit Branch" button in the modal
3. Make changes
4. Click "Update Branch"

**Method 2 - From Dropdown:**

1. Click the "⋮" menu on the branch row
2. Select "Edit"
3. Make changes
4. Click "Update Branch"

### Filtering and Searching

- **Search**: Type in search box to filter by name, city, or address
- **Status Filter**: Select status from dropdown
- **Type Filter**: Select Mr Build or The Builder
- **Clear**: Click "Clear Filters" to reset

### Sorting

- Click any column header with ↕️ icon
- First click: ascending order (↑)
- Second click: descending order (↓)
- Sortable columns: Name, City, Type, Status, Order, Created, Updated

### Pagination

- Use page size selector: 5, 10, 20, or 50 per page
- Navigate with Previous/Next buttons
- See total count and current page

### Bulk Operations

1. Select branches using checkboxes
2. Click "Delete Selected" button
3. Confirm deletion
4. Selected branches will be removed

### Quick Actions (Dropdown Menu)

- **View**: Open detail modal
- **Edit**: Go to edit page
- **Toggle Active**: Activate/deactivate branch
- **Delete**: Remove branch (with confirmation)

## 🔧 Form Validation

### Required Fields

- Branch Name
- Address Line 1
- City
- Province
- Postal Code (must be 4 digits)
- Email (must be valid email format)
- Telephone (must contain only digits, spaces, and symbols)
- Latitude (must be a number)
- Longitude (must be a number)

### Validation Rules

- **Postal Code**: Exactly 4 digits
- **Email**: Standard email format (user@domain.com)
- **Telephone**: Digits, spaces, hyphens, parentheses, plus signs
- **Coordinates**: Valid decimal numbers

### Operating Hours

- Time format: HH:MM (24-hour)
- Can mark individual days as "Closed"
- Closed days ignore open/close times

## 📍 GPS Coordinates

### Finding Coordinates

1. Open Google Maps
2. Search for the branch address
3. Right-click on the exact location
4. Select the coordinates (they'll be copied)
5. Paste into Latitude and Longitude fields

**Example Coordinates:**

- Tzaneen: `-23.8323, 30.1627`
- Polokwane: `-23.9045, 29.4689`
- Musina: `-22.3402, 30.0411`

## 🔄 Status Management

### Branch Statuses

- **ACTIVE**: Branch is operational and visible
- **INACTIVE**: Branch is temporarily closed (still visible in admin)
- **COMING_SOON**: Branch is planned but not yet open

### Active Flag

- Separate from status
- Controls public visibility
- `isActive: false` hides branch from public map
- Use for testing or preparation

## 🎯 Display Order

The `displayOrder` field controls the sort order in public displays:

- Lower numbers appear first
- Default is 0
- Negative numbers allowed
- Use for featured branches

**Example:**

```
displayOrder: -1  → Featured (shows first)
displayOrder: 0   → Normal
displayOrder: 10  → Less prominent
```

## 🗺️ Public Map Integration

The public branch locator automatically fetches branches from the API and displays them on an interactive map.

**File**: `src/app/(public)/components/BranchLocator/BranchMap/BranchMap.tsx`

### How It Works

1. Component fetches from `/api/branches` on mount
2. Only active branches are returned
3. Branches are mapped to map markers
4. Clicking a marker shows branch details

### Data Flow

```
Admin creates/edits branch
     ↓
Saved to MongoDB
     ↓
Public API endpoint filters active branches
     ↓
BranchMap fetches and displays on map
     ↓
Users see updated branch locations
```

## 🛠️ Database Seeding

### Seeding Sample Data

```bash
# Seed initial branches (8 branches)
node scripts/init-branch-db.js
```

### Seed Script Output

```
Connecting to MongoDB...
📊 Creating indexes...
✅ Indexes created successfully
📥 Inserting initial branches...
✅ Successfully inserted 8 branches
📋 Branch Summary:
  Mr Build: 6 branches
  The Builder: 2 branches
✅ Branch database initialization complete!
```

### Seeded Branches

- Mr. Build Tzaneen
- Mr. Build Louis Trichardt
- Mr. Build Musina
- Mr. Build Giyani
- Mr. Build Sibasa
- Mr. Build Thohoyandou
- The Builder Thohoyandou
- The Builder Giyani

## 🐛 Troubleshooting

### Branch Not Appearing on Map

1. Check `isActive` is true
2. Check `status` is ACTIVE
3. Verify coordinates are correct
4. Check browser console for errors
5. Clear browser cache

### Cannot Edit Branch

1. Verify you're logged in as admin
2. Check NextAuth session is valid
3. Check API endpoint permissions
4. Look for errors in Network tab

### Validation Errors

1. All required fields must be filled
2. Postal code must be exactly 4 digits
3. Email must be valid format
4. Coordinates must be numbers

### Search Not Working

1. Check MongoDB text indexes exist
2. Try clearing filters first
3. Use simple search terms
4. Check for special characters

## 📊 Best Practices

### Branch Management

- Keep branch names consistent (e.g., "Mr. Build [City]")
- Use proper capitalization
- Include complete address information
- Verify GPS coordinates are accurate
- Set realistic operating hours

### Status Usage

- Use INACTIVE for temporary closures
- Use COMING_SOON for planned locations
- Set isActive to false when testing

### Display Order

- Use consistent numbering scheme
- Leave gaps for future insertions
- Group by region if needed

### Data Quality

- Double-check phone numbers
- Verify email addresses work
- Test coordinates on Google Maps
- Keep operating hours current

## 🔐 Security

### Admin Protection

- All admin routes require authentication
- NextAuth session validation on all requests
- CRUD operations are admin-only
- Public API returns filtered data only

### Data Validation

- Server-side validation on all inputs
- Type checking with TypeScript
- MongoDB schema validation
- Sanitized search queries

## 📈 Performance

### Optimizations

- MongoDB indexes for fast queries
- Pagination to limit data transfer
- Public API cached with revalidation
- Efficient text search on indexed fields

### Caching Strategy

```typescript
export const revalidate = 3600; // 1 hour cache
```

Public branches are cached for 1 hour, reducing database load while keeping data fresh.

## 🎓 Quick Reference

### Common Tasks

**Add a Branch**

```
/admin/branches → + Add Branch → Fill form → Create Branch
```

**Edit a Branch**

```
/admin/branches → Click row → Edit Branch → Update → Update Branch
```

**Activate/Deactivate**

```
/admin/branches → Click row → Activate/Deactivate button
```

**Bulk Delete**

```
/admin/branches → Select checkboxes → Delete Selected → Confirm
```

**Search Branches**

```
/admin/branches → Type in search box → Auto-filters
```

**View Statistics**

```
/admin/branches → See stats cards at top
```

## 🚀 Future Enhancements

Potential features for future development:

- [ ] Image uploads for branches
- [ ] Google Maps integration in form
- [ ] Branch manager assignment
- [ ] Email notifications for branch updates
- [ ] Export branch data (CSV/Excel)
- [ ] Import branches from file
- [ ] Bulk edit functionality
- [ ] Branch performance analytics
- [ ] Customer reviews per branch
- [ ] Stock levels per branch

## 📞 Support

For issues or questions:

1. Check this documentation first
2. Review the code comments
3. Check console for error messages
4. Verify database connection
5. Test API endpoints directly

---

**Last Updated**: October 2025
**Version**: 1.0.0
**Status**: ✅ Production Ready
