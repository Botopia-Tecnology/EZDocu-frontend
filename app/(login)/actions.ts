'use server';

import { z } from 'zod';
import { setSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { createCheckoutSession } from '@/lib/payments/stripe';
import { validatedAction } from '@/lib/auth/middleware';

const signInSchema = z.object({
  email: z.string().email().min(3).max(255),
  password: z.string().min(8).max(100)
});

export const signIn = validatedAction(signInSchema, async (data, formData) => {
  const { email, password } = data;

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();

    if (result.status !== 'success' || !result.user) {
      return {
        error: result.message || 'Invalid email or password. Please try again.',
        email,
        password
      };
    }

    await setSession({ ...result.user, teamId: result.team?.id });

    const redirectTo = formData.get('redirect') as string | null;
    if (redirectTo === 'checkout') {
      const priceId = formData.get('priceId') as string;
      return createCheckoutSession({ team: result.team, priceId });
    }

    redirect('/dashboard');
  } catch (error) {
    if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
      throw error;
    }
    return {
      error: 'Something went wrong. Please try again.',
      email,
      password
    };
  }
});


const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  inviteId: z.string().optional()
});

export const signUp = validatedAction(signUpSchema, async (data, formData) => {
  const { email, password, inviteId } = data;

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, inviteId }),
    });

    const result = await response.json();

    if (result.status !== 'success' || !result.user) {
      return {
        error: result.message || 'Failed to create user. Please try again.',
        email,
        password
      };
    }

    await setSession({ ...result.user, teamId: result.team?.id });

    const redirectTo = formData.get('redirect') as string | null;
    if (redirectTo === 'checkout') {
      const priceId = formData.get('priceId') as string;
      return createCheckoutSession({ team: result.team, priceId });
    }

    redirect('/dashboard');
  } catch (error) {
    if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
      throw error;
    }
    return {
      error: 'Something went wrong. Please try again.',
      email,
      password
    };
  }
});

export async function signOut() {
  // Simple cookie deletion, no backend call needed for JWT usually unless we have a blacklist
  (await import('next/headers')).cookies().then(c => c.delete('session'));
  redirect('/sign-in');
}

const updatePasswordSchema = z.object({
  currentPassword: z.string().min(8).max(100),
  newPassword: z.string().min(8).max(100),
  confirmPassword: z.string().min(8).max(100)
});

export const updatePassword = validatedAction(
  updatePasswordSchema,
  async (data) => {
    return { error: 'Password update moved to backend. Please implement API.' };
  }
);

const deleteAccountSchema = z.object({
  password: z.string().min(8).max(100)
});

export const deleteAccount = validatedAction(
  deleteAccountSchema,
  async (data) => {
    return { error: 'Account deletion moved to backend. Please implement API.' };
  }
);

const updateAccountSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address')
});

export const updateAccount = validatedAction(
  updateAccountSchema,
  async (data) => {
    return { error: 'Account update moved to backend. Please implement API.' };
  }
);

const removeTeamMemberSchema = z.object({
  memberId: z.number()
});

export const removeTeamMember = validatedAction(
  removeTeamMemberSchema,
  async (data) => {
    return { error: 'Team management moved to backend.' };
  }
);

const inviteTeamMemberSchema = z.object({
  email: z.string().email('Invalid email address'),
  role: z.enum(['member', 'owner'])
});

export const inviteTeamMember = validatedAction(
  inviteTeamMemberSchema,
  async (data) => {
    return { error: 'Team management moved to backend.' };
  }
);
