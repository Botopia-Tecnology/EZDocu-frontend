import { getSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { Building2, FileStack, CreditCard, TrendingUp, AlertTriangle, ArrowRight, Activity, XCircle } from 'lucide-react';
import Link from 'next/link';
import { stats, operationalAlerts, topAccounts, ordersByStatus, alertStyles, type Alert } from '@/lib/data/admin-dashboard';

export default async function AdminDashboard() {
  const session = await getSession();
  if (!session || session.userType !== 'admin') redirect('/dashboard');

  const errorAlerts = operationalAlerts.filter(a => a.type === 'error');
  const warningAlerts = operationalAlerts.filter(a => a.type === 'warning');

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">System overview and management</p>
        </div>
        <span className="flex items-center gap-1.5 text-sm text-green-600">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />System Online
        </span>
      </div>

      {/* Operational Alerts */}
      {operationalAlerts.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          {errorAlerts.length > 0 && <AlertCard alerts={errorAlerts} type="error" />}
          {warningAlerts.length > 0 && <AlertCard alerts={warningAlerts} type="warning" />}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard icon={Building2} iconBg="bg-violet-50" iconColor="text-violet-600" value={stats.totalAccounts} label="Total accounts" sub={`${stats.activeAccounts} active`} trend="+12%" />
        <StatCard icon={FileStack} iconBg="bg-blue-50" iconColor="text-blue-600" value={stats.ordersToday} label="Orders today" sub={`${stats.ordersThisWeek} this week`} trend="+8%" />
        <StatCard icon={CreditCard} iconBg="bg-emerald-50" iconColor="text-emerald-600" value={stats.creditsConsumed.toLocaleString()} label="Credits consumed" sub={`${stats.creditsSold.toLocaleString()} sold`} />
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center"><TrendingUp className="h-5 w-5" /></div>
            <span className="flex items-center gap-1 text-xs font-medium text-green-400"><TrendingUp className="h-3 w-3" />+15%</span>
          </div>
          <p className="mt-4 text-2xl font-semibold">${stats.revenue.toLocaleString()}</p>
          <p className="text-sm text-gray-400 mt-1">Revenue this month</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white rounded-xl border border-gray-200">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Top Accounts</h2>
            <Link href="/admin/accounts" className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1">View all <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="divide-y divide-gray-100">
            {topAccounts.map((acc, i) => (
              <div key={i} className="px-5 py-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-semibold text-gray-600">#{i + 1}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{acc.name}</p>
                    <p className="text-xs text-gray-500">{acc.credits.toLocaleString()} credits used</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{acc.orders}</p>
                  <p className="text-xs text-gray-500">orders</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-5 py-4 border-b border-gray-100"><h2 className="font-semibold text-gray-900">Orders by Status</h2></div>
          <div className="p-5">
            <div className="flex h-3 rounded-full overflow-hidden mb-6">
              {ordersByStatus.map((item, i) => <div key={i} className={item.color} style={{ width: item.width }} />)}
            </div>
            <div className="space-y-3">
              {ordersByStatus.map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3"><span className={`w-3 h-3 rounded-full ${item.color}`} /><span className="text-sm text-gray-600">{item.status}</span></div>
                  <span className="text-sm font-medium text-gray-900">{item.count}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-sm text-gray-500">Total orders</span>
              <span className="text-lg font-semibold text-gray-900">{ordersByStatus.reduce((s, i) => s + i.count, 0)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Activity */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
          <Activity className="h-5 w-5 text-gray-400" /><h2 className="font-semibold text-gray-900">Recent Activity</h2>
          <span className="ml-auto text-xs text-gray-500">Last 24 hours</span>
        </div>
        <div className="grid grid-cols-4 divide-x divide-gray-100">
          {[{ v: '89', l: 'New orders' }, { v: '12', l: 'New users' }, { v: '3,240', l: 'Credits sold' }, { v: '98.5%', l: 'Uptime' }].map((s, i) => (
            <div key={i} className="p-5 text-center">
              <p className="text-2xl font-semibold text-gray-900">{s.v}</p>
              <p className="text-sm text-gray-500 mt-1">{s.l}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, iconBg, iconColor, value, label, sub, trend }: { icon: React.ElementType; iconBg: string; iconColor: string; value: string | number; label: string; sub?: string; trend?: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between">
        <div className={`w-10 h-10 ${iconBg} rounded-lg flex items-center justify-center`}><Icon className={`h-5 w-5 ${iconColor}`} /></div>
        {trend && <span className="flex items-center gap-1 text-xs font-medium text-green-600"><TrendingUp className="h-3 w-3" />{trend}</span>}
      </div>
      <p className="mt-4 text-2xl font-semibold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500 mt-1">{label}</p>
      {sub && <p className="text-xs text-green-600 mt-2">{sub}</p>}
    </div>
  );
}

function AlertCard({ alerts, type }: { alerts: Alert[]; type: 'error' | 'warning' }) {
  const style = alertStyles[type];
  const Icon = type === 'error' ? XCircle : AlertTriangle;
  const total = alerts.reduce((s, a) => s + (a.count || 1), 0);
  return (
    <div className={`${style.bg} border ${style.border} rounded-xl p-4`}>
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 ${type === 'error' ? 'bg-red-100' : 'bg-amber-100'} rounded-lg flex items-center justify-center`}>
          <Icon className={`h-5 w-5 ${style.icon}`} />
        </div>
        <div>
          <p className={`text-sm font-semibold ${style.text}`}>{total} {type === 'error' ? 'Critical Issues' : 'Warnings'}</p>
          <p className={`text-xs ${type === 'error' ? 'text-red-600' : 'text-amber-600'}`}>Requires attention</p>
        </div>
      </div>
      <div className="space-y-2">
        {alerts.map(a => (
          <div key={a.id} className="flex items-center justify-between text-sm">
            <span className={style.text}>{a.message} ({a.count})</span>
            <span className={`text-xs ${type === 'error' ? 'text-red-500' : 'text-amber-500'}`}>{a.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
