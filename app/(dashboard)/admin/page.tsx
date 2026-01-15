import { getSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import {
  Building2,
  FileStack,
  CreditCard,
  TrendingUp,
  AlertTriangle,
  AlertCircle,
  ArrowRight,
  Users,
  Activity
} from 'lucide-react';
import Link from 'next/link';

export default async function AdminDashboard() {
  const session = await getSession();

  if (!session || session.userType !== 'admin') {
    redirect('/dashboard');
  }

  const stats = {
    totalAccounts: 156,
    activeAccounts: 142,
    ordersToday: 89,
    ordersThisWeek: 523,
    creditsConsumed: 12450,
    creditsSold: 15000,
    revenue: 12450,
  };

  const alerts = [
    { id: 1, type: 'warning', message: '3 accounts with low credits (<10)', time: '5 min ago' },
    { id: 2, type: 'error', message: '2 OCR processing failures', time: '15 min ago' },
  ];

  const topAccounts = [
    { name: 'Legal Translations Inc', orders: 145, credits: 2890 },
    { name: 'Immigration Services LLC', orders: 98, credits: 1960 },
    { name: 'Global Docs Pro', orders: 76, credits: 1520 },
    { name: 'Quick Translate Co', orders: 54, credits: 1080 },
  ];

  const ordersByStatus = [
    { status: 'Completed', count: 423, color: 'bg-green-500', width: '81%' },
    { status: 'In Translation', count: 45, color: 'bg-blue-500', width: '9%' },
    { status: 'OCR Review', count: 32, color: 'bg-amber-500', width: '6%' },
    { status: 'Uploaded', count: 23, color: 'bg-gray-400', width: '4%' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">System overview and management</p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="flex items-center gap-1.5 text-green-600">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            System Online
          </span>
        </div>
      </div>

      {/* Alerts Banner */}
      {alerts.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-amber-800">{alerts.length} active alerts</p>
                <p className="text-xs text-amber-600">{alerts[0].message}</p>
              </div>
            </div>
            <Link
              href="/admin/alerts"
              className="text-sm font-medium text-amber-700 hover:text-amber-800 flex items-center gap-1"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 bg-violet-50 rounded-lg flex items-center justify-center">
              <Building2 className="h-5 w-5 text-violet-600" />
            </div>
            <div className="flex items-center gap-1 text-xs font-medium text-green-600">
              <TrendingUp className="h-3 w-3" />
              +12%
            </div>
          </div>
          <p className="mt-4 text-2xl font-semibold text-gray-900">{stats.totalAccounts}</p>
          <p className="text-sm text-gray-500 mt-1">Total accounts</p>
          <p className="text-xs text-green-600 mt-2">{stats.activeAccounts} active</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <FileStack className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex items-center gap-1 text-xs font-medium text-green-600">
              <TrendingUp className="h-3 w-3" />
              +8%
            </div>
          </div>
          <p className="mt-4 text-2xl font-semibold text-gray-900">{stats.ordersToday}</p>
          <p className="text-sm text-gray-500 mt-1">Orders today</p>
          <p className="text-xs text-gray-500 mt-2">{stats.ordersThisWeek} this week</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
              <CreditCard className="h-5 w-5 text-emerald-600" />
            </div>
          </div>
          <p className="mt-4 text-2xl font-semibold text-gray-900">{stats.creditsConsumed.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-1">Credits consumed</p>
          <p className="text-xs text-emerald-600 mt-2">{stats.creditsSold.toLocaleString()} sold</p>
        </div>

        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div className="flex items-center gap-1 text-xs font-medium text-green-400">
              <TrendingUp className="h-3 w-3" />
              +15%
            </div>
          </div>
          <p className="mt-4 text-2xl font-semibold">${stats.revenue.toLocaleString()}</p>
          <p className="text-sm text-gray-400 mt-1">Revenue this month</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Accounts */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Top Accounts</h2>
            <Link href="/admin/accounts" className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1 transition-colors">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {topAccounts.map((account, i) => (
              <div key={i} className="px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-semibold text-gray-600">#{i + 1}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{account.name}</p>
                    <p className="text-xs text-gray-500">{account.credits.toLocaleString()} credits used</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{account.orders}</p>
                  <p className="text-xs text-gray-500">orders</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Status */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Orders by Status</h2>
          </div>
          <div className="p-5">
            {/* Status bar */}
            <div className="flex h-3 rounded-full overflow-hidden mb-6">
              {ordersByStatus.map((item, i) => (
                <div
                  key={i}
                  className={`${item.color} ${i === 0 ? 'rounded-l-full' : ''} ${i === ordersByStatus.length - 1 ? 'rounded-r-full' : ''}`}
                  style={{ width: item.width }}
                />
              ))}
            </div>

            {/* Legend */}
            <div className="space-y-3">
              {ordersByStatus.map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`w-3 h-3 rounded-full ${item.color}`} />
                    <span className="text-sm text-gray-600">{item.status}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{item.count}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Total orders</span>
                <span className="text-lg font-semibold text-gray-900">
                  {ordersByStatus.reduce((sum, item) => sum + item.count, 0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* System Activity */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-gray-400" />
            <h2 className="font-semibold text-gray-900">Recent Activity</h2>
          </div>
          <span className="text-xs text-gray-500">Last 24 hours</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
          <div className="p-5 text-center">
            <p className="text-2xl font-semibold text-gray-900">89</p>
            <p className="text-sm text-gray-500 mt-1">New orders</p>
          </div>
          <div className="p-5 text-center">
            <p className="text-2xl font-semibold text-gray-900">12</p>
            <p className="text-sm text-gray-500 mt-1">New users</p>
          </div>
          <div className="p-5 text-center">
            <p className="text-2xl font-semibold text-gray-900">3,240</p>
            <p className="text-sm text-gray-500 mt-1">Credits sold</p>
          </div>
          <div className="p-5 text-center">
            <p className="text-2xl font-semibold text-gray-900">98.5%</p>
            <p className="text-sm text-gray-500 mt-1">Uptime</p>
          </div>
        </div>
      </div>
    </div>
  );
}
