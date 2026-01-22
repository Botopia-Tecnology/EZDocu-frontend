import { getSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { FileStack, CreditCard, Users, Clock, Plus, ArrowRight, FileText, Upload, TrendingUp, AlertTriangle, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default async function TranslatorDashboard() {
  const session = await getSession();
  if (!session) redirect('/sign-in');

  const stats = { credits: 45, ordersActive: 8, ordersCompleted: 156, teamMembers: 3 };
  const lowCreditThreshold = 50;
  const hasLowCredits = stats.credits < lowCreditThreshold;

  const alerts = [
    ...(hasLowCredits ? [{ type: 'warning', message: `Low credits: ${stats.credits} remaining`, action: '/dashboard/credits' }] : []),
    { type: 'info', message: '2 orders stuck in OCR Review for >24h', action: '/dashboard/orders' },
  ];

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
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Welcome back, {session.user.firstName || 'Translator'}</h1>
          <p className="text-gray-500 mt-1">Here's what's happening with your orders today.</p>
        </div>
        <Link href="/dashboard/orders/new">
          <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg"><Plus className="h-4 w-4 mr-2" />New Order</Button>
        </Link>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((alert, i) => (
            <Link key={i} href={alert.action} className={`flex items-center justify-between p-4 rounded-xl border ${alert.type === 'warning' ? 'bg-amber-50 border-amber-200' : 'bg-blue-50 border-blue-200'}`}>
              <div className="flex items-center gap-3">
                {alert.type === 'warning' ? <AlertTriangle className="h-5 w-5 text-amber-600" /> : <AlertCircle className="h-5 w-5 text-blue-600" />}
                <span className={`text-sm font-medium ${alert.type === 'warning' ? 'text-amber-800' : 'text-blue-800'}`}>{alert.message}</span>
              </div>
              <ArrowRight className={`h-4 w-4 ${alert.type === 'warning' ? 'text-amber-600' : 'text-blue-600'}`} />
            </Link>
          ))}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        <div className={`bg-white rounded-xl border p-5 ${hasLowCredits ? 'border-amber-300' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${hasLowCredits ? 'bg-amber-50' : 'bg-emerald-50'}`}>
              <CreditCard className={`h-5 w-5 ${hasLowCredits ? 'text-amber-600' : 'text-emerald-600'}`} />
            </div>
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${hasLowCredits ? 'text-amber-600 bg-amber-50' : 'text-emerald-600 bg-emerald-50'}`}>
              {hasLowCredits ? 'Low' : 'Available'}
            </span>
          </div>
          <p className="mt-4 text-2xl font-semibold text-gray-900">{stats.credits.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-1">Credits balance</p>
        </div>
        <StatCard icon={Clock} iconBg="bg-blue-50" iconColor="text-blue-600" value={stats.ordersActive} label="Orders in progress" badge="Active" badgeColor="text-blue-600 bg-blue-50" />
        <StatCard icon={FileStack} iconBg="bg-gray-100" iconColor="text-gray-600" value={stats.ordersCompleted} label="Completed orders" trend="+12%" />
        <StatCard icon={Users} iconBg="bg-violet-50" iconColor="text-violet-600" value={stats.teamMembers} label="Team members" />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white rounded-xl border border-gray-200">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Recent Orders</h2>
            <Link href="/dashboard/orders" className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1">View all <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="divide-y divide-gray-100">
            {recentOrders.map((order) => {
              const status = statusConfig[order.status];
              return (
                <Link key={order.id} href={`/dashboard/orders/${order.id}`} className="flex items-center justify-between px-5 py-4 hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center"><FileText className="h-5 w-5 text-gray-400" /></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{order.name}</p>
                      <p className="text-xs text-gray-500">{order.pages} page(s) · {order.date}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${status.bg} ${status.color}`}>{status.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <QuickAction href="/dashboard/orders/new" icon={Upload} iconBg="bg-blue-50" iconColor="text-blue-600" title="Upload Document" desc="Start a new translation" />
              <QuickAction href="/dashboard/credits" icon={CreditCard} iconBg="bg-emerald-50" iconColor="text-emerald-600" title="Buy Credits" desc="Add to your balance" />
              <QuickAction href="/dashboard/team" icon={Users} iconBg="bg-violet-50" iconColor="text-violet-600" title="Invite Team" desc="Add team members" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-5 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Credits This Month</h3>
              <span className="text-xs bg-white/10 px-2 py-1 rounded-full">Jan 2026</span>
            </div>
            <div className="flex justify-between text-sm mb-2"><span className="text-gray-400">Used</span><span className="font-medium">350 credits</span></div>
            <div className="w-full bg-gray-700 rounded-full h-2 mb-2"><div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full" style={{ width: '28%' }} /></div>
            <p className="text-xs text-gray-400">{stats.credits} credits remaining</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, iconBg, iconColor, value, label, badge, badgeColor, trend }: { icon: React.ElementType; iconBg: string; iconColor: string; value: number; label: string; badge?: string; badgeColor?: string; trend?: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between">
        <div className={`w-10 h-10 ${iconBg} rounded-lg flex items-center justify-center`}><Icon className={`h-5 w-5 ${iconColor}`} /></div>
        {badge && <span className={`text-xs font-medium px-2 py-1 rounded-full ${badgeColor}`}>{badge}</span>}
        {trend && <span className="flex items-center gap-1 text-xs font-medium text-green-600"><TrendingUp className="h-3 w-3" />{trend}</span>}
      </div>
      <p className="mt-4 text-2xl font-semibold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500 mt-1">{label}</p>
    </div>
  );
}

function QuickAction({ href, icon: Icon, iconBg, iconColor, title, desc }: { href: string; icon: React.ElementType; iconBg: string; iconColor: string; title: string; desc: string }) {
  return (
    <Link href={href} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all group">
      <div className={`w-9 h-9 ${iconBg} rounded-lg flex items-center justify-center group-hover:opacity-80`}><Icon className={`h-4 w-4 ${iconColor}`} /></div>
      <div><p className="text-sm font-medium text-gray-900">{title}</p><p className="text-xs text-gray-500">{desc}</p></div>
    </Link>
  );
}
