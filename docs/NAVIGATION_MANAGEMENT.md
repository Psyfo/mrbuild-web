# Dynamic Navigation System

## Overview

The navigation system is now fully dynamic and managed through the admin panel. Navigation items are stored in MongoDB and can be created, edited, reordered, and toggled on/off.

## Features

### Admin Management

- ✅ Create new navigation items
- ✅ Edit existing items (label, link, order)
- ✅ Reorder items with up/down arrows
- ✅ Toggle active/inactive status
- ✅ Delete navigation items
- ✅ Support for internal (#anchors, /paths) and external links
- ✅ Option to open links in new tab

### Public Display

- ✅ Fetches active navigation items from API
- ✅ Maintains existing animations and styling
- ✅ Supports both mobile and desktop navigation
- ✅ Auto-detects external links

## Database Schema

```typescript
{
  _id: ObjectId,
  label: string,          // Display text (e.g., "About", "Services")
  href: string,           // URL/anchor (e.g., "#about", "/page", "https://...")
  order: number,          // Display order (1, 2, 3...)
  isActive: boolean,      // Show/hide in navigation
  openInNewTab: boolean,  // For external links
  isExternal: boolean,    // Internal vs external link
  createdAt: Date,
  updatedAt: Date
}
```

## Setup Instructions

### 1. Seed Initial Navigation

Run the seed script to populate default navigation items:

```powershell
node scripts/seed-navigation.js
```

This will create the default navigation:

1. About → #about
2. Services → #services
3. Brands → #brands
4. Specials → #specials
5. Branch Locator → #branch-locator
6. Contact → #contact

### 2. Access Admin Panel

Navigate to: `http://localhost:3001/admin/navigation`

## Admin Interface

### Navigation Management Page

- **URL**: `/admin/navigation`
- **Features**:
  - Table view of all navigation items
  - Order column with up/down arrows
  - Status badges (Active/Inactive)
  - Type badges (Internal/External)
  - Actions dropdown (Edit, Toggle, Delete)

### Creating New Items

1. Click "Add Navigation Item"
2. Fill in the form:
   - **Label**: Display text
   - **Link**: URL/anchor (auto-detects external)
   - **Order**: Display position
   - **Checkboxes**: Active, External, Open in New Tab
3. Click "Create Navigation"

### Editing Items

1. Click "..." in Actions column
2. Select "Edit"
3. Modify fields
4. Click "Update Navigation"

### Reordering

- Use up/down arrows in Order column
- Items update immediately
- Changes reflected on public site

## API Endpoints

### Public API

```
GET /api/navigation
Returns: { navigation: INavigation[], hasActiveNavigation: boolean, count: number }
```

### Admin APIs

```
GET    /api/admin/navigation        - List all navigation items
POST   /api/admin/navigation        - Create new item
GET    /api/admin/navigation/[id]   - Get single item
PATCH  /api/admin/navigation/[id]   - Update item
DELETE /api/admin/navigation/[id]   - Delete item
```

## Header Component

### Dynamic Fetching

The Header component now fetches navigation from the API on mount:

```typescript
useEffect(() => {
  const fetchNavigation = async () => {
    const response = await fetch('/api/navigation');
    const data = await response.json();
    setNavItems(data.navigation || []);
  };
  fetchNavigation();
}, []);
```

### Link Rendering

- **Internal anchors**: `href="#section"`
- **Internal pages**: `href="/page"`
- **External links**: `href="https://..."` with `target="_blank"`

## File Structure

```
src/
├── types/
│   └── navigation.ts                    # TypeScript interfaces
├── lib/
│   ├── repositories/
│   │   └── navigation.repository.ts     # Data access layer
│   └── services/
│       └── navigation.service.ts        # Business logic
├── app/
│   ├── api/
│   │   ├── navigation/
│   │   │   └── route.ts                 # Public API
│   │   └── admin/
│   │       └── navigation/
│   │           ├── route.ts             # Admin list/create
│   │           └── [id]/
│   │               └── route.ts         # Admin single item
│   ├── (admin)/
│   │   └── admin/
│   │       └── navigation/
│   │           ├── page.tsx             # Management list page
│   │           ├── new/
│   │           │   └── page.tsx         # Create new item
│   │           ├── edit/
│   │           │   └── [id]/
│   │           │       └── page.tsx     # Edit item
│   │           └── components/
│   │               └── NavigationForm.tsx # Reusable form
│   └── (public)/
│       └── components/
│           └── Header/
│               └── Header.tsx           # Dynamic header
└── scripts/
    └── seed-navigation.js               # Initial seed script
```

## Common Tasks

### Add New Navigation Item

1. Admin → Navigation Management
2. Click "Add Navigation Item"
3. Enter details
4. Save

### Change Order

1. Use up/down arrows in Order column
2. Changes apply immediately

### Hide Item Temporarily

1. Click "..." → "Deactivate"
2. Item removed from public navigation
3. Click "Activate" to restore

### External Link Example

```
Label: "Instagram"
Link: https://instagram.com/mrbuild
☑ Open in new tab
☑ External link
```

## Benefits

1. **No Code Changes**: Update navigation without editing code
2. **Flexible**: Support internal sections, pages, and external links
3. **User-Friendly**: Intuitive admin interface
4. **SEO Friendly**: Control exactly what appears in navigation
5. **Temporary Changes**: Easy to hide/show items without deletion
6. **Analytics Ready**: Can track click-through rates per item

## Migration Notes

- Existing hardcoded navigation: `['About', 'Services', 'Brands', 'Specials', 'Branch Locator', 'Contact']`
- All items migrated to database via seed script
- Header component updated to fetch dynamically
- No breaking changes to styling or animations

## Future Enhancements

Potential additions:

- Sub-menu/dropdown support
- Icon support for nav items
- Analytics/click tracking
- A/B testing different nav structures
- Conditional visibility (logged in/out)
- Multi-language support
