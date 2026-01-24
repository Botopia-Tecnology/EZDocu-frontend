import { NextRequest, NextResponse } from 'next/server';
import { API_URL } from '@/lib/api';
import { getSession } from '@/lib/auth/session';

export async function POST(request: NextRequest) {
    try {
        const session = await getSession();

        if (!session || session.userType !== 'admin') {
            return NextResponse.json(
                { status: 403, message: 'Unauthorized' },
                { status: 403 }
            );
        }

        const response = await fetch(`${API_URL}/payments/plans/seed`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${session.accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            return NextResponse.json(
                { status: response.status, message: 'Failed to seed plans' },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error seeding plans:', error);
        return NextResponse.json(
            { status: 500, message: 'Internal server error' },
            { status: 500 }
        );
    }
}
