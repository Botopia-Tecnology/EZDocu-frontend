'use server';

import { getSession, setSession } from '@/lib/auth/session';

export async function updateProfile(firstName: string, lastName: string) {
    const session = await getSession();

    if (!session || !session.accessToken) {
        return { status: 401, message: 'Not authenticated' };
    }

    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
        const response = await fetch(`${apiUrl}/auth/update-profile`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.accessToken}`,
            },
            body: JSON.stringify({ firstName, lastName }),
        });

        const result = await response.json();

        // If successful, update the local session with new names
        if (result.status === 200) {
            await setSession(
                {
                    id: session.user.id,
                    email: session.user.email,
                    firstName,
                    lastName,
                },
                session.userType,
                session.accounts,
                session.accessToken,
                session.activeAccountId
            );
        }

        return result;
    } catch (error) {
        console.error('Update profile error:', error);
        return { status: 500, message: 'Connection error. Please try again.' };
    }
}

export async function changePassword(currentPassword: string, newPassword: string) {
    const session = await getSession();

    if (!session || !session.accessToken) {
        return { status: 401, message: 'Not authenticated' };
    }

    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
        const response = await fetch(`${apiUrl}/auth/change-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.accessToken}`,
            },
            body: JSON.stringify({ currentPassword, newPassword }),
        });

        return await response.json();
    } catch (error) {
        console.error('Change password error:', error);
        return { status: 500, message: 'Connection error. Please try again.' };
    }
}
