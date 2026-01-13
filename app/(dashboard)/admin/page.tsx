
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';

export default async function AdminPage() {
    const session = await getSession();

    // Note: Middleware protects this route for authentication.
    // We should ideally check for role here too or in a guard component.
    // Since session.accessToken usually has roles, verifyToken in middleware could enforce it.

    if (!session) {
        redirect('/sign-in');
    }

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">SaaS Admin Dashboard</h1>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div className="p-6 bg-white rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-2">Tenants</h2>
                    <p className="text-gray-600">Manage all agency accounts.</p>
                </div>
                <div className="p-6 bg-white rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-2">Global Usage</h2>
                    <p className="text-gray-600">Track system-wide credit consumption.</p>
                </div>
            </div>
        </div>
    );
}
