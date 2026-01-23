import { getSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { SettingsClient } from './settings-client';

export default async function SettingsPage() {
  const session = await getSession();

  if (!session) {
    redirect('/sign-in');
  }

  // Convert undefined to null for compatibility
  const sessionWithNulls = {
    ...session,
    user: {
      ...session.user,
      firstName: session.user.firstName ?? null,
      lastName: session.user.lastName ?? null,
    }
  };

  return <SettingsClient session={sessionWithNulls} />;
}
