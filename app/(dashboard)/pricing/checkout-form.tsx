
'use client';

import { useActionState } from 'react';
import { checkoutAction } from '@/lib/payments/actions';
import { SubmitButton } from './submit-button';

import { ActionState } from '@/lib/auth/middleware';

export function CheckoutForm({ priceId }: { priceId?: string }) {
    const [state, action] = useActionState<ActionState, FormData>(checkoutAction, { error: '' });

    return (
        <form action={action}>
            <input type="hidden" name="priceId" value={priceId} />
            <SubmitButton />
            {state.error && (
                <p className="text-red-500 text-sm mt-2">{state.error}</p>
            )}
        </form>
    );
}
