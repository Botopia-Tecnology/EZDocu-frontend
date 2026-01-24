import { NextRequest, NextResponse } from 'next/server';
import { API_URL } from '@/lib/api';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const includeInactive = searchParams.get('includeInactive') === 'true';

        const response = await fetch(
            `${API_URL}/payments/plans?includeInactive=${includeInactive}`,
            {
                cache: 'no-store',
            }
        );

        if (!response.ok) {
            return NextResponse.json(
                { status: response.status, message: 'Failed to fetch plans' },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching plans:', error);
        return NextResponse.json(
            { status: 500, message: 'Internal server error' },
            { status: 500 }
        );
    }
}
