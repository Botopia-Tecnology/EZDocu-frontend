import { getSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import PlansAdminClient from './plans-admin-client';

export default async function AdminPlansPage() {
    const session = await getSession();
    if (!session || session.userType !== 'admin') redirect('/dashboard');

    return <PlansAdminClient accessToken={session.accessToken} />;
}
