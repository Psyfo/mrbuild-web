# Edit Page Access Guide

## ⚠️ Important: Port Information

Your development server is running on **PORT 3001**, not 3000!

```
✓ Next.js 14.2.30
  - Local:        http://localhost:3001  ← USE THIS PORT
```

## Correct URLs

### ❌ Wrong URL (404 Error)

```
http://localhost:3000/admin/specials/edit/68f4ef9e49069ef1f22da47c
```

### ✅ Correct URL

```
http://localhost:3001/admin/specials/edit/68f4ef9e49069ef1f22da47c
```

## How to Access Edit Page

### Method 1: From Specials List (Recommended)

1. Go to: `http://localhost:3001/admin/specials`
2. Find the special you want to edit
3. Click the actions menu (⋮)
4. Click "Edit"
5. ✅ Automatically navigates to correct edit URL

### Method 2: Direct URL

1. Get the special ID from the list page
2. Navigate to: `http://localhost:3001/admin/specials/edit/[ID]`
3. Example: `http://localhost:3001/admin/specials/edit/68f4ef9e49069ef1f22da47c`

## Troubleshooting

### Problem: 404 Not Found

**Check These:**

1. **Using Correct Port?**

   - ❌ Port 3000 → NOT FOUND
   - ✅ Port 3001 → Works

2. **Valid Special ID?**

   ```bash
   # ID must be a valid MongoDB ObjectId (24 hex characters)
   # Example: 68f4ef9e49069ef1f22da47c
   ```

3. **Logged In as Admin?**

   - Must be authenticated
   - Check if redirected to `/login`
   - Sign in with admin credentials

4. **Special Exists in Database?**
   - ID might be for a deleted special
   - Try from the list page instead

### Problem: Special Not Loading

**Possible Causes:**

1. **Special Deleted**

   - The special might have been deleted
   - Check the specials list first

2. **Database Connection**

   - Check MongoDB is running
   - Verify connection string in `.env.local`

3. **Session Expired**
   - Log out and log back in
   - Clear browser cookies

### Problem: Can't Save Edits

**Check:**

1. Form validation errors (shown in red)
2. Network tab in browser DevTools
3. Console for JavaScript errors
4. All required fields filled

## Quick Test

Try these URLs on **PORT 3001**:

1. **Admin Dashboard:**

   ```
   http://localhost:3001/admin
   ```

2. **Specials List:**

   ```
   http://localhost:3001/admin/specials
   ```

3. **New Special:**

   ```
   http://localhost:3001/admin/specials/new
   ```

4. **Edit Special** (replace ID with real one):
   ```
   http://localhost:3001/admin/specials/edit/[YOUR-SPECIAL-ID]
   ```

## Getting a Valid Special ID

### From Browser (Recommended)

1. Go to `http://localhost:3001/admin/specials`
2. Right-click a special row
3. Click "Inspect"
4. Look for `_id` or `data-id` in the HTML
5. Copy the 24-character ID

### From Database

```javascript
// MongoDB query
db.specials.find({}, { _id: 1, title: 1 }).limit(5)

// Output example:
{
  "_id": ObjectId("68f4ef9e49069ef1f22da47c"),
  "title": "January Specials"
}
```

## Edit Page Features

Once you successfully access the edit page, you'll see:

### Header

- ← Back button (returns to list)
- "Edit Special" title
- "Update promotional brochure details" subtitle

### Form Sections

1. **Basic Information**

   - Title (required)
   - Description (optional)
   - Status dropdown
   - Display Order (disabled, use arrows in list)

2. **Validity Period**

   - Valid From date
   - Valid Until date
   - Both or neither required

3. **Image**

   - Current image preview
   - Upload new image (optional)
   - Replaces old image if uploaded

4. **Visibility**
   - Active checkbox
   - Controls public visibility

### Actions

- **Cancel** - Returns to list without saving
- **Save** - Saves changes and returns to list

## Common Workflows

### Edit Special Title

1. Navigate to edit page (port 3001!)
2. Change title field
3. Click Save
4. ✅ Redirected to list with success message

### Replace Image

1. Navigate to edit page
2. Click "Choose File" under Image
3. Select new image
4. Preview appears
5. Click Save
6. ✅ Old image deleted, new image uploaded

### Change Status

**Option 1: From List (Faster)**

- Click actions menu → Change Status → Pick status

**Option 2: From Edit Page**

- Open edit page
- Change Status dropdown
- Click Save

### Update Dates

1. Navigate to edit page
2. Set both Valid From and Valid Until
3. Ensure Valid Until is after Valid From
4. Click Save

## Port Issues

### Why Port 3001?

Port 3000 is already in use by another application on your system.

**To Use Port 3000:**

1. Stop the other application using port 3000
2. Stop your dev server (Ctrl+C)
3. Run `npm run dev` again
4. Should now use port 3000

**To Force a Specific Port:**

```json
// package.json
{
  "scripts": {
    "dev": "next dev -p 3002"
  }
}
```

### Check Current Port

Look for this in terminal output:

```
✓ Ready in 2.4s
  - Local:        http://localhost:XXXX  ← This is your port
```

## Summary

✅ **Use Port 3001:** `http://localhost:3001`  
✅ **Edit URL Format:** `/admin/specials/edit/[24-char-id]`  
✅ **Best Access Method:** Via actions menu in list page  
✅ **Direct Service Import:** Server-side fetching now works correctly

**The edit page is working!** Just make sure you're using the correct port (3001). 🎉
