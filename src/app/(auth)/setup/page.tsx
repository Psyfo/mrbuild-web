'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function AdminSetupPage() {
  const router = useRouter();
  const { toast } = useToast();
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

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    // Name validation
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])/.test(formData.password)) {
      errors.password = 'Password must contain at least one lowercase letter';
    } else if (!/(?=.*[A-Z])/.test(formData.password)) {
      errors.password = 'Password must contain at least one uppercase letter';
    } else if (!/(?=.*\d)/.test(formData.password)) {
      errors.password = 'Password must contain at least one number';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    // Secret validation
    if (!formData.secret) {
      errors.secret = 'Setup secret is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Please fix the errors in the form before submitting.',
      });
      return;
    }

    setIsLoading(true);

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
      toast({
        title: 'Success!',
        description: successMsg,
      });
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        secret: '',
      });
      setValidationErrors({});

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : 'An error occurred';
      setError(errorMsg);
      toast({
        variant: 'destructive',
        title: 'Setup Failed',
        description: errorMsg,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    // Clear validation error for this field when user starts typing
    if (validationErrors[field]) {
      setValidationErrors({ ...validationErrors, [field]: '' });
    }
  };

  const copyErrorToClipboard = () => {
    if (error) {
      navigator.clipboard.writeText(error);
      toast({
        title: 'Copied!',
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
        <form onSubmit={handleSubmit}>
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
                required
                disabled={isLoading || !!success}
                className={validationErrors.name ? 'border-red-500' : ''}
                autoFocus
              />
              {validationErrors.name && (
                <p className='slide-in-from-top-1 text-red-500 text-xs animate-in duration-200'>
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
                required
                disabled={isLoading || !!success}
                className={validationErrors.email ? 'border-red-500' : ''}
              />
              {validationErrors.email && (
                <p className='slide-in-from-top-1 text-red-500 text-xs animate-in duration-200'>
                  {validationErrors.email}
                </p>
              )}
            </div>
            <div className='space-y-2'>
              <Label htmlFor='password'>Password</Label>
              <Input
                id='password'
                type='password'
                placeholder='••••••••'
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                required
                disabled={isLoading || !!success}
                className={validationErrors.password ? 'border-red-500' : ''}
              />
              {validationErrors.password && (
                <p className='slide-in-from-top-1 text-red-500 text-xs animate-in duration-200'>
                  {validationErrors.password}
                </p>
              )}
              <p className='text-muted-foreground text-xs'>
                Must be 8+ characters with uppercase, lowercase, and number
              </p>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='confirmPassword'>Confirm Password</Label>
              <Input
                id='confirmPassword'
                type='password'
                placeholder='••••••••'
                value={formData.confirmPassword}
                onChange={(e) =>
                  handleInputChange('confirmPassword', e.target.value)
                }
                required
                disabled={isLoading || !!success}
                className={
                  validationErrors.confirmPassword ? 'border-red-500' : ''
                }
              />
              {validationErrors.confirmPassword && (
                <p className='slide-in-from-top-1 text-red-500 text-xs animate-in duration-200'>
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
                required
                disabled={isLoading || !!success}
                className={validationErrors.secret ? 'border-red-500' : ''}
              />
              {validationErrors.secret && (
                <p className='slide-in-from-top-1 text-red-500 text-xs animate-in duration-200'>
                  {validationErrors.secret}
                </p>
              )}
              <p className='text-muted-foreground text-xs'>
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
