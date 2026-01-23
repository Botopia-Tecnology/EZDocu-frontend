import { getSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { SettingsClient } from './settings-client';

export default async function SettingsPage() {
  const session = await getSession();

  if (!session) {
    redirect('/sign-in');
  }

  return <SettingsClient session={session} />;
}
