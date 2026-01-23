import { getSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { SettingsClient } from './settings-client';

export default async function SettingsPage() {
  const session = await getSession();

  if (!session) {
    redirect('/sign-in');
  }

  // Build the session object with only the fields needed by SettingsClient
  const clientSession = {
    user: {
      id: session.user.id,
      firstName: session.user.firstName ?? null,
      lastName: session.user.lastName ?? null,
      email: session.user.email,
    },
    accounts: session.accounts.map(acc => ({
      id: acc.id,
      name: acc.name,
    })),
  };

  return <SettingsClient session={clientSession} />;
}
