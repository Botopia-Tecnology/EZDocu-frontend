
import { getSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) {
    redirect('/sign-in?redirect=/dashboard');
  }

  const user = session.user;
  // Fallback to check role from name or email if roles missing in session for now
  // In real implementation, pass roles properly
  const isOwner = true; // Placeholder: Logic to read role from session/token needed

  return (
    <main className="flex-1 p-4 overflow-y-auto p-8">
      <h1 className="text-2xl font-semibold mb-6">
        Welcome back, {user.firstName || user.name || 'User'}!
      </h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
          <h2 className="text-lg font-medium text-gray-900">My Projects</h2>
          <p className="mt-2 text-gray-500">View and manage your translation projects.</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
          <h2 className="text-lg font-medium text-gray-900">Credit Balance</h2>
          <p className="mt-2 text-3xl font-bold text-orange-600">1,250</p>
          <p className="text-sm text-gray-400">Credits available</p>
        </div>

        {isOwner && (
          <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
            <h2 className="text-lg font-medium text-gray-900">Team Management</h2>
            <p className="mt-2 text-gray-500">Invite members and manage permissions.</p>
          </div>
        )}
      </div>
    </main>
  );
}
