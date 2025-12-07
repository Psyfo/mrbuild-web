# Specials Management - Polish Updates

## 🔧 Updates Applied

### 1. ✅ Swiper Loop Fix

**Issue**: Swiper was showing an error when there weren't enough slides for loop mode:

```
The number of slides is not enough for loop mode
```

**Solution**:

- Loop mode now only enables when there are 3 or more specials
- `slidesPerView` dynamically adjusts based on actual number of specials
- Prevents error when displaying 1-2 specials

**Code Changes**: `src/app/(public)/components/SpecialsSection/SpecialsSlider/SpecialsSlider.tsx`

```typescript
// Enable loop only if we have enough slides
const enableLoop = specials.length >= 3;

breakpoints={{
  768: {
    slidesPerView: Math.min(2, specials.length), // Max 2 or actual count
  },
  1024: {
    slidesPerView: Math.min(3, specials.length), // Max 3 or actual count
  },
}}
loop={enableLoop}
```

---

### 2. ✅ Date Validation

**Issue**: Dates were optional but if one was provided, the other could be left empty, causing potential issues.

**Solution**:

- Both dates must be provided together, or both left empty
- Clear validation messages
- Updated UI description to explain requirement

**Validation Rules**:

- If `validFrom` is set → `validUntil` is required
- If `validUntil` is set → `validFrom` is required
- If both are set → `validUntil` must be after `validFrom`

**Code Changes**: `src/components/admin/SpecialForm.tsx`

```typescript
// Date validation: if one date is provided, both must be provided
if (validFrom && !validUntil) {
  newErrors.validUntil = 'Valid Until is required when Valid From is set';
}
if (validUntil && !validFrom) {
  newErrors.validFrom = 'Valid From is required when Valid Until is set';
}

// If both dates are provided, validate the range
if (validFrom && validUntil) {
  const from = new Date(validFrom);
  const until = new Date(validUntil);
  if (from >= until) {
    newErrors.validUntil = 'Valid Until must be after Valid From';
  }
}
```

**UI Updates**:

- Card description now says: "Both dates must be provided together, or leave both empty"
- Error messages show on both fields if validation fails

---

### 3. ✅ Sophisticated Display Order Management

**Issue**: Users had to remember order numbers when creating specials.

**Solution**:

1. **Auto-increment on creation** - New specials automatically get the next available number
2. **Visual reordering with arrows** - Up/Down buttons in the specials list
3. **Disabled manual entry** - No need to type order numbers

**Features**:

#### A. Auto Display Order

- When creating a new special, the system automatically fetches the highest existing order
- Sets the new special's order to `highest + 1`
- No manual input needed

**Code**: `src/components/admin/SpecialForm.tsx`

```typescript
useEffect(() => {
  if (!isEdit && !displayOrder) {
    const fetchNextOrder = async () => {
      const response = await fetch(
        '/api/admin/specials?pageSize=1&sortBy=displayOrder&sortOrder=desc'
      );
      const data = await response.json();
      const highestOrder = data.specials[0]?.displayOrder ?? -1;
      setDisplayOrder((highestOrder + 1).toString());
    };
    fetchNextOrder();
  }
}, [isEdit]);
```

#### B. Visual Reordering

- Each special in the list has ▲ (up) and ▼ (down) buttons
- Clicking moves the special up or down in the order
- Buttons disabled when at top/bottom
- Swaps display order with adjacent special

**UI Layout**:

```
Order Column:
┌──────────────────┐
│  0  ▲           │  ← First item (up disabled)
│     ▼           │
├──────────────────┤
│  1  ▲           │  ← Middle item (both enabled)
│     ▼           │
├──────────────────┤
│  2  ▲           │  ← Last item (down disabled)
│     ▼ (disabled)│
└──────────────────┘
```

**Code**: `src/app/(admin)/admin/specials/page.tsx`

```typescript
// Move up: swap with special above
const moveUp = async (id: string, currentOrder: number) => {
  const currentIndex = specials.findIndex((s) => s._id === id);
  if (currentIndex === 0) return; // Already at top

  const specialAbove = specials[currentIndex - 1];

  // Swap orders
  await Promise.all([
    updateSpecialOrder(id, specialAbove.displayOrder),
    updateSpecialOrder(specialAbove._id, currentOrder),
  ]);

  fetchSpecials(); // Refresh list
};

// Move down: swap with special below
const moveDown = async (id: string, currentOrder: number) => {
  const currentIndex = specials.findIndex((s) => s._id === id);
  if (currentIndex === specials.length - 1) return; // Already at bottom

  const specialBelow = specials[currentIndex + 1];

  // Swap orders
  await Promise.all([
    updateSpecialOrder(id, specialBelow.displayOrder),
    updateSpecialOrder(specialBelow._id, currentOrder),
  ]);

  fetchSpecials(); // Refresh list
};
```

**Table Cell**:

