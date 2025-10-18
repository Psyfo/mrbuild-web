# Form Validation System

## Overview

This document describes the comprehensive custom validation system implemented for all forms in the Mr Build web application. The system provides real-time validation feedback while disabling default HTML5 validation.

## Key Features

### ✅ Custom Validation Only

- All forms use `noValidate` attribute to disable default HTML5 validation
- Custom validation provides consistent, branded error messages
- Full control over validation timing and feedback

### ✅ Real-Time Validation

- Validation triggers after a field is first interacted with ("touched")
- Updates in real-time as the user types after initial blur
- Prevents annoying validation messages before user interaction

### ✅ Password Requirements Display

- Real-time visual feedback showing which requirements are met
- Updates as user types
- Clear green checkmarks for met requirements
- Requirements list:
  - At least 8 characters
  - One lowercase letter
  - One uppercase letter
  - One number

### ✅ Smart Password Matching

- Following industry best practices
- Password mismatch only shown:
  - When user leaves the confirm password field (onBlur)
  - When user attempts to submit the form
- NOT shown while actively typing (reduces frustration)

### ✅ Accessible Forms

- Proper ARIA attributes for screen readers
- `aria-invalid` indicates validation state
- `aria-describedby` links to error messages
- `role="alert"` on error messages for immediate feedback

### ✅ Visual Feedback

- Red border on invalid fields
- Icon with error message
- Smooth animations for error appearance
- Password toggle buttons (show/hide)

## Files Structure

```
src/
├── lib/
│   └── validation.ts              # Core validation utilities
├── components/
│   └── PasswordRequirements/
│       └── PasswordRequirements.tsx  # Password requirements component
└── app/
    ├── (auth)/
    │   ├── login/
    │   │   └── page.tsx           # Login form with validation
    │   └── setup/
    │       └── page.tsx           # Admin setup form with validation
    └── (public)/
        └── components/
            └── ContactSection/
                └── ContactForm/
                    └── ContactForm.tsx  # Contact form with validation
```

## Validation Utilities

### `validateEmail(email: string)`

Validates email format using RFC 5322 compliant regex.

**Returns:**

```typescript
{
  isValid: boolean;
  message?: string;
}
```

**Examples:**

- ❌ Empty: "Email is required"
- ❌ Invalid format: "Please enter a valid email address"
- ✅ Valid: `{ isValid: true }`

### `validateName(name: string, fieldName: string, minLength: number = 2)`

Validates names with support for spaces, hyphens, and apostrophes.

**Returns:**

```typescript
{
  isValid: boolean;
  message?: string;
}
```

**Examples:**

- ❌ Empty: "{fieldName} is required"
- ❌ Too short: "{fieldName} must be at least {minLength} characters"
- ❌ Invalid chars: "{fieldName} can only contain letters, spaces, hyphens, and apostrophes"
- ✅ Valid: `{ isValid: true }`

### `validatePassword(password: string)`

Comprehensive password validation with detailed requirements tracking.

**Returns:**

```typescript
{
  isValid: boolean;
  requirements: PasswordRequirement[];
  message?: string;
}
```

**Requirements Array Example:**

```typescript
[
  {
    id: 'length',
    label: 'At least 8 characters',
    test: (password) => password.length >= 8,
    met: true, // Updates based on current password
  },
  // ... other requirements
];
```

### `validatePasswordMatch(password: string, confirmPassword: string, showMismatch: boolean)`

Validates password matching with smart timing control.

**Parameters:**

- `password`: Original password
- `confirmPassword`: Confirmation password
- `showMismatch`: Whether to show mismatch error (use on blur/submit only)

**Returns:**

```typescript
{
  isValid: boolean;
  message?: string;
}
```

### `validateMessage(message: string, minLength: number = 10)`

Validates text messages or long-form content.

**Returns:**

```typescript
{
  isValid: boolean;
  message?: string;
}
```

### `validateRequired(value: string, fieldName: string)`

Generic required field validation.

**Returns:**

```typescript
{
  isValid: boolean;
  message?: string;
}
```

## Implementation Pattern

### 1. Add State Management

```typescript
const [validationErrors, setValidationErrors] = useState<{
  [key: string]: string;
}>({});

const [touched, setTouched] = useState<{
  [key: string]: boolean;
}>({});
```

### 2. Create Validation Handler

```typescript
const handleFieldBlur = (field: string) => {
  setTouched({ ...touched, [field]: true });

  // Validate the specific field
  const validation = validateEmail(fieldValue); // or appropriate validator
  setValidationErrors({
    ...validationErrors,
    [field]: validation.isValid ? '' : validation.message!,
  });
};
```

### 3. Real-Time Validation

```typescript
const handleInputChange = (field: string, value: string) => {
  setFormData({ ...formData, [field]: value });

  // Only validate if field has been touched
  if (touched[field]) {
    const validation = validateEmail(value);
    setValidationErrors({
      ...validationErrors,
      [field]: validation.isValid ? '' : validation.message!,
    });
  }
};
```

### 4. Add to Form Element

```tsx
<form onSubmit={handleSubmit} noValidate>
  {/* Add noValidate to disable HTML5 validation */}
</form>
```

### 5. Implement Input with Validation

