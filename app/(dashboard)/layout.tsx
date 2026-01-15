import { getSession } from '@/lib/auth/session';
import { Sidebar } from '@/components/dashboard';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session) {
    redirect('/sign-in');
  }

  const userName = session.user.firstName
    ? `${session.user.firstName} ${session.user.lastName || ''}`
    : session.user.email;

  const accountName = session.accounts[0]?.name;

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        userType={session.userType}
        userName={userName}
        accountName={accountName}
      />
      <main className="ml-64 p-8">
        {children}
      </main>
    </div>
  );
}