```tsx
<TableCell onClick={(e) => e.stopPropagation()}>
  <div className='flex items-center gap-2'>
    <span className='min-w-[30px]'>{special.displayOrder}</span>
    <div className='flex flex-col gap-1'>
      <Button
        variant='ghost'
        size='sm'
        onClick={() => moveUp(special._id!, special.displayOrder)}
        disabled={isFirstItem}
        title='Move up'
      >
        ▲
      </Button>
      <Button
        variant='ghost'
        size='sm'
        onClick={() => moveDown(special._id!, special.displayOrder)}
        disabled={isLastItem}
        title='Move down'
      >
        ▼
      </Button>
    </div>
  </div>
</TableCell>
```

#### C. Form Field Updates

- Display order field is now **disabled** (read-only)
- Helper text updated: "Order is auto-assigned. Use ▲▼ buttons in the specials list to reorder after creation."

---

## 📝 User Workflow

### Creating a Special

1. Go to `/admin/specials`
2. Click "+ Add Special"
3. Fill in title, upload image
4. **Display order is auto-assigned** (no manual input)
5. Optionally set date range (both dates or neither)
6. Click "Create Special"

### Reordering Specials

1. Go to `/admin/specials`
2. Find the special you want to move
3. Click ▲ to move up (earlier in slider)
4. Click ▼ to move down (later in slider)
5. Order updates immediately

**Example**:

```
Before:          After clicking ▼ on "Spring Sale":
0: Spring Sale   0: Summer Promo
1: Summer Promo  1: Spring Sale
2: Fall Deals    2: Fall Deals
```

---

## 🎯 Benefits

### For Users

- ✅ **No number memorization** - System handles order automatically
- ✅ **Visual feedback** - See position change immediately
- ✅ **Simple interaction** - Just click arrows
- ✅ **Error prevention** - Can't move beyond bounds
- ✅ **Date validation** - Clear rules for date ranges

### For Administrators

- ✅ **Less confusion** - No need to explain order numbers
- ✅ **Fewer mistakes** - Auto-assignment prevents gaps in sequence
- ✅ **Better UX** - Intuitive up/down controls
- ✅ **Data integrity** - Validation ensures dates make sense

---

## 🧪 Testing Checklist

### Swiper Fix

- [ ] Create 1 special → No loop error, no nav buttons if only 1 slide
- [ ] Create 2 specials → No loop error, shows both slides
- [ ] Create 3+ specials → Loop enabled, autoplay works
- [ ] Responsive: Check mobile (1 per view), tablet (2 per view), desktop (3 per view)

### Date Validation

- [ ] Try setting only Valid From → Error shows on Valid Until
- [ ] Try setting only Valid Until → Error shows on Valid From
- [ ] Set Valid From after Valid Until → Error shows
- [ ] Set both dates correctly → No errors, saves successfully
- [ ] Leave both dates empty → No errors, saves successfully

### Display Order

- [ ] Create first special → Gets order 0
- [ ] Create second special → Gets order 1
- [ ] Create third special → Gets order 2
- [ ] Move first special down → Swaps to position 1
- [ ] Move last special up → Swaps to previous position
- [ ] Try to move first special up → Button disabled
- [ ] Try to move last special down → Button disabled
- [ ] Check public slider → Specials appear in correct order

---

## 🔍 Troubleshooting

### Swiper still showing warnings

**Check**:

1. Are you testing with at least 1 special?
2. Is the API returning specials correctly?
3. Clear browser cache and refresh

### Date validation not working

**Check**:

1. Are you using the latest form component?
2. Check browser console for errors
3. Verify both date inputs have validation styling

### Reorder buttons not working

**Check**:

1. Are you clicking in the Order column?
2. Check network tab for PATCH requests
3. Verify specials refresh after reorder
4. Check for console errors

### Display order not auto-assigning

**Check**:

1. Is the API endpoint responding?
2. Check network tab for fetch request on form load
3. Verify field shows a number after load
4. Check console for fetch errors

---

## 📚 Technical Details

### Files Modified

1. `src/app/(public)/components/SpecialsSection/SpecialsSlider/SpecialsSlider.tsx`

   - Added loop enablement logic
   - Dynamic slidesPerView based on count

2. `src/components/admin/SpecialForm.tsx`

   - Added date validation (both or neither)
   - Added auto-fetch for next display order
   - Disabled manual display order input
   - Updated helper text

3. `src/app/(admin)/admin/specials/page.tsx`
   - Added `moveUp()` function
   - Added `moveDown()` function
   - Updated Order column with arrow buttons
   - Added click handlers for reordering

### API Endpoints Used

- `GET /api/admin/specials?pageSize=1&sortBy=displayOrder&sortOrder=desc` - Get highest order
- `PATCH /api/admin/specials/[id]` - Update display order

### Dependencies

- No new dependencies added
- Uses existing UI components (Button, Input, etc.)
- Uses existing API routes

---

## ✨ Summary

All three polish issues resolved:

1. **Swiper Loop Warning** → Fixed with conditional loop and dynamic slidesPerView
2. **Date Validation** → Added "both or neither" rule with clear error messages
3. **Display Order Management** → Auto-assignment + visual ▲▼ reordering

The system is now more user-friendly and intuitive! 🎉
