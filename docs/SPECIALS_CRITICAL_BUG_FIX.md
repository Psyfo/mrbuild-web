# Critical Bug Fix: Partial Updates Clearing Fields

## Problem Description

**CRITICAL BUG:** When making partial updates to specials (e.g., changing status or toggling visibility), all other fields were being set to `null` or cleared in the database.

### User-Reported Issues

1. ✗ Changing status clears all other properties
2. ✗ Toggling "Show/Hide" resets special to hidden state
3. ✗ Fields become `null` in database after any update
4. ✗ Special becomes unusable after status change

### Root Cause

The PATCH endpoint was destructuring all possible fields from the request body:

```typescript
// BEFORE (BROKEN) ❌
const {
  title,
  description,
  image,
  status,
  displayOrder,
  validFrom,
  validUntil,
  isActive,
} = body;

// This created variables with undefined values for fields not in the request
// Then passed ALL of them to the update function
special = await specialService.updateSpecial(params.id, {
  title, // undefined if not in request
  description, // undefined if not in request
  status, // only this was sent
  displayOrder, // undefined if not in request
  validFrom: validFrom ? new Date(validFrom) : undefined,
  validUntil: validUntil ? new Date(validUntil) : undefined,
  isActive, // undefined if not in request
});
```

**Result:** MongoDB's `$set` operator set all these undefined fields to `null`, clearing existing data! 💥

## Solution Implemented

### 1. API Endpoint Fix (Primary Fix)

**File:** `src/app/api/admin/specials/[id]/route.ts`

Changed to **only send fields that are explicitly provided** in the request:

```typescript
// AFTER (FIXED) ✅
const body = await request.json();

// Build updates object with only provided fields
const updates: Record<string, any> = {};

// Only include fields that are explicitly provided in the request
if (body.hasOwnProperty('title')) updates.title = body.title;
if (body.hasOwnProperty('description')) updates.description = body.description;
if (body.hasOwnProperty('status')) updates.status = body.status;
if (body.hasOwnProperty('displayOrder'))
  updates.displayOrder = body.displayOrder;
if (body.hasOwnProperty('isActive')) updates.isActive = body.isActive;

// Handle date fields with proper conversion
if (body.hasOwnProperty('validFrom')) {
  updates.validFrom = body.validFrom ? new Date(body.validFrom) : null;
}
if (body.hasOwnProperty('validUntil')) {
  updates.validUntil = body.validUntil ? new Date(body.validUntil) : null;
}

// Now only send fields that were actually in the request
special = await specialService.updateSpecial(params.id, updates);
```

**Key Change:** Using `hasOwnProperty()` to check if a field exists in the request body before including it in the updates object.

### 2. Repository Layer Defense (Secondary Protection)

**File:** `src/lib/repositories/special.repository.ts`

Added additional filtering to remove any `undefined` values before database update:

```typescript
// AFTER (DEFENSIVE) ✅
export async function update(
  id: string,
  updates: Partial<ISpecialInput>
): Promise<ISpecial | null> {
  const db = await getDatabase();
  const collection = db.collection<ISpecial>(COLLECTION_NAME);

  // Filter out undefined values to prevent clearing fields
  const cleanUpdates: any = {};
  Object.keys(updates).forEach((key) => {
    const value = (updates as any)[key];
    if (value !== undefined) {
      cleanUpdates[key] = value;
    }
  });

  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(id) as any },
    {
      $set: {
        ...cleanUpdates,
        updatedAt: new Date(),
      },
    },
    { returnDocument: 'after' }
  );

  // ... rest of function
}
```

**Key Change:** Double-checking to filter out any `undefined` values before passing to MongoDB.

## How Partial Updates Work Now

### Example 1: Status Change Only

**Request:**

```json
PATCH /api/admin/specials/123
{
  "status": "ACTIVE"
}
```

**What Happens:**

```typescript
// API builds updates object
const updates = {
  status: 'ACTIVE', // Only this field
};

// MongoDB updates only status field
db.collection.findOneAndUpdate(
  { _id: ObjectId('123') },
  {
    $set: {
      status: 'ACTIVE',
      updatedAt: new Date(),
    },
  }
);
```

**Result:** ✅ Only `status` and `updatedAt` are modified. All other fields remain unchanged!

### Example 2: Visibility Toggle

**Request:**

```json
PATCH /api/admin/specials/123
{
  "isActive": false
}
```

**What Happens:**

```typescript
const updates = {
  isActive: false, // Only this field
};
```

**Result:** ✅ Only `isActive` and `updatedAt` are modified!

### Example 3: Full Form Update

**Request:**

```json
PATCH /api/admin/specials/123
{
  "title": "New Title",
  "description": "New Description",
  "status": "ACTIVE",
  "displayOrder": 5,
  "validFrom": "2025-01-01",
  "validUntil": "2025-12-31",
  "isActive": true
}
```

**What Happens:**

