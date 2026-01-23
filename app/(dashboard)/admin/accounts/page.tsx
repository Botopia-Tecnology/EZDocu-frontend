import { getSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { AdminAccountsClient } from './accounts-client';

export default async function AdminAccountsPage() {
  const session = await getSession();

  console.log('Admin accounts page - session:', {
    hasSession: !!session,
    userType: session?.userType,
    hasToken: !!session?.accessToken,
    tokenPreview: session?.accessToken?.substring(0, 20)
  });

  if (!session || session.userType !== 'admin') {
    redirect('/dashboard');
  }

  if (!session.accessToken) {
    console.log('No access token - redirecting to sign-in');
    redirect('/sign-in');
  }

  return <AdminAccountsClient accessToken={session.accessToken} />;
}
