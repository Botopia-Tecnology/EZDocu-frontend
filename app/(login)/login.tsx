'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, CheckCircle, ArrowLeft, ArrowUpRight } from 'lucide-react';

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
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
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
      <div className="w-full lg:w-[42%] xl:w-[38%] flex flex-col px-4 sm:px-6 lg:px-16 xl:px-20">
        {/* Back to home - Fixed at top */}
        <div className="pt-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>
        </div>

        <div className="flex-1 flex flex-col justify-center py-12">
          <div className="w-full max-w-sm">
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
                      className="mt-1.5 h-12 rounded-lg border-gray-200 focus:border-gray-900 focus:ring-gray-900"
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
                      className="mt-1.5 h-12 rounded-lg border-gray-200 focus:border-gray-900 focus:ring-gray-900"
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
                    className="mt-1.5 h-12 rounded-lg border-gray-200 focus:border-gray-900 focus:ring-gray-900"
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
                className="mt-1.5 h-12 rounded-lg border-gray-200 focus:border-gray-900 focus:ring-gray-900"
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
                className="mt-1.5 h-12 rounded-lg border-gray-200 focus:border-gray-900 focus:ring-gray-900"
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
              className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium"
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
      </div>

      {/* Right side - Premium Visual */}
      <div className="hidden lg:flex lg:w-[58%] xl:w-[62%] bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 items-center justify-center p-16 relative overflow-hidden">
        {/* Open App Button - Top Right */}
        <Link
          href="/sign-in"
          className="absolute top-8 right-8 z-20 flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium transition-all border border-white/20"
        >
          Open App
          <ArrowUpRight className="w-4 h-4" />
        </Link>

        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-violet-600 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-fuchsia-500 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        </div>

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

        <div className="relative z-10 max-w-lg w-full">
          {/* Floating Document Cards */}
          <div className="relative h-80 mb-8">
            {/* Main Document Card */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 bg-white rounded-2xl shadow-2xl p-5 transform rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Birth Certificate</p>
                  <p className="text-xs text-gray-500">Spanish → English</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full w-full bg-gradient-to-r from-purple-500 to-violet-600 rounded-full" />
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-green-600 font-medium">Certified</span>
                  <span className="text-gray-400">100%</span>
                </div>
              </div>
            </div>

            {/* Secondary Card - Left */}
            <div className="absolute -left-4 top-4 w-48 bg-white/90 backdrop-blur-sm rounded-xl shadow-xl p-4 transform -rotate-6 hover:rotate-0 transition-transform duration-500">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                </div>
                <span className="text-xs font-medium text-gray-700">USCIS Accepted</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-gray-900">99.8%</span>
                <span className="text-xs text-gray-500">accuracy</span>
              </div>
            </div>

            {/* Tertiary Card - Right */}
            <div className="absolute -right-4 bottom-4 w-44 bg-white/90 backdrop-blur-sm rounded-xl shadow-xl p-4 transform rotate-6 hover:rotate-0 transition-transform duration-500">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs text-gray-500">Live translations</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-gray-900">2.4M+</span>
                <span className="text-xs text-gray-500">documents</span>
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Translate with confidence
            </h2>
            <p className="text-purple-200 text-lg leading-relaxed mb-8">
              Join thousands of certified translators using AI-powered tools to deliver
              legally compliant translations faster.
            </p>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <p className="text-2xl font-bold text-white">50+</p>
                <p className="text-xs text-purple-300">Languages</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <p className="text-2xl font-bold text-white">24/7</p>
                <p className="text-xs text-purple-300">Support</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <p className="text-2xl font-bold text-white">SOC 2</p>
                <p className="text-xs text-purple-300">Certified</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