```typescript
const updates = {
  title: 'New Title',
  description: 'New Description',
  status: 'ACTIVE',
  displayOrder: 5,
  validFrom: new Date('2025-01-01'),
  validUntil: new Date('2025-12-31'),
  isActive: true,
};
```

**Result:** ✅ All provided fields are updated!

## Testing the Fix

### Test Case 1: Status Change Preserves Other Fields

1. Create a special with all fields populated
2. Note the `title`, `description`, `validFrom`, etc.
3. Change status via dropdown menu
4. ✅ Verify: Only `status` changed, all other fields intact

### Test Case 2: Visibility Toggle Preserves Other Fields

1. Create a special with all fields populated
2. Note all field values
3. Toggle "Show/Hide" in actions menu
4. ✅ Verify: Only `isActive` changed, all other fields intact

### Test Case 3: Display Order Change Preserves Other Fields

1. Create a special with all fields populated
2. Use ▲▼ buttons to reorder
3. ✅ Verify: Only `displayOrder` changed, all other fields intact

### Test Case 4: Full Edit Works

1. Navigate to Edit page
2. Change multiple fields
3. Save form
4. ✅ Verify: All changed fields updated correctly

## Edit Page Confirmation

The edit page exists and works correctly:

**Path:** `/admin/specials/edit/[id]`

**File:** `src/app/(admin)/admin/specials/edit/[id]/page.tsx`

**Features:**

- ✅ Fetches existing special data
- ✅ Pre-populates form with current values
- ✅ Reuses SpecialForm component with `isEdit={true}`
- ✅ Shows proper heading "Edit Special"
- ✅ Back button to return to specials list
- ✅ Properly handles image updates (optional)

**To Access:**

1. Go to Admin → Specials Management
2. Click actions menu (⋮) on any special
3. Click "Edit"
4. Edit page loads with pre-filled form

## Database Validation

### Check for Corrupted Data

If you have specials with null fields from before the fix:

```javascript
// MongoDB query to find corrupted specials
db.specials.find({
  $or: [
    { title: null },
    { title: { $exists: false } },
    { status: null },
    { displayOrder: null },
  ],
});
```

### Fix Corrupted Data

If you find corrupted records, you can restore them from backups or manually fix:

```javascript
// Example: Restore missing values
db.specials.updateOne(
  { _id: ObjectId('123') },
  {
    $set: {
      title: 'Restored Title',
      status: 'ACTIVE',
      displayOrder: 0,
      isActive: true,
    },
  }
);
```

## Prevention Measures

### API Design Pattern

**Always use this pattern for partial updates:**

```typescript
// ✅ GOOD: Build updates from body properties
const updates: Record<string, any> = {};
if (body.hasOwnProperty('field1')) updates.field1 = body.field1;
if (body.hasOwnProperty('field2')) updates.field2 = body.field2;

// ✅ GOOD: Pass only provided fields
await service.update(id, updates);
```

```typescript
// ❌ BAD: Destructure all possible fields
const { field1, field2, field3, field4 } = body;
await service.update(id, { field1, field2, field3, field4 });
```

### Repository Layer Pattern

**Always filter out undefined:**

```typescript
// ✅ GOOD: Filter before database operation
const cleanUpdates = {};
Object.keys(updates).forEach((key) => {
  if (updates[key] !== undefined) {
    cleanUpdates[key] = updates[key];
  }
});

await db.collection.updateOne({ _id }, { $set: cleanUpdates });
```

## Related Issues Fixed

This fix also resolves:

1. ✅ Status changes working correctly
2. ✅ Visibility toggle working correctly
3. ✅ Display order changes working correctly
4. ✅ Full form updates working correctly
5. ✅ Image updates working correctly (with or without image change)
6. ✅ Date field updates working correctly

## Future Improvements

### Consider Adding

1. **Optimistic UI Updates** - Update UI immediately before API call
2. **Change History** - Track what fields changed in each update
3. **Validation Middleware** - Validate updates before reaching service layer
4. **Type-safe Updates** - Use TypeScript utility types for partial updates
5. **Audit Logging** - Log all updates with user and timestamp

### Example: Type-safe Partial Updates

```typescript
// Define allowed update fields
type SpecialUpdateFields = Pick<
  ISpecial,
  | 'title'
  | 'description'
  | 'status'
  | 'displayOrder'
  | 'validFrom'
  | 'validUntil'
  | 'isActive'
>;

// Type-safe updates object
const updates: Partial<SpecialUpdateFields> = {};
```

## Summary

✅ **API endpoint fixed** - Only sends explicitly provided fields  
✅ **Repository layer protected** - Filters out undefined values  
✅ **Edit page confirmed working** - Full form updates work correctly  
✅ **Partial updates work** - Status, visibility, order changes preserve other fields  
✅ **Database safe** - No more null fields from updates  
✅ **Pattern documented** - Follow this for all future PATCH endpoints

**The critical bug is now fixed!** All partial updates (status changes, visibility toggles, reordering) now work correctly without clearing other fields. 🎉
