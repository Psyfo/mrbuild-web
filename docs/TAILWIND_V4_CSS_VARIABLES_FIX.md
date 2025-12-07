# Tailwind v4 CSS Variables Fix

## Problem

After migrating to Tailwind CSS v4, shadcn/ui components (cards, buttons, inputs, etc.) appeared **transparent** with no backgrounds or borders.

---

## Root Cause

Tailwind v4 handles CSS variables differently than v3. The issue was:

1. **In `@theme` block**: Variables were defined as raw HSL values (e.g., `--color-card: 0 0% 100%`)
2. **Tailwind v4 requirement**: Color values in `@theme` need to be wrapped in `hsl()` function
3. **shadcn components**: Use both Tailwind utilities (`bg-card`) AND `hsl(var(--card))` pattern

---

## Solution

### Dual Variable Setup

#### 1. In `@theme` block (for Tailwind utilities):

```css
@theme {
  /* Wrapped in hsl() so Tailwind v4 can use them */
  --color-background: hsl(0 0% 100%);
  --color-card: hsl(0 0% 100%);
  --color-primary: hsl(0 0% 9%);
  /* ... etc */
}
```

#### 2. In `:root` (for hsl(var()) pattern):

```css
:root {
  /* Raw HSL values for use in hsl(var()) */
  --background: 0 0% 100%;
  --card: 0 0% 100%;
  --primary: 0 0% 9%;
  /* ... etc */
}
```

---

## Why Both Are Needed

### Tailwind Utilities (`bg-card`, `text-primary`)

- Read from `@theme` block
- Need full color values like `hsl(0 0% 100%)`
- Used when you write `className="bg-card"`

### HSL Pattern (`hsl(var(--card))`)

- Used directly in component styles
- Expects raw HSL values from `:root`
- Used in custom CSS or inline styles

---

## What's Fixed

✅ **Cards** - White background visible  
✅ **Buttons** - Dark primary background with proper contrast  
✅ **Inputs** - Borders and backgrounds showing  
✅ **All shadcn components** - Proper colors applied  
✅ **Text colors** - Foreground colors working

---

## Files Modified

- `src/styles/globals.css` - Updated `@theme` block with `hsl()` wrapped values

---

## Testing

Visit `http://localhost:3000/login` or `http://localhost:3000/setup` to see:

- White cards on dark gradient background
- Visible button with dark background
- Proper input borders and styling
- All text clearly visible

---

## Technical Notes

### Tailwind v4 Color Format

In Tailwind v4, when defining colors in `@theme`:

- ❌ **Wrong**: `--color-card: 0 0% 100%` (raw HSL)
- ✅ **Correct**: `--color-card: hsl(0 0% 100%)` (wrapped)

### Variable Naming

- `@theme` uses: `--color-*` prefix (e.g., `--color-card`)
- Utilities strip prefix: `bg-card` → uses `--color-card`
- `:root` uses: no prefix (e.g., `--card`)
- Direct usage: `hsl(var(--card))`

---

## Migration Checklist

When migrating shadcn/ui to Tailwind v4:

- [x] Move color definitions to `@theme` block
- [x] Wrap all color values in `hsl()` or `rgb()`
- [x] Keep `:root` variables for backward compatibility
- [x] Test all shadcn components render properly
- [x] Verify buttons, cards, inputs have backgrounds
- [x] Check text contrast and visibility

---

✅ **All shadcn components now render with proper backgrounds and colors!**
