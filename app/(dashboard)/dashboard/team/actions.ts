'use server';

import { getSession } from '@/lib/auth/session';
import { API_URL } from '@/lib/api';
import { revalidatePath } from 'next/cache';

export interface TeamMember {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    isOwner: boolean;
    isActive: boolean;
    joinedAt: string;
}

export interface PendingInvite {
    id: string;
    email: string;
    sentAt: string;
    expiresAt: string;
}

export interface TeamData {
    status: number;
    account: {
        id: string;
        name: string;
        ownerId: string;
    };
    members: TeamMember[];
    pendingInvites: PendingInvite[];
    message?: string;
}

export async function getTeamData(): Promise<TeamData | null> {
    const session = await getSession();
    if (!session || !session.activeAccountId || !session.accessToken) {
        return null;
    }

    try {
        const response = await fetch(
            `${API_URL}/auth/team/${session.activeAccountId}`,
            {
                headers: {
                    'Authorization': `Bearer ${session.accessToken}`,
                    'Content-Type': 'application/json',
                },
                cache: 'no-store',
            }
        );

        if (!response.ok) {
            console.error('Failed to fetch team data:', response.status);
            return null;
        }

        return response.json();
    } catch (error) {
        console.error('Error fetching team data:', error);
        return null;
    }
}

export async function inviteMember(email: string, firstName: string, lastName: string): Promise<{ success: boolean; message: string }> {
    const session = await getSession();
    if (!session || !session.activeAccountId || !session.accessToken) {
        return { success: false, message: 'Not authenticated' };
    }

    try {
        const response = await fetch(
            `${API_URL}/auth/team/${session.activeAccountId}/invite`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${session.accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, firstName, lastName }),
            }
        );

        const data = await response.json();

        if (data.status === 201) {
            revalidatePath('/dashboard/team');
            return { success: true, message: 'Invitation sent successfully' };
        }

        return { success: false, message: data.message || 'Failed to send invitation' };
    } catch (error) {
        console.error('Error inviting member:', error);
        return { success: false, message: 'Failed to send invitation' };
    }
}

export async function cancelInvite(inviteId: string): Promise<{ success: boolean; message: string }> {
    const session = await getSession();
    if (!session || !session.activeAccountId || !session.accessToken) {
        return { success: false, message: 'Not authenticated' };
    }

    try {
        const response = await fetch(
            `${API_URL}/auth/team/${session.activeAccountId}/invite/${inviteId}`,
            {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${session.accessToken}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        const data = await response.json();

        if (data.status === 200) {
            revalidatePath('/dashboard/team');
            return { success: true, message: 'Invitation cancelled' };
        }

        return { success: false, message: data.message || 'Failed to cancel invitation' };
    } catch (error) {
        console.error('Error cancelling invite:', error);
        return { success: false, message: 'Failed to cancel invitation' };
    }
}

export async function resendInvite(inviteId: string): Promise<{ success: boolean; message: string }> {
    const session = await getSession();
    if (!session || !session.activeAccountId || !session.accessToken) {
        return { success: false, message: 'Not authenticated' };
    }

    try {
        const response = await fetch(
            `${API_URL}/auth/team/${session.activeAccountId}/invite/${inviteId}/resend`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${session.accessToken}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        const data = await response.json();

        if (data.status === 200) {
            revalidatePath('/dashboard/team');
            return { success: true, message: 'Invitation resent' };
        }

        return { success: false, message: data.message || 'Failed to resend invitation' };
    } catch (error) {
        console.error('Error resending invite:', error);
        return { success: false, message: 'Failed to resend invitation' };
    }
}

export async function removeMember(memberId: string): Promise<{ success: boolean; message: string }> {
    const session = await getSession();
    if (!session || !session.activeAccountId || !session.accessToken) {
        return { success: false, message: 'Not authenticated' };
    }

    try {
        const response = await fetch(
            `${API_URL}/auth/team/${session.activeAccountId}/member/${memberId}`,
            {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${session.accessToken}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        const data = await response.json();

        if (data.status === 200) {
            revalidatePath('/dashboard/team');
            return { success: true, message: 'Member removed' };
        }

        return { success: false, message: data.message || 'Failed to remove member' };
    } catch (error) {
        console.error('Error removing member:', error);
        return { success: false, message: 'Failed to remove member' };
    }
}

export async function toggleMemberStatus(memberId: string, isActive: boolean): Promise<{ success: boolean; message: string }> {
    const session = await getSession();
    if (!session || !session.activeAccountId || !session.accessToken) {
        return { success: false, message: 'Not authenticated' };
    }

    try {
        const url = `${API_URL}/auth/team/${session.activeAccountId}/member/${memberId}/status`;
        console.log('Calling API:', url, { isActive });

        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${session.accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ isActive }),
        });

        const data = await response.json();
        console.log('API Response:', response.status, data);

        if (data.status === 200) {
            revalidatePath('/dashboard/team');
            return { success: true, message: isActive ? 'Member activated' : 'Member deactivated' };
        }

        return { success: false, message: data.message || 'Failed to update member status' };
    } catch (error) {
        console.error('Error toggling member status:', error);
        return { success: false, message: 'Failed to update member status' };
    }
}
