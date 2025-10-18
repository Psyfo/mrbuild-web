# Quick Reference: Using Custom Theme in Tailwind v4

## Custom Brand Colors

### In HTML/JSX

```jsx
// Yellow
<div className="bg-mbYellow">
<div className="text-mbYellow">
<div className="border-mbYellow">

// Red
<div className="bg-mbRed hover:bg-mbRed/80">
<div className="text-mbRed">

// Dark
<div className="bg-mbDark">
<div className="text-mbDark">
```

### In CSS or inline styles

```jsx
<div style={{ backgroundColor: 'var(--color-mbYellow)' }}>
<div style={{ color: 'var(--color-mbRed)' }}>
```

## Custom Fonts

### In HTML/JSX

```jsx
<h1 className="font-aleo">Heading with Aleo font</h1>
<p className="font-dinot">Body text with DINOT font</p>
```

### In CSS

```css
.my-class {
  font-family: var(--font-aleo);
}
```

## Custom Animations

### In HTML/JSX

```jsx
<div className="animate-marquee">Scrolling marquee text</div>
<div className="animate-pulse-slow">Slow pulsing element</div>
```

## Adding New Theme Values

To add new colors, fonts, or other theme values, edit `src/styles/globals.css`:

```css
@theme {
  /* Add a new color */
  --color-myNewColor: #ff5733;

  /* Add a new font */
  --font-myFont: 'MyFont', sans-serif;

  /* Add a new breakpoint */
  --breakpoint-3xl: 120rem;

  /* Add a new animation */
  --animate-myAnimation: myAnimation 2s ease infinite;

  /* Define keyframes for animations */
  @keyframes myAnimation {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
}
```

Then use them:

```jsx
<div className="bg-myNewColor font-myFont 3xl:text-6xl animate-myAnimation">
```

## Important Notes

1. **CSS Variable Naming**:

   - Colors: `--color-*` → utility: `bg-*`, `text-*`, `border-*`
   - Fonts: `--font-*` → utility: `font-*`
   - Animations: `--animate-*` → utility: `animate-*`
   - Breakpoints: `--breakpoint-*` → variant: `sm:*`, `md:*`, etc.

2. **No Config File**: All customization is now in CSS, not in `tailwind.config.ts`

3. **VS Code Warnings**: You may see "Unknown at rule @theme" warnings in VS Code - these are safe to ignore. The build works perfectly.

4. **shadcn/ui Components**: All existing shadcn/ui components continue to work without changes.
