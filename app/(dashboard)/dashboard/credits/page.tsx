import { getSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { CreditsClient } from './credits-client';

export default async function CreditsPage() {
  const session = await getSession();
  if (!session) redirect('/sign-in');

  return (
    <CreditsClient
      accountId={session.activeAccountId || ''}
      userId={session.user.id}
      accessToken={session.accessToken || ''}
    />
  );
}
