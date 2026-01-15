import { getSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  FileStack,
  CreditCard,
  Calendar,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default async function AdminAnalyticsPage() {
  const session = await getSession();

  if (!session || session.userType !== 'admin') {
    redirect('/dashboard');
  }

  const metrics = [
    { label: 'Total Revenue', value: '$45,230', change: '+12.5%', trend: 'up', icon: DollarSign, color: 'emerald' },
    { label: 'Active Users', value: '1,234', change: '+8.2%', trend: 'up', icon: Users, color: 'blue' },
    { label: 'Orders Processed', value: '3,456', change: '+15.3%', trend: 'up', icon: FileStack, color: 'violet' },
    { label: 'Credits Sold', value: '89,120', change: '-2.1%', trend: 'down', icon: CreditCard, color: 'amber' },
  ];

  const topLanguagePairs = [
    { from: 'Spanish', to: 'English', orders: 1234, percentage: 45 },
    { from: 'Portuguese', to: 'English', orders: 567, percentage: 21 },
    { from: 'French', to: 'English', orders: 345, percentage: 13 },
    { from: 'German', to: 'English', orders: 234, percentage: 9 },
    { from: 'Other', to: 'Various', orders: 320, percentage: 12 },
  ];

  const monthlyData = [
    { month: 'Jul', orders: 320, revenue: 6400 },
    { month: 'Aug', orders: 380, revenue: 7600 },
    { month: 'Sep', orders: 420, revenue: 8400 },
    { month: 'Oct', orders: 390, revenue: 7800 },
    { month: 'Nov', orders: 480, revenue: 9600 },
    { month: 'Dec', orders: 520, revenue: 10400 },
    { month: 'Jan', orders: 523, revenue: 10460 },
  ];

  const maxOrders = Math.max(...monthlyData.map(d => d.orders));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Analytics</h1>
          <p className="text-gray-500 mt-1">Platform performance and insights</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span className="text-gray-600">Last 30 days</span>
          </div>
          <Button variant="outline" className="rounded-lg">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between">
              <div className={`w-10 h-10 bg-${metric.color}-50 rounded-lg flex items-center justify-center`}>
                <metric.icon className={`h-5 w-5 text-${metric.color}-600`} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-medium ${
                metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {metric.trend === 'up' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {metric.change}
              </div>
            </div>
            <p className="mt-4 text-2xl font-semibold text-gray-900">{metric.value}</p>
            <p className="text-sm text-gray-500 mt-1">{metric.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-900 mb-6">Orders Over Time</h3>
          <div className="flex items-end justify-between gap-2 h-48">
            {monthlyData.map((data, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-gradient-to-t from-blue-500 to-indigo-500 rounded-t-md transition-all hover:from-blue-600 hover:to-indigo-600"
                  style={{ height: `${(data.orders / maxOrders) * 100}%` }}
                />
                <span className="text-xs text-gray-500">{data.month}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500" />
              <span className="text-sm text-gray-500">Orders</span>
            </div>
          </div>
        </div>

        {/* Language Pairs */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-900 mb-6">Top Language Pairs</h3>
          <div className="space-y-4">
            {topLanguagePairs.map((pair, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-700">{pair.from} → {pair.to}</span>
                  <span className="text-sm font-medium text-gray-900">{pair.orders}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full"
                    style={{ width: `${pair.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Document Types */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Document Types</h3>
          <div className="space-y-3">
            {[
              { type: 'Birth Certificates', count: 456, percentage: 35 },
              { type: 'Diplomas & Transcripts', count: 312, percentage: 24 },
              { type: 'Legal Documents', count: 234, percentage: 18 },
              { type: 'Immigration Forms', count: 189, percentage: 15 },
              { type: 'Other', count: 104, percentage: 8 },
            ].map((doc, i) => (
              <div key={i} className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600">{doc.type}</span>
                <div className="flex items-center gap-3">
                  <div className="w-24 bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-gray-900 h-2 rounded-full"
                      style={{ width: `${doc.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-12 text-right">{doc.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Breakdown */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Revenue Breakdown</h3>
          <div className="space-y-3">
            {[
              { source: 'Scanned Documents (OCR)', amount: 28450, percentage: 63 },
              { source: 'Digital Documents', amount: 12340, percentage: 27 },
              { source: 'Rush Processing', amount: 3210, percentage: 7 },
              { source: 'Additional Services', amount: 1230, percentage: 3 },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600">{item.source}</span>
                <div className="flex items-center gap-3">
                  <div className="w-24 bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-emerald-500 h-2 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-20 text-right">${item.amount.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Total Revenue</span>
            <span className="text-lg font-semibold text-gray-900">$45,230</span>
          </div>
        </div>
      </div>
    </div>
  );
}
