import { getSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  FileText,
  Search,
  Filter,
  Play,
  ChevronLeft,
  ChevronRight,
  Clock
} from 'lucide-react';

export default async function MemberOrdersPage() {
  const session = await getSession();

  if (!session) {
    redirect('/sign-in');
  }

  const orders = [
    { id: 'ORD-001', name: 'Birth Certificate - Garcia', pages: 2, status: 'ocr_review', priority: 'high', assignedAt: '1 hour ago' },
    { id: 'ORD-002', name: 'Diploma - Universidad Central', pages: 4, status: 'translation', priority: 'normal', assignedAt: '3 hours ago' },
    { id: 'ORD-003', name: 'Tax Document - Lopez', pages: 6, status: 'uploaded', priority: 'normal', assignedAt: '5 hours ago' },
    { id: 'ORD-004', name: 'Medical Record - Johnson', pages: 3, status: 'ocr_review', priority: 'low', assignedAt: 'Yesterday' },
    { id: 'ORD-005', name: 'Contract - Smith & Co', pages: 8, status: 'translation', priority: 'high', assignedAt: 'Yesterday' },
    { id: 'ORD-006', name: 'Immigration Form I-485', pages: 4, status: 'completed', priority: 'normal', assignedAt: '2 days ago' },
    { id: 'ORD-007', name: 'Marriage License - Brown', pages: 1, status: 'completed', priority: 'normal', assignedAt: '3 days ago' },
    { id: 'ORD-008', name: 'Passport - Williams', pages: 2, status: 'completed', priority: 'low', assignedAt: '4 days ago' },
  ];

  const statusConfig: Record<string, { color: string; bg: string; label: string; action: string }> = {
    uploaded: { color: 'text-gray-600', bg: 'bg-gray-100', label: 'Ready for OCR', action: 'Start OCR' },
    ocr_review: { color: 'text-amber-600', bg: 'bg-amber-50', label: 'OCR Review', action: 'Review' },
    translation: { color: 'text-blue-600', bg: 'bg-blue-50', label: 'Translating', action: 'Translate' },
    completed: { color: 'text-green-600', bg: 'bg-green-50', label: 'Completed', action: 'View' },
  };

  const priorityConfig: Record<string, { color: string; bg: string }> = {
    high: { color: 'text-red-700', bg: 'bg-red-50' },
    normal: { color: 'text-gray-600', bg: 'bg-gray-100' },
    low: { color: 'text-green-700', bg: 'bg-green-50' },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">My Orders</h1>
        <p className="text-gray-500 mt-1">All orders assigned to you</p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search orders..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          />
        </div>
        <select className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-900">
          <option>All Status</option>
          <option>Ready for OCR</option>
          <option>OCR Review</option>
          <option>Translating</option>
          <option>Completed</option>
        </select>
        <select className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-900">
          <option>All Priority</option>
          <option>High</option>
          <option>Normal</option>
          <option>Low</option>
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Total Assigned</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">8</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-500">In Progress</p>
          <p className="text-2xl font-semibold text-blue-600 mt-1">5</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Completed</p>
          <p className="text-2xl font-semibold text-green-600 mt-1">3</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-500">High Priority</p>
          <p className="text-2xl font-semibold text-red-600 mt-1">2</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Document</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Pages</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned</th>
              <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order) => {
              const status = statusConfig[order.status];
              const priority = priorityConfig[order.priority];
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
                      <span className="text-sm text-gray-900">{order.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-gray-600">{order.pages}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${priority.bg} ${priority.color}`}>
                      {order.priority}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${status.bg} ${status.color}`}>
                      {status.label}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5 text-sm text-gray-500">
                      <Clock className="h-4 w-4" />
                      {order.assignedAt}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link href={`/workspace/orders/${order.id}`}>
                      <Button
                        size="sm"
                        className={order.status === 'completed'
                          ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          : 'bg-gray-900 hover:bg-gray-800 text-white'
                        }
                      >
                        <Play className="h-3.5 w-3.5 mr-1.5" />
                        {status.action}
                      </Button>
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-500">Showing 1-8 of 8 orders</p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8" disabled>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" className="h-8 w-8 bg-gray-900 text-white border-gray-900">1</Button>
            <Button variant="outline" size="sm" className="h-8" disabled>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
