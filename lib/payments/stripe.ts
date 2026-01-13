import { redirect } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { getSession } from '@/lib/auth/session';

export interface Team {
    id: number;
    stripeCustomerId: string | null;
    stripeProductId: string | null;
    planName: string | null;
    subscriptionStatus: string | null;
}

export async function createCheckoutSession({
    team,
    priceId
}: {
    team: Team | null;
    priceId: string;
}) {
    const session = await getSession();
    const user = session?.user;

    if (!user) {
        redirect(`/sign-up?redirect=checkout&priceId=${priceId}`);
    }

    try {
        const { url } = await apiFetch<{ url: string }>('/payments/create-checkout-session', {
            method: 'POST',
            body: JSON.stringify({
                priceId,
                teamId: team?.id,
                userId: user.id,
                returnUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
            }),
        });
        if (url) redirect(url);
    } catch (error) {
        console.error('Checkout session error:', error);
        redirect('/pricing');
    }
}

export async function createCustomerPortalSession(team: Team) {
    try {
        const { url } = await apiFetch<{ url: string }>('/payments/create-portal-session', {
            method: 'POST',
            body: JSON.stringify({
                teamId: team.id,
                returnUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
            }),
        });
        if (url) return { url };
        return null;
    } catch (error) {
        console.error('Portal session error:', error);
        return null;
    }
}

export async function handleSubscriptionChange(subscription: unknown) {
    console.warn('handleSubscriptionChange called on frontend. This should not happen with new architecture.');
}

export async function getStripePrices() {
    try {
        return await apiFetch<any[]>('/payments/stripe-prices');
    } catch (error) {
        console.error('Failed to fetch prices:', error);
        return [];
    }
}

export async function getStripeProducts() {
    try {
        return await apiFetch<any[]>('/payments/stripe-products');
    } catch (error) {
        console.error('Failed to fetch products:', error);
        return [];
    }
}
