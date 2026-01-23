'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, ArrowLeft, Mail, CheckCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [pending, setPending] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setPending(true);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
            const response = await fetch(`${apiUrl}/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (data.status === 200) {
                setSent(true);
                // Redirect to reset page with email
                setTimeout(() => {
                    router.push(`/reset-password?email=${encodeURIComponent(email)}`);
                }, 2000);
            } else {
                setError(data.message || 'Failed to send reset code');
            }
        } catch (err) {
            console.error('Forgot password error:', err);
            setError('Connection error. Please try again.');
        } finally {
            setPending(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left side - Form */}
            <div className="w-full lg:w-[42%] xl:w-[38%] flex flex-col px-4 sm:px-6 lg:px-16 xl:px-20">
                {/* Back to sign in */}
                <div className="pt-8">
                    <Link href="/sign-in" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        Back to sign in
                    </Link>
                </div>

                <div className="flex-1 flex flex-col justify-center py-12">
                    <div className="w-full max-w-sm">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2 mb-8">
                            <Image src="https://res.cloudinary.com/drsvq4tm6/image/upload/v1768539883/Disen%CC%83o_sin_ti%CC%81tulo_2_tbvifi.png" alt="EZDocu" width={140} height={36} className="h-9 w-auto" />
                        </Link>

                        {sent ? (
                            // Success state
                            <div className="text-center">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle className="w-8 h-8 text-green-600" />
                                </div>
                                <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                                    Check your email
                                </h1>
                                <p className="text-gray-500 mb-6">
                                    We sent a 6-digit verification code to<br />
                                    <span className="font-medium text-gray-900">{email}</span>
                                </p>
                                <p className="text-sm text-gray-400">
                                    Redirecting to verification page...
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* Header */}
                                <div className="mb-8">
                                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                                        <Mail className="w-6 h-6 text-purple-600" />
                                    </div>
                                    <h1 className="text-2xl font-semibold text-gray-900">
                                        Forgot password?
                                    </h1>
                                    <p className="text-gray-500 mt-2">
                                        No worries, we'll send you a verification code to reset your password.
                                    </p>
                                </div>

                                {/* Form */}
                                <form className="space-y-5" onSubmit={handleSubmit}>
                                    <div>
                                        <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                                            Email address
                                        </Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="mt-1.5 h-12 rounded-lg border-gray-200 focus:border-gray-900 focus:ring-gray-900"
                                            placeholder="Enter your email"
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
                                                Sending code...
                                            </>
                                        ) : (
                                            'Send verification code'
                                        )}
                                    </Button>
                                </form>

                                {/* Footer */}
                                <p className="mt-8 text-center text-sm text-gray-500">
                                    Remember your password?{' '}
                                    <Link href="/sign-in" className="font-medium text-gray-900 hover:underline">
                                        Sign in
                                    </Link>
                                </p>
                            </>
                        )}
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

                <div className="relative z-10 max-w-md text-center">
                    <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-8 border border-white/20">
                        <Mail className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Secure password reset
                    </h2>
                    <p className="text-purple-200 text-lg leading-relaxed">
                        We'll send you a secure 6-digit code to verify your identity and help you create a new password.
                    </p>
                </div>
            </div>
        </div>
    );
}
