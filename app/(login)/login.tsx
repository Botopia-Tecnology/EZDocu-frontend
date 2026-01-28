'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, CheckCircle, ArrowLeft, ArrowUpRight, Eye, EyeOff, X, Mail, KeyRound, RefreshCw, Building2, Upload, ImageIcon } from 'lucide-react';

type UserType = 'admin' | 'team' | 'member' | 'user';

function getRedirectByRole(userType: UserType): string {
  switch (userType) {
    case 'admin': return '/admin';
    case 'team': return '/dashboard';
    case 'member': return '/workspace';
    case 'user': return '/workspace'; // Usuarios sin company van a workspace
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
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState<'email' | 'code' | 'password' | 'success'>('email');
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotCode, setForgotCode] = useState(['', '', '', '', '', '']);
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showForgotConfirmPassword, setShowForgotConfirmPassword] = useState(false);
  const [forgotPending, setForgotPending] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  // Company registration states
  const [isCompany, setIsCompany] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  // Upload logo to Cloudinary
  const uploadToCloudinary = async (file: File): Promise<string | null> => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      console.error('Cloudinary config missing');
      return null;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    formData.append('folder', 'ezdocu/logos');

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: 'POST', body: formData }
      );
      const data = await response.json();
      return data.secure_url || null;
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      return null;
    }
  };

  // Handle logo file selection
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Logo must be less than 5MB');
        return;
      }
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

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

      const body: Record<string, string | undefined> = { email, password };

      if (mode === 'signup') {
        body.firstName = formData.get('firstName') as string;
        body.lastName = formData.get('lastName') as string;

        // Solo incluir accountName si es company
        if (isCompany) {
          body.accountName = formData.get('accountName') as string;

          // Upload logo if selected
          if (logoFile) {
            setUploadingLogo(true);
            const logoUrl = await uploadToCloudinary(logoFile);
            setUploadingLogo(false);
            if (logoUrl) {
              body.logoUrl = logoUrl;
            }
          }
        }
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

  // Send verification code
  const handleSendCode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setForgotError('');
    setForgotPending(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
      const response = await fetch(`${apiUrl}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail }),
      });

      const data = await response.json();

      if (data.status === 200) {
        setForgotStep('code');
        setResendCooldown(30);
      } else {
        setForgotError(data.message || 'Failed to send reset code');
      }
    } catch (err) {
      console.error('Forgot password error:', err);
      setForgotError('Connection error. Please try again.');
    } finally {
      setForgotPending(false);
    }
  };

  // Resend code
  const handleResendCode = async () => {
    if (resendCooldown > 0) return;
    setForgotPending(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
      const response = await fetch(`${apiUrl}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail }),
      });

      const data = await response.json();
      if (data.status === 200) {
        setResendCooldown(30);
        setForgotCode(['', '', '', '', '', '']);
      }
    } catch (err) {
      console.error('Resend error:', err);
    } finally {
      setForgotPending(false);
    }
  };

  // Handle code input
  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) {
      const digits = value.replace(/\D/g, '').slice(0, 6).split('');
      const newCode = [...forgotCode];
      digits.forEach((digit, i) => {
        if (index + i < 6) {
          newCode[index + i] = digit;
        }
      });
      setForgotCode(newCode);
    } else {
      const newCode = [...forgotCode];
      newCode[index] = value.replace(/\D/g, '');
      setForgotCode(newCode);
    }
  };

  // Verify code and go to password step
  const handleVerifyCode = () => {
    const codeString = forgotCode.join('');
    if (codeString.length !== 6) {
      setForgotError('Please enter the 6-digit code');
      return;
    }
    setForgotError('');
    setForgotStep('password');
  };

  // Reset password
  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setForgotError('');

    if (forgotNewPassword !== forgotConfirmPassword) {
      setForgotError('Passwords do not match');
      return;
    }

    if (forgotNewPassword.length < 8) {
      setForgotError('Password must be at least 8 characters');
      return;
    }

    setForgotPending(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
      const response = await fetch(`${apiUrl}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: forgotEmail,
          code: forgotCode.join(''),
          newPassword: forgotNewPassword,
        }),
      });

      const data = await response.json();

      if (data.status === 200) {
        setForgotStep('success');
      } else {
        setForgotError(data.message || 'Failed to reset password');
      }
    } catch (err) {
      console.error('Reset password error:', err);
      setForgotError('Connection error. Please try again.');
    } finally {
      setForgotPending(false);
    }
  };

  // Reset modal state
  const resetForgotModal = () => {
    setShowForgotModal(false);
    setForgotStep('email');
    setForgotEmail('');
    setForgotCode(['', '', '', '', '', '']);
    setForgotNewPassword('');
    setForgotConfirmPassword('');
    setForgotError('');
    setResendCooldown(0);
  };

  // Cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

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

                {/* Company Checkbox */}
                <div className="flex items-center gap-2 py-2">
                  <input
                    type="checkbox"
                    id="isCompany"
                    checked={isCompany}
                    onChange={(e) => {
                      setIsCompany(e.target.checked);
                      if (!e.target.checked) {
                        setLogoFile(null);
                        setLogoPreview(null);
                      }
                    }}
                    className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <label htmlFor="isCompany" className="flex items-center gap-1.5 cursor-pointer text-sm text-gray-600">
                    <Building2 className="w-4 h-4" />
                    Register as a company
                  </label>
                </div>

                {/* Company Fields - Only show if isCompany */}
                {isCompany && (
                  <div className="flex gap-3 items-start">
                    {/* Logo Upload - Compact */}
                    <div className="flex-shrink-0">
                      {logoPreview ? (
                        <div className="relative w-[72px] h-[72px] rounded-lg overflow-hidden border border-purple-200">
                          <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => { setLogoFile(null); setLogoPreview(null); }}
                            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <label
                          htmlFor="logo-upload"
                          className="flex flex-col items-center justify-center w-[72px] h-[72px] border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-purple-400 transition-colors"
                        >
                          <ImageIcon className="w-5 h-5 text-gray-400" />
                          <span className="text-[10px] text-gray-400 mt-1">Logo</span>
                          <input id="logo-upload" type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                        </label>
                      )}
                    </div>
                    {/* Company Name */}
                    <div className="flex-1">
                      <Label htmlFor="accountName" className="text-sm font-medium text-gray-700">Company name</Label>
                      <Input
                        id="accountName"
                        name="accountName"
                        type="text"
                        required={isCompany}
                        className="mt-1 h-11 rounded-lg border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                        placeholder="Acme Translations LLC"
                      />
                    </div>
                  </div>
                )}
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
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                  required
                  minLength={8}
                  className="mt-1.5 h-12 rounded-lg border-gray-200 focus:border-gray-900 focus:ring-gray-900 pr-12"
                  placeholder={mode === 'signin' ? 'Enter your password' : 'Min. 8 characters'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 mt-0.5 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium"
              disabled={pending || uploadingLogo}
            >
              {pending || uploadingLogo ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  {uploadingLogo ? 'Uploading logo...' : (mode === 'signin' ? 'Signing in...' : 'Creating account...')}
                </>
              ) : (
                mode === 'signin' ? 'Sign in' : 'Create account'
              )}
            </Button>

          </form>

          {mode === 'signin' && (
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-sm text-purple-600 hover:text-purple-800 hover:underline cursor-pointer"
              >
                Forgot password?
              </button>
            </div>
          )}

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

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={resetForgotModal}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-8">
            {/* Close button */}
            <button
              type="button"
              onClick={resetForgotModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Step 1: Email */}
            {forgotStep === 'email' && (
              <>
                <div className="text-center mb-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-6 h-6 text-purple-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Forgot password?
                  </h2>
                  <p className="text-gray-500 mt-2 text-sm">
                    No worries, we'll send you a verification code.
                  </p>
                </div>

                <form onSubmit={handleSendCode}>
                  <div className="mb-4">
                    <Label htmlFor="forgotEmail" className="text-sm font-medium text-gray-700">
                      Email address
                    </Label>
                    <Input
                      id="forgotEmail"
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      required
                      className="mt-1.5 h-12 rounded-lg border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                      placeholder="Enter your email"
                      autoFocus
                    />
                  </div>

                  {forgotError && (
                    <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                      {forgotError}
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium"
                    disabled={forgotPending}
                  >
                    {forgotPending ? (
                      <>
                        <Loader2 className="animate-spin mr-2 h-4 w-4" />
                        Sending code...
                      </>
                    ) : (
                      'Send verification code'
                    )}
                  </Button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-500">
                  Remember your password?{' '}
                  <button
                    type="button"
                    onClick={resetForgotModal}
                    className="font-medium text-purple-600 hover:text-purple-700"
                  >
                    Back to sign in
                  </button>
                </p>
              </>
            )}

            {/* Step 2: Enter Code */}
            {forgotStep === 'code' && (
              <>
                {/* Back button */}
                <button
                  type="button"
                  onClick={() => setForgotStep('email')}
                  className="absolute top-4 left-4 text-gray-400 hover:text-gray-600 flex items-center gap-1 text-sm"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>

                <div className="text-center mb-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-6 h-6 text-purple-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Check your email
                  </h2>
                  <p className="text-gray-500 mt-2 text-sm">
                    We sent a 6-digit code to<br />
                    <span className="font-medium text-gray-900">{forgotEmail}</span>
                  </p>
                </div>

                <div className="mb-4">
                  <Label className="text-sm font-medium text-gray-700 mb-3 block">
                    Verification code
                  </Label>
                  <div className="flex gap-2 justify-between">
                    {forgotCode.map((digit, index) => (
                      <input
                        key={index}
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        value={digit}
                        onChange={(e) => handleCodeChange(index, e.target.value)}
                        className="w-12 h-14 text-center text-xl font-semibold border border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                      />
                    ))}
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-sm text-gray-500">Didn't receive the code?</span>
                    <button
                      type="button"
                      onClick={handleResendCode}
                      disabled={resendCooldown > 0 || forgotPending}
                      className="text-sm font-medium text-purple-600 hover:text-purple-700 disabled:text-gray-400 flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" />
                      {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend code'}
                    </button>
                  </div>
                </div>

                {forgotError && (
                  <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                    {forgotError}
                  </div>
                )}

                <Button
                  type="button"
                  onClick={handleVerifyCode}
                  className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium"
                >
                  Continue
                </Button>
              </>
            )}

            {/* Step 3: New Password */}
            {forgotStep === 'password' && (
              <>
                {/* Back button */}
                <button
                  type="button"
                  onClick={() => setForgotStep('code')}
                  className="absolute top-4 left-4 text-gray-400 hover:text-gray-600 flex items-center gap-1 text-sm"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>

                <div className="text-center mb-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <KeyRound className="w-6 h-6 text-purple-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Set new password
                  </h2>
                  <p className="text-gray-500 mt-2 text-sm">
                    Create a strong password for your account.
                  </p>
                </div>

                <form onSubmit={handleResetPassword}>
                  <div className="mb-4">
                    <Label htmlFor="newPassword" className="text-sm font-medium text-gray-700">
                      New password
                    </Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showForgotPassword ? 'text' : 'password'}
                        value={forgotNewPassword}
                        onChange={(e) => setForgotNewPassword(e.target.value)}
                        required
                        minLength={8}
                        className="mt-1.5 h-12 rounded-lg border-gray-200 focus:border-purple-500 focus:ring-purple-500 pr-12"
                        placeholder="Min. 8 characters"
                      />
                      <button
                        type="button"
                        onClick={() => setShowForgotPassword(!showForgotPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 mt-0.5 text-gray-400 hover:text-gray-600"
                      >
                        {showForgotPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="mb-4">
                    <Label htmlFor="confirmNewPassword" className="text-sm font-medium text-gray-700">
                      Confirm password
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmNewPassword"
                        type={showForgotConfirmPassword ? 'text' : 'password'}
                        value={forgotConfirmPassword}
                        onChange={(e) => setForgotConfirmPassword(e.target.value)}
                        required
                        minLength={8}
                        className="mt-1.5 h-12 rounded-lg border-gray-200 focus:border-purple-500 focus:ring-purple-500 pr-12"
                        placeholder="Confirm your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowForgotConfirmPassword(!showForgotConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 mt-0.5 text-gray-400 hover:text-gray-600"
                      >
                        {showForgotConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {forgotError && (
                    <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                      {forgotError}
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium"
                    disabled={forgotPending}
                  >
                    {forgotPending ? (
                      <>
                        <Loader2 className="animate-spin mr-2 h-4 w-4" />
                        Resetting password...
                      </>
                    ) : (
                      'Reset password'
                    )}
                  </Button>
                </form>
              </>
            )}

            {/* Step 4: Success */}
            {forgotStep === 'success' && (
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Password reset successful!
                </h2>
                <p className="text-gray-500 mb-6">
                  Your password has been changed successfully.
                </p>
                <Button
                  type="button"
                  onClick={resetForgotModal}
                  className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium"
                >
                  Back to sign in
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
