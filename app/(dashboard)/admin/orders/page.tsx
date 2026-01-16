import { getSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  FileText,
  Search,
  Filter,
  Download,
  Eye,
  ChevronLeft,
  ChevronRight,
  Building2
} from 'lucide-react';

export default async function AdminOrdersPage() {
  const session = await getSession();

  if (!session || session.userType !== 'admin') {
    redirect('/dashboard');
  }

  const orders = [
    { id: 'ORD-001', document: 'Birth Certificate - Garcia', account: 'Legal Translations Inc', pages: 2, status: 'completed', date: '2024-01-15', credits: 4 },
    { id: 'ORD-002', document: 'Diploma - Universidad Central', account: 'Immigration Services LLC', pages: 4, status: 'translation', date: '2024-01-15', credits: 8 },
    { id: 'ORD-003', document: 'Marriage License - Smith', account: 'Global Docs Pro', pages: 1, status: 'completed', date: '2024-01-14', credits: 2 },
    { id: 'ORD-004', document: 'Passport - Martinez', account: 'Quick Translate Co', pages: 2, status: 'ocr_review', date: '2024-01-14', credits: 4 },
    { id: 'ORD-005', document: 'Tax Document - Lopez', account: 'Legal Translations Inc', pages: 6, status: 'uploaded', date: '2024-01-14', credits: 12 },
    { id: 'ORD-006', document: 'Medical Record - Johnson', account: 'Certified Translators', pages: 3, status: 'translation', date: '2024-01-13', credits: 6 },
    { id: 'ORD-007', document: 'Contract - Smith & Co', account: 'Premier Translation', pages: 8, status: 'completed', date: '2024-01-13', credits: 16 },
    { id: 'ORD-008', document: 'Immigration Form I-130', account: 'Immigration Services LLC', pages: 4, status: 'ocr_review', date: '2024-01-13', credits: 8 },
  ];

  const statusConfig: Record<string, { color: string; bg: string; label: string }> = {
    uploaded: { color: 'text-gray-600', bg: 'bg-gray-100', label: 'Uploaded' },
    ocr_review: { color: 'text-amber-600', bg: 'bg-amber-50', label: 'OCR Review' },
    translation: { color: 'text-blue-600', bg: 'bg-blue-50', label: 'Translating' },
    completed: { color: 'text-green-600', bg: 'bg-green-50', label: 'Completed' },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">All Orders</h1>
          <p className="text-gray-500 mt-1">View and manage all orders across accounts</p>
        </div>
        <Button variant="outline" className="rounded-lg">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search orders by ID or document name..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          />
        </div>
        <select className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-900">
          <option>All Status</option>
          <option>Uploaded</option>
          <option>OCR Review</option>
          <option>Translating</option>
          <option>Completed</option>
        </select>
        <select className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-900">
          <option>All Accounts</option>
          <option>Legal Translations Inc</option>
          <option>Immigration Services LLC</option>
          <option>Global Docs Pro</option>
        </select>
        <Button variant="outline" size="sm" className="rounded-lg">
          <Filter className="h-4 w-4 mr-2" />
          More Filters
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Total Orders</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">523</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Completed</p>
          <p className="text-2xl font-semibold text-green-600 mt-1">423</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-500">In Progress</p>
          <p className="text-2xl font-semibold text-blue-600 mt-1">77</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Credits Used</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">12,450</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Document</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Account</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Pages</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Credits</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order) => {
              const status = statusConfig[order.status];
              return (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <span className="text-sm font-mono text-gray-900">{order.id}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                        <FileText className="h-4 w-4 text-gray-500" />
                      </div>
                      <span className="text-sm text-gray-900">{order.document}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{order.account}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-gray-600">{order.pages}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-gray-600">{order.credits}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${status.bg} ${status.color}`}>
                      {status.label}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-gray-500">{order.date}</span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-500">Showing 1-8 of 523 orders</p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" className="h-8 w-8 bg-purple-600 text-white border-purple-600">1</Button>
            <Button variant="outline" size="sm" className="h-8 w-8">2</Button>
            <Button variant="outline" size="sm" className="h-8 w-8">3</Button>
            <span className="text-gray-400">...</span>
            <Button variant="outline" size="sm" className="h-8 w-8">66</Button>
            <Button variant="outline" size="sm" className="h-8">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
