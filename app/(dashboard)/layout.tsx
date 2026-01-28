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
  const accountLogo = session.accounts[0]?.logoUrl;

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        userType={session.userType}
        userName={userName}
        accountName={accountName}
        accountLogo={accountLogo}
      />
      {/* Main content - add top padding on mobile for fixed header, left margin on desktop for sidebar */}
      <main className="pt-20 lg:pt-8 px-4 pb-8 lg:ml-64 lg:px-8">
        {children}
      </main>
    </div>
  );
}
