'use server';

import { getSession } from '@/lib/auth/session';
import { API_URL } from '@/lib/api';
import { revalidatePath } from 'next/cache';

export interface TeamMemberBasic {
    id: string;
    firstName: string;
    lastName: string;
}

export interface Order {
    id: string;
    orderNumber: string;
    documentName: string;
    status: string;
    documentType: 'image' | 'text';
    documentCategory: string;
    totalPages: number;
    creditsEstimated: number;
    creditsConsumed: number;
    sourceLanguage: string;
    targetLanguage: string;
    createdBy: TeamMemberBasic | null;
    assignedTo: TeamMemberBasic | null;
    createdAt: string;
    updatedAt: string;
}

export interface OrdersData {
    status: number;
    orders: Order[];
    stats: {
        total: number;
        inProgress: number;
        completed: number;
        thisMonth: number;
    };
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
    message?: string;
}

export async function getOrders(
    page = 1,
    limit = 10,
    status = 'all',
    search = ''
): Promise<OrdersData | null> {
    const session = await getSession();
    if (!session || !session.activeAccountId || !session.accessToken) {
        return null;
    }

    try {
        const params = new URLSearchParams({
            page: String(page),
            limit: String(limit),
            status,
            search,
        });

        const response = await fetch(`${API_URL}/orders?${params}`, {
            headers: {
                Authorization: `Bearer ${session.accessToken}`,
                'Content-Type': 'application/json',
            },
            cache: 'no-store',
        });

        if (!response.ok) {
            console.error('Failed to fetch orders:', response.status);
            return null;
        }

        return response.json();
    } catch (error) {
        console.error('Error fetching orders:', error);
        return null;
    }
}

export async function getTeamMembers(): Promise<TeamMemberBasic[]> {
    const session = await getSession();
    if (!session || !session.activeAccountId || !session.accessToken) {
        return [];
    }

    try {
        const response = await fetch(
            `${API_URL}/auth/team/${session.activeAccountId}`,
            {
                headers: {
                    Authorization: `Bearer ${session.accessToken}`,
                    'Content-Type': 'application/json',
                },
                cache: 'no-store',
            }
        );

        if (!response.ok) {
            console.error('Failed to fetch team:', response.status);
            return [];
        }

        const data = await response.json();
        if (data.status !== 200) {
            return [];
        }

        // Return active members only
        return data.members
            .filter((m: { isActive: boolean }) => m.isActive)
            .map((m: { id: string; firstName: string; lastName: string }) => ({
                id: m.id,
                firstName: m.firstName,
                lastName: m.lastName,
            }));
    } catch (error) {
        console.error('Error fetching team:', error);
        return [];
    }
}

export async function assignOrder(
    orderId: string,
    assignedToId: string
): Promise<{ success: boolean; message: string }> {
    const session = await getSession();
    if (!session || !session.activeAccountId || !session.accessToken) {
        return { success: false, message: 'Not authenticated' };
    }

    try {
        const response = await fetch(`${API_URL}/orders/${orderId}/assign`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${session.accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ assignedToId }),
        });

        const data = await response.json();

        if (data.status === 200) {
            revalidatePath('/dashboard/orders');
            return { success: true, message: 'Order assigned successfully' };
        }

        return { success: false, message: data.message || 'Failed to assign order' };
    } catch (error) {
        console.error('Error assigning order:', error);
        return { success: false, message: 'Failed to assign order' };
    }
}
