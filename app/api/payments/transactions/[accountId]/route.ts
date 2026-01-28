import { NextRequest, NextResponse } from 'next/server';
import { API_URL } from '@/lib/api';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ accountId: string }> }
) {
    try {
        const { accountId } = await params;
        const { searchParams } = new URL(request.url);
        const limit = searchParams.get('limit') || '20';
        const offset = searchParams.get('offset') || '0';
        const authHeader = request.headers.get('Authorization');

        const response = await fetch(
            `${API_URL}/payments/transactions/${accountId}?limit=${limit}&offset=${offset}`,
            {
                cache: 'no-store',
                headers: authHeader ? { 'Authorization': authHeader } : {},
            }
        );

        if (!response.ok) {
            return NextResponse.json(
                { status: response.status, message: 'Failed to fetch transactions' },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        return NextResponse.json(
            { status: 500, message: 'Internal server error' },
            { status: 500 }
        );
    }
}
