'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  validateEmail,
  validateName,
  validatePassword,
  validatePasswordMatch,
  validateRequired,
  PasswordRequirement,
} from '@/lib/validation';
import { PasswordRequirements } from '@/components/PasswordRequirements/PasswordRequirements';

export default function AdminSetupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    secret: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string;
  }>({});
  const [touched, setTouched] = useState<{
    [key: string]: boolean;
  }>({});
  const [passwordRequirements, setPasswordRequirements] = useState<
    PasswordRequirement[]
  >([]);
  const [showPasswordRequirements, setShowPasswordRequirements] =
    useState(false);
  const [showConfirmPasswordMismatch, setShowConfirmPasswordMismatch] =
    useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    // Name validation
    const nameValidation = validateName(formData.name, 'Full name');
    if (!nameValidation.isValid) {
      errors.name = nameValidation.message!;
    }

    // Email validation
    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) {
      errors.email = emailValidation.message!;
    }

    // Password validation
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.message!;
    }

    // Confirm password validation - show mismatch on submit
    const confirmPasswordValidation = validatePasswordMatch(
      formData.password,
      formData.confirmPassword,
      true
    );
    if (!confirmPasswordValidation.isValid) {
      errors.confirmPassword = confirmPasswordValidation.message!;
    }

    // Secret validation
    const secretValidation = validateRequired(formData.secret, 'Setup secret');
    if (!secretValidation.isValid) {
      errors.secret = secretValidation.message!;
    }

    setValidationErrors(errors);
    // Mark all fields as touched on submit
    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
      secret: true,
    });
    setShowConfirmPasswordMismatch(true);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      toast.error('Validation Error', {
        description: 'Please fix the errors in the form before submitting.',
        duration: 4000,
      });
      return;
    }

    setIsLoading(true);

    // Show info toast when creating admin
    toast.info('Creating admin account...', {
      description: 'Setting up your account',
      duration: 2000,
    });

    try {
      const response = await fetch('/api/admin/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          secret: formData.secret,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create admin');
      }

      const successMsg = 'Admin account created successfully!';
      setSuccess(successMsg);
      toast.success('Success!', {
        description: successMsg,
        duration: 3000,
      });
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        secret: '',
      });
      setValidationErrors({});

      // Show warning before redirect
      setTimeout(() => {
        toast.warning('Redirecting...', {
          description: 'Taking you to the login page',
          duration: 1500,
        });
      }, 1500);

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : 'An error occurred';
      setError(errorMsg);
      toast.error('Setup Failed', {
        description: errorMsg,
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });

    // Real-time validation if field has been touched
    if (touched[field]) {
      let fieldValidation;

      switch (field) {
        case 'name':
          fieldValidation = validateName(value, 'Full name');
          setValidationErrors({
            ...validationErrors,
            name: fieldValidation.isValid ? '' : fieldValidation.message!,
          });
          break;
        case 'email':
          fieldValidation = validateEmail(value);
          setValidationErrors({
            ...validationErrors,
            email: fieldValidation.isValid ? '' : fieldValidation.message!,
          });
          break;
        case 'password':
          const passwordValidation = validatePassword(value);
          setPasswordRequirements(passwordValidation.requirements);
          setValidationErrors({
            ...validationErrors,
            password: passwordValidation.isValid
              ? ''
              : passwordValidation.message!,
          });
          // Re-validate confirm password if it has content
          if (formData.confirmPassword && showConfirmPasswordMismatch) {
            const confirmValidation = validatePasswordMatch(
              value,
              formData.confirmPassword,
              true
            );
            setValidationErrors((prev) => ({
              ...prev,
              password: passwordValidation.isValid
                ? ''
                : passwordValidation.message!,
              confirmPassword: confirmValidation.isValid
                ? ''
                : confirmValidation.message!,
            }));
          }
          break;
        case 'confirmPassword':
          // Only show mismatch if user has finished typing (on blur/submit)
          if (showConfirmPasswordMismatch) {
            const confirmValidation = validatePasswordMatch(
              formData.password,
              value,
              true
            );
            setValidationErrors({
              ...validationErrors,
              confirmPassword: confirmValidation.isValid
                ? ''
                : confirmValidation.message!,
            });
          }
          break;
        case 'secret':
          fieldValidation = validateRequired(value, 'Setup secret');
          setValidationErrors({
            ...validationErrors,
            secret: fieldValidation.isValid ? '' : fieldValidation.message!,
          });
          break;
      }
    }
  };

  const handleFieldBlur = (field: string) => {
    setTouched({ ...touched, [field]: true });

    // Validate on blur
    let fieldValidation;

    switch (field) {
      case 'name':
        fieldValidation = validateName(formData.name, 'Full name');
        setValidationErrors({
          ...validationErrors,
          name: fieldValidation.isValid ? '' : fieldValidation.message!,
        });
        break;
      case 'email':
        fieldValidation = validateEmail(formData.email);
        setValidationErrors({
          ...validationErrors,
          email: fieldValidation.isValid ? '' : fieldValidation.message!,
        });
        break;
      case 'password':
        const passwordValidation = validatePassword(formData.password);
        setPasswordRequirements(passwordValidation.requirements);
        setValidationErrors({
          ...validationErrors,
          password: passwordValidation.isValid
            ? ''
            : passwordValidation.message!,
        });
        setShowPasswordRequirements(false);
        break;
      case 'confirmPassword':
        // Show mismatch error on blur
        setShowConfirmPasswordMismatch(true);
        const confirmValidation = validatePasswordMatch(
          formData.password,
          formData.confirmPassword,
          true
        );
        setValidationErrors({
          ...validationErrors,
          confirmPassword: confirmValidation.isValid
            ? ''
            : confirmValidation.message!,
        });
        break;
      case 'secret':
        fieldValidation = validateRequired(formData.secret, 'Setup secret');
        setValidationErrors({
          ...validationErrors,
          secret: fieldValidation.isValid ? '' : fieldValidation.message!,
        });
        break;
    }
  };

  const handlePasswordFocus = () => {
    setShowPasswordRequirements(true);
    // Initialize requirements if not already done
    if (passwordRequirements.length === 0) {
      const passwordValidation = validatePassword(formData.password);
      setPasswordRequirements(passwordValidation.requirements);
    }
  };

  const copyErrorToClipboard = () => {
    if (error) {
      navigator.clipboard.writeText(error);
      toast.success('Copied!', {
        description: 'Error message copied to clipboard.',
      });
    }
  };

  return (
    <div className='flex justify-center items-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 min-h-screen animate-in duration-500 fade-in'>
      <Card className='slide-in-from-bottom-4 shadow-2xl w-full max-w-md animate-in duration-700'>
        <CardHeader className='space-y-1'>
          <CardTitle className='font-bold text-2xl text-center'>
            Admin Setup
          </CardTitle>
          <CardDescription className='text-center'>
            Create the initial admin account for Mr Build
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit} noValidate>
          <CardContent className='space-y-4'>
            {error && (
              <div className='bg-destructive/15 slide-in-from-top-2 p-3 border border-destructive/30 rounded-md text-destructive text-sm animate-in duration-300'>
                <div className='flex items-start gap-2'>
                  <svg
                    className='flex-shrink-0 mt-0.5 w-5 h-5'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                      clipRule='evenodd'
                    />
                  </svg>
                  <span className='flex-1'>{error}</span>
                  <button
                    type='button'
                    onClick={copyErrorToClipboard}
                    className='flex-shrink-0 text-destructive hover:text-destructive/80 transition-colors'
                    title='Copy error message'
                  >
                    <svg
                      className='w-4 h-4'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z'
                      />
                    </svg>
                  </button>
                </div>
              </div>
            )}
            {success && (
              <div className='bg-green-50 slide-in-from-top-2 p-3 border border-green-200 rounded-md text-green-700 text-sm animate-in duration-300'>
                <div className='flex items-start gap-2'>
                  <svg
                    className='flex-shrink-0 mt-0.5 w-5 h-5'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                      clipRule='evenodd'
                    />
                  </svg>
                  <div>
                    <p className='font-medium'>{success}</p>
                    <p className='mt-1 text-xs'>Redirecting to login...</p>
                  </div>
                </div>
              </div>
            )}
            <div className='space-y-2'>
              <Label htmlFor='name'>Full Name</Label>
              <Input
                id='name'
                type='text'
                placeholder='John Doe'
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                onBlur={() => handleFieldBlur('name')}
                disabled={isLoading || !!success}
                className={
                  validationErrors.name && touched.name
                    ? 'border-red-500 focus-visible:ring-red-500'
                    : ''
                }
                autoFocus
                aria-invalid={!!validationErrors.name && touched.name}
                aria-describedby={
                  validationErrors.name && touched.name
                    ? 'name-error'
                    : undefined
                }
              />
              {validationErrors.name && touched.name && (
                <p
                  id='name-error'
                  className='flex items-center gap-1.5 slide-in-from-top-1 text-red-500 text-xs animate-in duration-200'
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
                  {validationErrors.name}
                </p>
              )}
            </div>
            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                type='email'
                placeholder='admin@mrbuild.co.za'
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                onBlur={() => handleFieldBlur('email')}
                disabled={isLoading || !!success}
                className={
                  validationErrors.email && touched.email
                    ? 'border-red-500 focus-visible:ring-red-500'
                    : ''
                }
                autoComplete='email'
                aria-invalid={!!validationErrors.email && touched.email}
                aria-describedby={
                  validationErrors.email && touched.email
                    ? 'email-error'
                    : undefined
                }
              />
              {validationErrors.email && touched.email && (
                <p
                  id='email-error'
                  className='flex items-center gap-1.5 slide-in-from-top-1 text-red-500 text-xs animate-in duration-200'
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
              )}
            </div>
            <div className='space-y-2'>
              <Label htmlFor='password'>Password</Label>
              <div className='relative'>
                <Input
                  id='password'
                  type={showPassword ? 'text' : 'password'}
                  placeholder='••••••••'
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange('password', e.target.value)
                  }
                  onFocus={handlePasswordFocus}
                  onBlur={() => handleFieldBlur('password')}
                  disabled={isLoading || !!success}
                  className={
                    validationErrors.password && touched.password
                      ? 'border-red-500 focus-visible:ring-red-500 pr-10'
                      : 'pr-10'
                  }
                  autoComplete='new-password'
                  aria-invalid={!!validationErrors.password && touched.password}
                  aria-describedby={
                    validationErrors.password && touched.password
                      ? 'password-error'
                      : 'password-requirements'
                  }
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='top-1/2 right-3 absolute text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 dark:text-gray-400 transition-colors -translate-y-1/2'
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg
                      className='w-5 h-5'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21'
                      />
                    </svg>
                  ) : (
                    <svg
                      className='w-5 h-5'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                      />
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                      />
                    </svg>
                  )}
                </button>
              </div>
              {validationErrors.password && touched.password && (
                <p
                  id='password-error'
                  className='flex items-center gap-1.5 slide-in-from-top-1 text-red-500 text-xs animate-in duration-200'
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
                  {validationErrors.password}
                </p>
              )}
              <div id='password-requirements'>
                <PasswordRequirements
                  requirements={passwordRequirements}
                  show={
                    showPasswordRequirements || formData.password.length > 0
                  }
                />
              </div>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='confirmPassword'>Confirm Password</Label>
              <div className='relative'>
                <Input
                  id='confirmPassword'
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder='••••••••'
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleInputChange('confirmPassword', e.target.value)
                  }
                  onBlur={() => handleFieldBlur('confirmPassword')}
                  disabled={isLoading || !!success}
                  className={
                    validationErrors.confirmPassword && touched.confirmPassword
                      ? 'border-red-500 focus-visible:ring-red-500 pr-10'
                      : 'pr-10'
                  }
                  autoComplete='new-password'
                  aria-invalid={
                    !!validationErrors.confirmPassword &&
                    touched.confirmPassword
                  }
                  aria-describedby={
                    validationErrors.confirmPassword && touched.confirmPassword
                      ? 'confirm-password-error'
                      : undefined
                  }
                />
                <button
                  type='button'
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className='top-1/2 right-3 absolute text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 dark:text-gray-400 transition-colors -translate-y-1/2'
                  tabIndex={-1}
                  aria-label={
                    showConfirmPassword ? 'Hide password' : 'Show password'
                  }
                >
                  {showConfirmPassword ? (
                    <svg
                      className='w-5 h-5'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21'
                      />
                    </svg>
                  ) : (
                    <svg
                      className='w-5 h-5'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                      />
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                      />
                    </svg>
                  )}
                </button>
              </div>
              {validationErrors.confirmPassword && touched.confirmPassword && (
                <p
                  id='confirm-password-error'
                  className='flex items-center gap-1.5 slide-in-from-top-1 text-red-500 text-xs animate-in duration-200'
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
                  {validationErrors.confirmPassword}
                </p>
              )}
            </div>
            <div className='space-y-2'>
              <Label htmlFor='secret'>Setup Secret</Label>
              <Input
                id='secret'
                type='password'
                placeholder='From .env.local ADMIN_SETUP_SECRET'
                value={formData.secret}
                onChange={(e) => handleInputChange('secret', e.target.value)}
                onBlur={() => handleFieldBlur('secret')}
                disabled={isLoading || !!success}
                className={
                  validationErrors.secret && touched.secret
                    ? 'border-red-500 focus-visible:ring-red-500'
                    : ''
                }
                autoComplete='off'
                aria-invalid={!!validationErrors.secret && touched.secret}
                aria-describedby={
                  validationErrors.secret && touched.secret
                    ? 'secret-error'
                    : 'secret-help'
                }
              />
              {validationErrors.secret && touched.secret && (
                <p
                  id='secret-error'
                  className='flex items-center gap-1.5 slide-in-from-top-1 text-red-500 text-xs animate-in duration-200'
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
                  {validationErrors.secret}
                </p>
              )}
              <p id='secret-help' className='text-muted-foreground text-xs'>
                This is the ADMIN_SETUP_SECRET from your .env.local file
              </p>
            </div>
          </CardContent>
          <CardFooter className='flex flex-col gap-3'>
            <Button
              type='submit'
              className='w-full hover:scale-[1.02] transition-all duration-200'
              disabled={isLoading || !!success}
            >
              {isLoading ? (
                <span className='flex items-center gap-2'>
                  <svg
                    className='w-4 h-4 animate-spin'
                    fill='none'
                    viewBox='0 0 24 24'
                  >
                    <circle
                      className='opacity-25'
                      cx='12'
                      cy='12'
                      r='10'
                      stroke='currentColor'
                      strokeWidth='4'
                    />
                    <path
                      className='opacity-75'
                      fill='currentColor'
                      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                    />
                  </svg>
                  Creating Admin...
                </span>
              ) : success ? (
                'Account Created!'
              ) : (
                'Create Admin Account'
              )}
            </Button>
            <div className='text-muted-foreground text-sm text-center'>
              Already have an account?{' '}
              <Link
                href='/login'
                className='font-medium text-primary hover:underline transition-colors'
              >
                Sign in here
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
