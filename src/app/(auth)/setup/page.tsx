'use client';

import { useState } from 'react';
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

export default function AdminSetupPage() {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
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

      setSuccess('Admin account created successfully! You can now login.');
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        secret: '',
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex justify-center items-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 min-h-screen'>
      <Card className='w-full max-w-md'>
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
              <div className='bg-destructive/15 p-3 border border-destructive/30 rounded-md text-destructive text-sm'>
                {error}
              </div>
            )}
            {success && (
              <div className='bg-green-50 p-3 border border-green-200 rounded-md text-green-700 text-sm'>
                {success}
              </div>
            )}
            <div className='space-y-2'>
              <Label htmlFor='name'>Full Name</Label>
              <Input
                id='name'
                type='text'
                placeholder='John Doe'
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                disabled={isLoading}
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                type='email'
                placeholder='admin@mrbuild.co.za'
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                disabled={isLoading}
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='password'>Password</Label>
              <Input
                id='password'
                type='password'
                placeholder='••••••••'
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
                disabled={isLoading}
                minLength={8}
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='confirmPassword'>Confirm Password</Label>
              <Input
                id='confirmPassword'
                type='password'
                placeholder='••••••••'
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                required
                disabled={isLoading}
                minLength={8}
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='secret'>Setup Secret</Label>
              <Input
                id='secret'
                type='password'
                placeholder='From .env.local ADMIN_SETUP_SECRET'
                value={formData.secret}
                onChange={(e) =>
                  setFormData({ ...formData, secret: e.target.value })
                }
                required
                disabled={isLoading}
              />
              <p className='text-muted-foreground text-xs'>
                This is the ADMIN_SETUP_SECRET from your .env.local file
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button type='submit' className='w-full' disabled={isLoading}>
              {isLoading ? 'Creating Admin...' : 'Create Admin Account'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
