'use client';

import { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const callbackUrl = searchParams.get('callbackUrl') || '/admin';

  const validateForm = () => {
    const errors: { email?: string; password?: string } = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 3) {
      errors.password = 'Password must be at least 3 characters';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      toast.error('Validation Error', {
        description: 'Please fix the errors in the form before submitting.',
        duration: 4000,
      });
      return;
    }

    setIsLoading(true);

    // Show info toast when starting login
    toast.info('Signing in...', {
      description: 'Verifying your credentials',
      duration: 2000,
    });

    try {
      const result = await signIn('credentials', {
        email,
        password,
        rememberMe: rememberMe.toString(),
        redirect: false,
      });

      if (result?.error) {
        const errorMsg = 'Invalid email or password. Please try again.';
        setError(errorMsg);
        toast.error('Login Failed', {
          description: errorMsg,
          duration: 5000,
        });
      } else if (result?.ok) {
        toast.success('Success!', {
          description: 'Logging you in...',
          duration: 2000,
        });
        // Success animation before redirect
        setTimeout(() => {
          router.push(callbackUrl);
          router.refresh();
        }, 300);
      }
    } catch (error) {
      const errorMsg = 'An error occurred. Please try again.';
      setError(errorMsg);
      toast.error('Error', {
        description: errorMsg,
        duration: 5000,
      });
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (validationErrors.email) {
      setValidationErrors({ ...validationErrors, email: undefined });
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (validationErrors.password) {
      setValidationErrors({ ...validationErrors, password: undefined });
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
            Admin Login
          </CardTitle>
          <CardDescription className='text-center'>
            Enter your credentials to access the admin portal
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
            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                type='email'
                placeholder='admin@mrbuild.co.za'
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                required
                disabled={isLoading}
                className={validationErrors.email ? 'border-red-500' : ''}
                autoComplete='email'
                autoFocus
              />
              {validationErrors.email && (
                <p className='slide-in-from-top-1 text-red-500 text-xs animate-in duration-200'>
                  {validationErrors.email}
                </p>
              )}
            </div>
            <div className='space-y-2'>
              <div className='flex justify-between items-center'>
                <Label htmlFor='password'>Password</Label>
              </div>
              <div className='relative'>
                <Input
                  id='password'
                  type={showPassword ? 'text' : 'password'}
                  placeholder='••••••••'
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  required
                  disabled={isLoading}
                  className={
                    validationErrors.password ? 'border-red-500 pr-10' : 'pr-10'
                  }
                  autoComplete='current-password'
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='top-1/2 right-3 absolute text-gray-500 hover:text-gray-700 transition-colors -translate-y-1/2'
                  tabIndex={-1}
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
              {validationErrors.password && (
                <p className='slide-in-from-top-1 text-red-500 text-xs animate-in duration-200'>
                  {validationErrors.password}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter className='flex flex-col gap-3'>
            <div className='flex items-center space-x-2 w-full'>
              <Checkbox
                id='remember'
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                disabled={isLoading}
              />
              <Label
                htmlFor='remember'
                className='font-normal text-sm cursor-pointer'
              >
                Remember me for 90 days
              </Label>
            </div>
            <Button
              type='submit'
              className='w-full hover:scale-[1.02] transition-all duration-200'
              disabled={isLoading}
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
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </Button>
            <div className='text-muted-foreground text-sm text-center'>
              Need to create an admin account?{' '}
              <Link
                href='/setup'
                className='font-medium text-primary hover:underline transition-colors'
              >
                Set up here
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className='flex justify-center items-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 min-h-screen'>
          <div className='text-center'>
            <div className='mx-auto border-mbYellow border-b-2 rounded-full w-12 h-12 animate-spin'></div>
            <p className='mt-4 text-gray-300'>Loading...</p>
          </div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
