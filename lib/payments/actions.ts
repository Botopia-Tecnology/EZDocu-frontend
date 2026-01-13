'use server';

import { redirect } from 'next/navigation';
import { createCheckoutSession, createCustomerPortalSession, Team } from './stripe';
import { validatedActionWithUser } from '@/lib/auth/middleware';
import { z } from 'zod';

const checkoutSchema = z.object({
  priceId: z.string(),
});

export const checkoutAction = validatedActionWithUser(checkoutSchema, async (data, formData, user) => {
  const { priceId } = data;

  // Construct a minimal Team object with just the ID (which is all the backend needs)
  const team: Team = {
    id: user.teamId as number,
    stripeCustomerId: null,
    stripeProductId: null,
    planName: null,
    subscriptionStatus: null
  };

  await createCheckoutSession({ team, priceId });
});

const portalSchema = z.object({});

export const customerPortalAction = validatedActionWithUser(portalSchema, async (_, __, user) => {
  const team: Team = {
    id: user.teamId as number,
    stripeCustomerId: null,
    stripeProductId: null,
    planName: null,
    subscriptionStatus: null
  };
  const portalSession = await createCustomerPortalSession(team);
  if (portalSession?.url) {
    redirect(portalSession.url);
  } else {
    redirect('/pricing');
  }
});
