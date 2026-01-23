import { getSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { AccountDetailClient } from './account-detail-client';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AccountDetailPage({ params }: PageProps) {
  const session = await getSession();
  const { id } = await params;

  if (!session || session.userType !== 'admin') {
    redirect('/dashboard');
  }

  if (!session.accessToken) {
    redirect('/sign-in');
  }

  return <AccountDetailClient accountId={id} accessToken={session.accessToken} />;
}
