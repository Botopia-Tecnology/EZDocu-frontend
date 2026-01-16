import { getSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Building2,
  Search,
  Plus,
  MoreHorizontal,
  Users,
  CreditCard,
  FileStack,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';

export default async function AdminAccountsPage() {
  const session = await getSession();

  if (!session || session.userType !== 'admin') {
    redirect('/dashboard');
  }

  const accounts = [
    { id: 1, name: 'Legal Translations Inc', email: 'contact@legaltrans.com', members: 5, credits: 2890, orders: 145, status: 'active', plan: 'Pro' },
    { id: 2, name: 'Immigration Services LLC', email: 'info@immservices.com', members: 3, credits: 1960, orders: 98, status: 'active', plan: 'Pro' },
    { id: 3, name: 'Global Docs Pro', email: 'hello@globaldocs.com', members: 8, credits: 1520, orders: 76, status: 'active', plan: 'Enterprise' },
    { id: 4, name: 'Quick Translate Co', email: 'support@quicktrans.co', members: 2, credits: 1080, orders: 54, status: 'active', plan: 'Starter' },
    { id: 5, name: 'Certified Translators', email: 'team@certifiedtrans.com', members: 4, credits: 450, orders: 32, status: 'active', plan: 'Pro' },
    { id: 6, name: 'DocuLegal Partners', email: 'info@doculegal.com', members: 6, credits: 0, orders: 28, status: 'inactive', plan: 'Pro' },
    { id: 7, name: 'FastDocs Agency', email: 'contact@fastdocs.io', members: 2, credits: 890, orders: 45, status: 'active', plan: 'Starter' },
    { id: 8, name: 'Premier Translation', email: 'hello@premiertrans.com', members: 10, credits: 3200, orders: 189, status: 'active', plan: 'Enterprise' },
  ];

  const statusConfig: Record<string, { color: string; bg: string }> = {
    active: { color: 'text-green-700', bg: 'bg-green-50' },
    inactive: { color: 'text-gray-600', bg: 'bg-gray-100' },
    suspended: { color: 'text-red-700', bg: 'bg-red-50' },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Accounts</h1>
          <p className="text-gray-500 mt-1">Manage all registered accounts</p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg">
          <Plus className="h-4 w-4 mr-2" />
          Add Account
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search accounts..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          />
        </div>
        <select className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-900">
          <option>All Status</option>
          <option>Active</option>
          <option>Inactive</option>
          <option>Suspended</option>
        </select>
        <select className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-900">
          <option>All Plans</option>
          <option>Starter</option>
          <option>Pro</option>
          <option>Enterprise</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Account</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Members</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Credits</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {accounts.map((account) => {
              const status = statusConfig[account.status];
              return (
                <tr key={account.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{account.name}</p>
                        <p className="text-xs text-gray-500">{account.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-gray-900">{account.plan}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5 text-sm text-gray-600">
                      <Users className="h-4 w-4" />
                      {account.members}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5 text-sm text-gray-600">
                      <CreditCard className="h-4 w-4" />
                      {account.credits.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5 text-sm text-gray-600">
                      <FileStack className="h-4 w-4" />
                      {account.orders}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${status.bg} ${status.color}`}>
                      {account.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-500">Showing 1-8 of 156 accounts</p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" className="h-8 w-8 bg-purple-600 text-white border-purple-600">1</Button>
            <Button variant="outline" size="sm" className="h-8 w-8">2</Button>
            <Button variant="outline" size="sm" className="h-8 w-8">3</Button>
            <span className="text-gray-400">...</span>
            <Button variant="outline" size="sm" className="h-8 w-8">20</Button>
            <Button variant="outline" size="sm" className="h-8">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
