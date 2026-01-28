import { NextResponse } from 'next/server';
import { API_URL } from '@/lib/api';

export async function GET() {
    try {
        const response = await fetch(`${API_URL}/payments/credit-packages`, {
            cache: 'no-store',
        });

        if (!response.ok) {
            return NextResponse.json(
                { status: response.status, message: 'Failed to fetch credit packages' },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching credit packages:', error);
        return NextResponse.json(
            { status: 500, message: 'Internal server error' },
            { status: 500 }
        );
    }
}
