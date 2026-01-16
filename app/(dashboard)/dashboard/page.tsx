import { getSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  FileStack,
  CreditCard,
  Users,
  Clock,
  Plus,
  ArrowRight,
  FileText,
  Upload,
  TrendingUp
} from 'lucide-react';
import Link from 'next/link';

export default async function TranslatorDashboard() {
  const session = await getSession();

  if (!session) {
    redirect('/sign-in');
  }

  // Mock data
  const stats = {
    credits: 1250,
    ordersActive: 8,
    ordersCompleted: 156,
    teamMembers: 3,
  };

  const recentOrders = [
    { id: '1', name: 'Birth Certificate - Garcia', status: 'translation', pages: 2, date: '2 hours ago' },
    { id: '2', name: 'Diploma - Universidad Central', status: 'ocr_review', pages: 4, date: '5 hours ago' },
    { id: '3', name: 'Marriage License - Smith', status: 'completed', pages: 1, date: 'Yesterday' },
    { id: '4', name: 'Passport - Martinez', status: 'uploaded', pages: 2, date: 'Yesterday' },
  ];

  const statusConfig: Record<string, { color: string; bg: string; label: string }> = {
    uploaded: { color: 'text-gray-600', bg: 'bg-gray-100', label: 'Uploaded' },
    ocr_review: { color: 'text-amber-600', bg: 'bg-amber-50', label: 'OCR Review' },
    translation: { color: 'text-blue-600', bg: 'bg-blue-50', label: 'Translating' },
    completed: { color: 'text-green-600', bg: 'bg-green-50', label: 'Completed' },
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Welcome back, {session.user.firstName || 'Translator'}
          </h1>
          <p className="text-gray-500 mt-1">Here's what's happening with your orders today.</p>
        </div>
        <Link href="/dashboard/orders/new">
          <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg">
            <Plus className="h-4 w-4 mr-2" />
            New Order
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
              <CreditCard className="h-5 w-5 text-emerald-600" />
            </div>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">Available</span>
          </div>
          <p className="mt-4 text-2xl font-semibold text-gray-900">{stats.credits.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-1">Credits balance</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">Active</span>
          </div>
          <p className="mt-4 text-2xl font-semibold text-gray-900">{stats.ordersActive}</p>
          <p className="text-sm text-gray-500 mt-1">Orders in progress</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <FileStack className="h-5 w-5 text-gray-600" />
            </div>
            <div className="flex items-center gap-1 text-xs font-medium text-green-600">
              <TrendingUp className="h-3 w-3" />
              +12%
            </div>
          </div>
          <p className="mt-4 text-2xl font-semibold text-gray-900">{stats.ordersCompleted}</p>
          <p className="text-sm text-gray-500 mt-1">Completed orders</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 bg-violet-50 rounded-lg flex items-center justify-center">
              <Users className="h-5 w-5 text-violet-600" />
            </div>
          </div>
          <p className="mt-4 text-2xl font-semibold text-gray-900">{stats.teamMembers}</p>
          <p className="text-sm text-gray-500 mt-1">Team members</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Recent Orders</h2>
            <Link href="/dashboard/orders" className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1 transition-colors">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {recentOrders.map((order) => {
              const status = statusConfig[order.status];
              return (
                <Link
                  key={order.id}
                  href={`/dashboard/orders/${order.id}`}
                  className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <FileText className="h-5 w-5 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{order.name}</p>
                      <p className="text-xs text-gray-500">{order.pages} page(s) · {order.date}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${status.bg} ${status.color}`}>
                    {status.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                href="/dashboard/orders/new"
                className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all group"
              >
                <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                  <Upload className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Upload Document</p>
                  <p className="text-xs text-gray-500">Start a new translation</p>
                </div>
              </Link>

              <Link
                href="/dashboard/credits"
                className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all group"
              >
                <div className="w-9 h-9 bg-emerald-50 rounded-lg flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                  <CreditCard className="h-4 w-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Buy Credits</p>
                  <p className="text-xs text-gray-500">Add to your balance</p>
                </div>
              </Link>

              <Link
                href="/dashboard/team"
                className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all group"
              >
                <div className="w-9 h-9 bg-violet-50 rounded-lg flex items-center justify-center group-hover:bg-violet-100 transition-colors">
                  <Users className="h-4 w-4 text-violet-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Invite Team</p>
                  <p className="text-xs text-gray-500">Add team members</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Credit Usage */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-5 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Credits This Month</h3>
              <span className="text-xs bg-white/10 px-2 py-1 rounded-full">Jan 2026</span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Used</span>
                <span className="font-medium">350 credits</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full" style={{ width: '28%' }} />
              </div>
              <p className="text-xs text-gray-400">1,250 credits remaining</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
