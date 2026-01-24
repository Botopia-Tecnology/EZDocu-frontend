import { NextRequest, NextResponse } from 'next/server';
import { API_URL } from '@/lib/api';
import { getSession } from '@/lib/auth/session';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const response = await fetch(`${API_URL}/payments/plans/${id}`, {
            cache: 'no-store',
        });

        if (!response.ok) {
            return NextResponse.json(
                { status: response.status, message: 'Failed to fetch plan' },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching plan:', error);
        return NextResponse.json(
            { status: 500, message: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession();

        if (!session || session.userType !== 'admin') {
            return NextResponse.json(
                { status: 403, message: 'Unauthorized' },
                { status: 403 }
            );
        }

        const { id } = await params;
        const body = await request.json();

        const response = await fetch(`${API_URL}/payments/plans/${id}`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${session.accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('API error updating plan:', data);
            return NextResponse.json(
                { status: response.status, message: data.message || 'Failed to update plan' },
                { status: response.status }
            );
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error updating plan:', error);
        return NextResponse.json(
            { status: 500, message: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession();

        if (!session || session.userType !== 'admin') {
            return NextResponse.json(
                { status: 403, message: 'Unauthorized' },
                { status: 403 }
            );
        }

        const { id } = await params;

        const response = await fetch(`${API_URL}/payments/plans/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${session.accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            return NextResponse.json(
                { status: response.status, message: 'Failed to delete plan' },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error deleting plan:', error);
        return NextResponse.json(
            { status: 500, message: 'Internal server error' },
            { status: 500 }
        );
    }
}
