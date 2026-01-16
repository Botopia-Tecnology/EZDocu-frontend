'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, CheckCircle, ArrowLeft } from 'lucide-react';

type UserType = 'admin' | 'team' | 'member';

function getRedirectByRole(userType: UserType): string {
  switch (userType) {
    case 'admin': return '/admin';
    case 'team': return '/dashboard';
    case 'member': return '/workspace';
    default: return '/dashboard';
  }
}

export function Login({ mode = 'signin' }: { mode?: 'signin' | 'signup' }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const redirect = searchParams.get('redirect');
  const success = searchParams.get('success');

  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setPending(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const endpoint = mode === 'signin' ? '/auth/login' : '/auth/register';

      const body: Record<string, string> = { email, password };

      if (mode === 'signup') {
        body.firstName = formData.get('firstName') as string;
        body.lastName = formData.get('lastName') as string;
        body.accountName = formData.get('accountName') as string;
      }

      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if ((mode === 'signin' && data.status === 200) || (mode === 'signup' && data.status === 201)) {
        if (data.token) {
          // Backend sends roleName (admin, team, member)
          const userType = data.user?.roleName || data.roleName || 'member';

          const sessionRes = await fetch('/api/auth/session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              user: data.user,
              userType,
              accounts: data.accounts || [data.account],
              token: data.token,
              activeAccountId: data.account?.id || data.accounts?.[0]?.id
            }),
          });

          if (sessionRes.ok) {
            const targetUrl = redirect || getRedirectByRole(userType as UserType);
            router.push(targetUrl);
            router.refresh();
          } else {
            setError('Failed to create session');
          }
        }
      } else {
        setError(data.message || 'Authentication failed');
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError('Connection error. Please try again.');
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm">
          {/* Back to home */}
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 mb-8">
            <Image src="https://res.cloudinary.com/drsvq4tm6/image/upload/v1768539883/Disen%CC%83o_sin_ti%CC%81tulo_2_tbvifi.png" alt="EZDocu" width={140} height={36} className="h-9 w-auto" />
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-gray-900">
              {mode === 'signin' ? 'Welcome back' : 'Create your account'}
            </h1>
            <p className="text-gray-500 mt-2">
              {mode === 'signin'
                ? 'Sign in to continue to your dashboard'
                : 'Start your free trial today'}
            </p>
          </div>

          {success && (
            <div className="mb-6 flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
              <CheckCircle className="w-4 h-4" />
              Account created successfully! Please sign in.
            </div>
          )}

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            {mode === 'signup' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                      First name
                    </Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      className="mt-1.5 h-11 rounded-lg border-gray-200 focus:border-gray-900 focus:ring-gray-900"
                      placeholder="Jane"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                      Last name
                    </Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      className="mt-1.5 h-11 rounded-lg border-gray-200 focus:border-gray-900 focus:ring-gray-900"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="accountName" className="text-sm font-medium text-gray-700">
                    Company name
                  </Label>
                  <Input
                    id="accountName"
                    name="accountName"
                    type="text"
                    required
                    className="mt-1.5 h-11 rounded-lg border-gray-200 focus:border-gray-900 focus:ring-gray-900"
                    placeholder="Acme Translations LLC"
                  />
                </div>
              </>
            )}

            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1.5 h-11 rounded-lg border-gray-200 focus:border-gray-900 focus:ring-gray-900"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                {mode === 'signin' && (
                  <Link href="/forgot-password" className="text-sm text-gray-500 hover:text-gray-900">
                    Forgot password?
                  </Link>
                )}
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                required
                minLength={8}
                className="mt-1.5 h-11 rounded-lg border-gray-200 focus:border-gray-900 focus:ring-gray-900"
                placeholder={mode === 'signin' ? 'Enter your password' : 'Min. 8 characters'}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-11 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-medium"
              disabled={pending}
            >
              {pending ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  {mode === 'signin' ? 'Signing in...' : 'Creating account...'}
                </>
              ) : (
                mode === 'signin' ? 'Sign in' : 'Create account'
              )}
            </Button>
          </form>

          {/* Footer link */}
          <p className="mt-8 text-center text-sm text-gray-500">
            {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}{' '}
            <Link
              href={mode === 'signin' ? '/sign-up' : '/sign-in'}
              className="font-medium text-gray-900 hover:underline"
            >
              {mode === 'signin' ? 'Sign up' : 'Sign in'}
            </Link>
          </p>
        </div>
      </div>

      {/* Right side - Decorative */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-purple-600 to-violet-700 items-center justify-center p-12">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-8">
            <Image src="https://res.cloudinary.com/drsvq4tm6/image/upload/v1768539883/Disen%CC%83o_sin_ti%CC%81tulo_2_tbvifi.png" alt="EZDocu" width={56} height={56} className="h-14 w-auto brightness-0 invert" />
          </div>
          <h2 className="text-3xl font-semibold text-white mb-4">
            Professional document translation
          </h2>
          <p className="text-purple-100 text-lg leading-relaxed">
            AI-powered OCR and translation platform for certified translators.
            Full control, audit trails, and legal compliance built-in.
          </p>
          <div className="mt-8 flex justify-center gap-6 text-sm text-purple-200">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-300" />
              <span>USCIS Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-300" />
              <span>SOC 2 Security</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
