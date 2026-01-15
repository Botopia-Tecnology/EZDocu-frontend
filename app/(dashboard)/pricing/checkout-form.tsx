'use client';

import { Button } from '@/components/ui/button';
import { checkoutAction } from '@/lib/payments/actions';

export function CheckoutForm({ priceId }: { priceId?: string }) {
    const handleSubmit = async () => {
        if (priceId) {
            await checkoutAction(priceId);
        }
    };

    return (
        <form action={handleSubmit}>
            <Button type="submit" className="w-full">
                Subscribe
            </Button>
        </form>
    );
}
