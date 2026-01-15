'use server';

import { redirect } from 'next/navigation';
import { createCheckoutSession, createCustomerPortalSession, Team } from './stripe';
import { getSession } from '@/lib/auth/session';

export async function checkoutAction(priceId: string) {
  const session = await getSession();
  if (!session) {
    redirect('/sign-in');
  }

  const team: Team = {
    id: parseInt(session.activeAccountId || '0'),
    stripeCustomerId: null,
    stripeProductId: null,
    planName: null,
    subscriptionStatus: null
  };

  await createCheckoutSession({ team, priceId });
}

export async function customerPortalAction() {
  const session = await getSession();
  if (!session) {
    redirect('/sign-in');
  }

  const team: Team = {
    id: parseInt(session.activeAccountId || '0'),
    stripeCustomerId: null,
    stripeProductId: null,
    planName: null,
    subscriptionStatus: null
  };

  const portalSession = await createCustomerPortalSession(team);
  if (portalSession?.url) {
    redirect(portalSession.url);
  }
  redirect('/pricing');
}
