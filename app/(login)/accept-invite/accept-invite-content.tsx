'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, ArrowLeft, Eye, EyeOff, CheckCircle, XCircle, Clock } from 'lucide-react';

interface InviteData {
    valid: boolean;
    email: string;
    firstName: string;
    lastName: string;
    accountName: string;
    inviterName: string;
    expiresAt: string;
    message?: string;
}

export function AcceptInviteContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token');

    const [inviteData, setInviteData] = useState<InviteData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [pending, setPending] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        if (!token) {
            setError('Invalid invitation link');
            setLoading(false);
            return;
        }

        // Verify the invitation token
        const verifyInvite = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
                const response = await fetch(`${apiUrl}/auth/verify-invite?token=${token}`);
                const data = await response.json();

                if (data.status === 200 && data.valid) {
                    setInviteData(data);
                } else {
                    setError(data.message || 'Invalid or expired invitation');
                }
            } catch (err) {
                console.error('Error verifying invite:', err);
                setError('Failed to verify invitation');
            } finally {
                setLoading(false);
            }
        };

        verifyInvite();
    }, [token]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setPending(true);

        const formData = new FormData(e.currentTarget);
        const password = formData.get('password') as string;
        const confirmPassword = formData.get('confirmPassword') as string;

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setPending(false);
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters');
            setPending(false);
            return;
        }

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
            const response = await fetch(`${apiUrl}/auth/accept-invite`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password }),
            });

            const data = await response.json();

            if (data.status === 200) {
                // Create session
                const sessionRes = await fetch('/api/auth/session', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        user: data.user,
                        userType: data.user?.roleName || 'member',
                        accounts: data.accounts,
                        token: data.token,
                        activeAccountId: data.accounts?.[0]?.id
                    }),
                });

                if (sessionRes.ok) {
                    router.push('/workspace');
                    router.refresh();
                } else {
                    setError('Failed to create session');
                }
            } else {
                setError(data.message || 'Failed to accept invitation');
            }
        } catch (err) {
            console.error('Accept invite error:', err);
            setError('Connection error. Please try again.');
        } finally {
            setPending(false);
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-purple-600 mx-auto mb-4" />
                    <p className="text-gray-600">Verifying invitation...</p>
                </div>
            </div>
        );
    }

    // Error state (invalid/expired invitation)
    if (error && !inviteData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <div className="max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <XCircle className="w-8 h-8 text-red-600" />
                    </div>
                    <h1 className="text-2xl font-semibold text-gray-900 mb-2">Invalid Invitation</h1>
                    <p className="text-gray-600 mb-8">{error}</p>
                    <Link href="/sign-in">
                        <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                            Go to Sign In
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex">
            {/* Left side - Form */}
            <div className="w-full lg:w-[42%] xl:w-[38%] flex flex-col px-4 sm:px-6 lg:px-16 xl:px-20">
                {/* Back to home */}
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
                                Accept Invitation
                            </h1>
                            <p className="text-gray-500 mt-2">
                                Complete your account setup to join the team
                            </p>
                        </div>

                        {/* Invitation Info Card */}
                        <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 mb-6">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <CheckCircle className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">
                                        You've been invited to join
                                    </p>
                                    <p className="text-lg font-semibold text-purple-700 mt-1">
                                        {inviteData?.accountName}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Invited by {inviteData?.inviterName}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* User Info (readonly) */}
                        <div className="space-y-4 mb-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-sm font-medium text-gray-700">First name</Label>
                                    <div className="mt-1.5 h-12 px-3 flex items-center bg-gray-50 border border-gray-200 rounded-lg text-gray-700">
                                        {inviteData?.firstName}
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-gray-700">Last name</Label>
                                    <div className="mt-1.5 h-12 px-3 flex items-center bg-gray-50 border border-gray-200 rounded-lg text-gray-700">
                                        {inviteData?.lastName}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-gray-700">Email</Label>
                                <div className="mt-1.5 h-12 px-3 flex items-center bg-gray-50 border border-gray-200 rounded-lg text-gray-700">
                                    {inviteData?.email}
                                </div>
                            </div>
                        </div>

                        {/* Password Form */}
                        <form className="space-y-5" onSubmit={handleSubmit}>
                            <div>
                                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                                    Create password
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        minLength={8}
                                        className="mt-1.5 h-12 rounded-lg border-gray-200 focus:border-gray-900 focus:ring-gray-900 pr-12"
                                        placeholder="Min. 8 characters"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 mt-0.5 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                                    Confirm password
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        required
                                        minLength={8}
                                        className="mt-1.5 h-12 rounded-lg border-gray-200 focus:border-gray-900 focus:ring-gray-900 pr-12"
                                        placeholder="Confirm your password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 mt-0.5 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
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
                                disabled={pending}
                            >
                                {pending ? (
                                    <>
                                        <Loader2 className="animate-spin mr-2 h-4 w-4" />
                                        Creating account...
                                    </>
                                ) : (
                                    'Join Team'
                                )}
                            </Button>
                        </form>

                        {/* Expiration notice */}
                        <div className="mt-6 flex items-center gap-2 text-xs text-gray-500">
                            <Clock className="w-3.5 h-3.5" />
                            <span>
                                This invitation expires on {inviteData?.expiresAt ? new Date(inviteData.expiresAt).toLocaleDateString() : 'soon'}
                            </span>
                        </div>

                        {/* Already have account */}
                        <p className="mt-8 text-center text-sm text-gray-500">
                            Already have an account?{' '}
                            <Link href="/sign-in" className="font-medium text-gray-900 hover:underline">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* Right side - Visual */}
            <div className="hidden lg:flex lg:w-[58%] xl:w-[62%] bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 items-center justify-center p-16 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-violet-600 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
                </div>

                <div className="relative z-10 max-w-lg text-center">
                    <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-8 border border-white/20">
                        <CheckCircle className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Welcome to the team!
                    </h2>
                    <p className="text-purple-200 text-lg leading-relaxed mb-8">
                        You're about to join <span className="font-semibold text-white">{inviteData?.accountName}</span> on EZDocu.
                        Set up your password to start collaborating on translations.
                    </p>

                    <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                            <p className="text-2xl font-bold text-white">AI-Powered</p>
                            <p className="text-xs text-purple-300">Translation Tools</p>
                        </div>
                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                            <p className="text-2xl font-bold text-white">Real-time</p>
                            <p className="text-xs text-purple-300">Collaboration</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
