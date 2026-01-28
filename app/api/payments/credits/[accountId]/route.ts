import { NextRequest, NextResponse } from 'next/server';
import { API_URL } from '@/lib/api';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ accountId: string }> }
) {
    try {
        const { accountId } = await params;
        const authHeader = request.headers.get('Authorization');

        const response = await fetch(`${API_URL}/payments/credits/${accountId}`, {
            cache: 'no-store',
            headers: authHeader ? { 'Authorization': authHeader } : {},
        });

        if (!response.ok) {
            return NextResponse.json(
                { status: response.status, message: 'Failed to fetch account credits' },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching account credits:', error);
        return NextResponse.json(
            { status: 500, message: 'Internal server error' },
            { status: 500 }
        );
    }
}
