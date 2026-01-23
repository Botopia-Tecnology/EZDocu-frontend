'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, ArrowLeft, Eye, EyeOff, KeyRound, CheckCircle, RefreshCw } from 'lucide-react';

export function ResetPasswordContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const email = searchParams.get('email') || '';

    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [pending, setPending] = useState(false);
    const [success, setSuccess] = useState(false);
    const [resending, setResending] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Cooldown timer for resend
    useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCooldown]);

    // Handle code input
    const handleCodeChange = (index: number, value: string) => {
        if (value.length > 1) {
            // Handle paste
            const digits = value.replace(/\D/g, '').slice(0, 6).split('');
            const newCode = [...code];
            digits.forEach((digit, i) => {
                if (index + i < 6) {
                    newCode[index + i] = digit;
                }
            });
            setCode(newCode);
            const nextIndex = Math.min(index + digits.length, 5);
            inputRefs.current[nextIndex]?.focus();
        } else {
            const newCode = [...code];
            newCode[index] = value.replace(/\D/g, '');
            setCode(newCode);

            // Auto-focus next input
            if (value && index < 5) {
                inputRefs.current[index + 1]?.focus();
            }
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleResend = async () => {
        if (resendCooldown > 0 || !email) return;

        setResending(true);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
            const response = await fetch(`${apiUrl}/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();
            if (data.status === 200) {
                setResendCooldown(60); // 60 second cooldown
                setCode(['', '', '', '', '', '']);
                inputRefs.current[0]?.focus();
            }
        } catch (err) {
            console.error('Resend error:', err);
        } finally {
            setResending(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        const codeString = code.join('');
        if (codeString.length !== 6) {
            setError('Please enter the 6-digit code');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        setPending(true);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
            const response = await fetch(`${apiUrl}/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    code: codeString,
                    newPassword: password,
                }),
            });

            const data = await response.json();

            if (data.status === 200) {
                setSuccess(true);
                setTimeout(() => {
                    router.push('/sign-in?success=password-reset');
                }, 2000);
            } else {
                setError(data.message || 'Failed to reset password');
            }
        } catch (err) {
            console.error('Reset password error:', err);
            setError('Connection error. Please try again.');
        } finally {
            setPending(false);
        }
    };

    if (!email) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <div className="max-w-md w-full text-center">
                    <h1 className="text-2xl font-semibold text-gray-900 mb-4">Invalid Request</h1>
                    <p className="text-gray-600 mb-8">Please start the password reset process from the beginning.</p>
                    <Link href="/forgot-password">
                        <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                            Go to Forgot Password
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

                        {success ? (
                            // Success state
                            <div className="text-center">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle className="w-8 h-8 text-green-600" />
                                </div>
                                <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                                    Password reset successful!
                                </h1>
                                <p className="text-gray-500 mb-6">
                                    Your password has been changed successfully.
                                </p>
                                <p className="text-sm text-gray-400">
                                    Redirecting to sign in...
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* Header */}
                                <div className="mb-8">
                                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                                        <KeyRound className="w-6 h-6 text-purple-600" />
                                    </div>
                                    <h1 className="text-2xl font-semibold text-gray-900">
                                        Reset your password
                                    </h1>
                                    <p className="text-gray-500 mt-2">
                                        Enter the 6-digit code sent to<br />
                                        <span className="font-medium text-gray-900">{email}</span>
                                    </p>
                                </div>

                                {/* Form */}
                                <form className="space-y-6" onSubmit={handleSubmit}>
                                    {/* Code Input */}
                                    <div>
                                        <Label className="text-sm font-medium text-gray-700 mb-3 block">
                                            Verification code
                                        </Label>
                                        <div className="flex gap-2 justify-between">
                                            {code.map((digit, index) => (
                                                <input
                                                    key={index}
                                                    ref={(el) => { inputRefs.current[index] = el; }}
                                                    type="text"
                                                    inputMode="numeric"
                                                    maxLength={6}
                                                    value={digit}
                                                    onChange={(e) => handleCodeChange(index, e.target.value)}
                                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                                    className="w-12 h-14 text-center text-xl font-semibold border border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                                                />
                                            ))}
                                        </div>
                                        <div className="flex items-center justify-between mt-3">
                                            <span className="text-sm text-gray-500">Didn't receive the code?</span>
                                            <button
                                                type="button"
                                                onClick={handleResend}
                                                disabled={resendCooldown > 0 || resending}
                                                className="text-sm font-medium text-purple-600 hover:text-purple-700 disabled:text-gray-400 flex items-center gap-1"
                                            >
                                                {resending ? (
                                                    <Loader2 className="w-3 h-3 animate-spin" />
                                                ) : (
                                                    <RefreshCw className="w-3 h-3" />
                                                )}
                                                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend code'}
                                            </button>
                                        </div>
                                    </div>

                                    {/* New Password */}
                                    <div>
                                        <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                                            New password
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="password"
                                                type={showPassword ? 'text' : 'password'}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
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

                                    {/* Confirm Password */}
                                    <div>
                                        <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                                            Confirm new password
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="confirmPassword"
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
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
                                                Resetting password...
                                            </>
                                        ) : (
                                            'Reset password'
                                        )}
                                    </Button>
                                </form>
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
                        <KeyRound className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Almost there!
                    </h2>
                    <p className="text-purple-200 text-lg leading-relaxed">
                        Enter the verification code and create a strong new password for your account.
                    </p>

                    {/* Security tips */}
                    <div className="mt-8 bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-left">
                        <p className="text-white font-medium mb-3">Password tips:</p>
                        <ul className="text-purple-200 text-sm space-y-2">
                            <li className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-400" />
                                At least 8 characters long
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-400" />
                                Mix of letters, numbers & symbols
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-400" />
                                Avoid common words or patterns
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
