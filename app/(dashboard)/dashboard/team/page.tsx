import { getSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { getTeamData } from './actions';
import { TeamClient } from './team-client';

export default async function TranslatorTeamPage() {
    const session = await getSession();

    if (!session) {
        redirect('/sign-in');
    }

    const teamData = await getTeamData();

    // If no team data or error, show empty state
    if (!teamData || teamData.status !== 200) {
        return (
            <TeamClient
                members={[]}
                pendingInvites={[]}
                accountName={session.accounts?.[0]?.name || 'My Account'}
                ownerId={session.user.id}
                currentUserId={session.user.id}
                userType={session.userType}
            />
        );
    }

    return (
        <TeamClient
            members={teamData.members}
            pendingInvites={teamData.pendingInvites}
            accountName={teamData.account.name}
            ownerId={teamData.account.ownerId}
            currentUserId={session.user.id}
            userType={session.userType}
        />
    );
}