```tsx
<Input
  id='email'
  type='email'
  value={email}
  onChange={(e) => handleInputChange('email', e.target.value)}
  onBlur={() => handleFieldBlur('email')}
  className={
    validationErrors.email && touched.email
      ? 'border-red-500 focus-visible:ring-red-500'
      : ''
  }
  aria-invalid={validationErrors.email && touched.email ? true : false}
  aria-describedby={
    validationErrors.email && touched.email ? 'email-error' : undefined
  }
/>;
{
  validationErrors.email && touched.email && (
    <p
      id='email-error'
      className='slide-in-from-top-1 flex items-center gap-1.5 text-red-500 text-xs animate-in duration-200'
      role='alert'
    >
      <svg
        className='flex-shrink-0 w-3.5 h-3.5'
        fill='currentColor'
        viewBox='0 0 20 20'
      >
        <path
          fillRule='evenodd'
          d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
          clipRule='evenodd'
        />
      </svg>
      {validationErrors.email}
    </p>
  );
}
```

### 6. Password Field with Requirements

```tsx
<div className='space-y-2'>
  <Label htmlFor='password'>Password</Label>
  <div className='relative'>
    <Input
      id='password'
      type={showPassword ? 'text' : 'password'}
      value={password}
      onChange={(e) => handleInputChange('password', e.target.value)}
      onFocus={handlePasswordFocus}
      onBlur={() => handleFieldBlur('password')}
      className={
        validationErrors.password && touched.password
          ? 'border-red-500 focus-visible:ring-red-500 pr-10'
          : 'pr-10'
      }
    />
    <button
      type='button'
      onClick={() => setShowPassword(!showPassword)}
      className='absolute right-3 top-1/2 -translate-y-1/2'
      tabIndex={-1}
    >
      {/* Eye icon */}
    </button>
  </div>
  {validationErrors.password && touched.password && (
    <p id='password-error' role='alert'>
      {validationErrors.password}
    </p>
  )}
  <PasswordRequirements
    requirements={passwordRequirements}
    show={showPasswordRequirements || password.length > 0}
  />
</div>
```

## Validation Timing Best Practices

### When to Validate

1. **On Blur (Field Leave)**

   - Mark field as "touched"
   - Run initial validation
   - Best for: All fields

2. **On Change (While Typing)**

   - Only if field has been touched
   - Provides immediate feedback
   - Best for: Email, names, messages

3. **On Focus (Field Enter)**

   - Show requirements/hints
   - Don't show errors yet
   - Best for: Password fields

4. **On Submit**
   - Validate all fields
   - Mark all as touched
   - Prevent submission if invalid
   - Best for: Final check

### Special Case: Password Matching

```typescript
// Only show mismatch on blur or submit
const [showConfirmPasswordMismatch, setShowConfirmPasswordMismatch] =
  useState(false);

// On blur of confirm password field
const handleConfirmPasswordBlur = () => {
  setShowConfirmPasswordMismatch(true);
  const validation = validatePasswordMatch(password, confirmPassword, true);
  // Set error...
};

// While typing - only validate if we've already shown the error
const handleConfirmPasswordChange = (value: string) => {
  setConfirmPassword(value);
  if (showConfirmPasswordMismatch) {
    const validation = validatePasswordMatch(password, value, true);
    // Update error...
  }
};
```

## Styling Classes

### Input States

```css
/* Valid/neutral state */
className="border-gray-300"

/* Invalid state */
className="border-red-500 focus-visible:ring-red-500"

/* Contact form (dark theme) */
className="border-gray-500"  /* neutral */
className="border-red-500"   /* invalid */
```

### Error Messages

```css
/* Standard error message */
className="slide-in-from-top-1 flex items-center gap-1.5 text-red-500 text-xs animate-in duration-200"

/* Contact form error (dark theme) */
className="mt-1.5 flex items-center gap-1.5 text-red-400 text-xs animate-in slide-in-from-top-1 duration-200"
```

## Testing Checklist

### For Each Form Field:

- [ ] Field starts without validation errors
- [ ] No error shown while field is empty and untouched
- [ ] Error appears when leaving field (onBlur) if invalid
- [ ] Error updates in real-time after first blur
- [ ] Error clears when field becomes valid
- [ ] Proper error message for each validation rule
- [ ] Form submission blocked when fields invalid
- [ ] All fields marked as touched on submit attempt

### For Password Fields:

- [ ] Requirements list appears on focus
- [ ] Requirements update in real-time
- [ ] Green checkmarks appear for met requirements
- [ ] Password visibility toggle works
- [ ] Confirm password only shows mismatch after blur/submit

### Accessibility:

- [ ] Tab navigation works correctly
- [ ] Error messages announced by screen readers
- [ ] aria-invalid updates correctly
- [ ] aria-describedby links to error messages
- [ ] Password toggle doesn't interfere with tab order (tabIndex={-1})

## Future Enhancements

1. **Custom Validation Rules**

   - Add support for custom regex patterns
   - Phone number validation
   - URL validation
   - Custom business logic validation

2. **Async Validation**

   - Check email availability
   - Verify coupon codes
   - Real-time backend validation

3. **Multi-Step Forms**

   - Validate each step independently
   - Show overall progress
   - Allow navigation back to fix errors

4. **Internationalization**
   - Support multiple languages
   - Locale-specific validation (dates, phone numbers)
   - Translated error messages

## Maintenance Notes

- Keep validation.ts as single source of truth
- Add new validators to validation.ts
- Maintain consistent error message format
- Update this documentation when adding new patterns
- Test accessibility with each change
