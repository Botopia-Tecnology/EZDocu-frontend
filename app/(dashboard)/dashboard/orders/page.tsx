import { getSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FileText, Search, Plus, Filter, Eye, Download, ChevronLeft, ChevronRight, CreditCard } from 'lucide-react';

type DocType = 'image' | 'text';

interface Order {
  id: string;
  name: string;
  pages: number;
  docType: DocType;
  status: string;
  date: string;
  assignee?: string;
}

const calcCredits = (pages: number, type: DocType) => type === 'image' ? pages : pages * 2;

export default async function TranslatorOrdersPage() {
  const session = await getSession();
  if (!session) redirect('/sign-in');

  const orders: Order[] = [
    { id: 'ORD-001', name: 'Birth Certificate - Garcia', pages: 2, docType: 'image', status: 'completed', date: '2024-01-15' },
    { id: 'ORD-002', name: 'Diploma - Universidad Central', pages: 4, docType: 'text', status: 'translation', date: '2024-01-15', assignee: 'Maria S.' },
    { id: 'ORD-003', name: 'Marriage License - Smith', pages: 1, docType: 'image', status: 'completed', date: '2024-01-14' },
    { id: 'ORD-004', name: 'Passport - Martinez', pages: 2, docType: 'image', status: 'ocr_review', date: '2024-01-14', assignee: 'John D.' },
    { id: 'ORD-005', name: 'Tax Document - Lopez', pages: 6, docType: 'text', status: 'uploaded', date: '2024-01-14' },
    { id: 'ORD-006', name: 'Medical Record - Johnson', pages: 3, docType: 'text', status: 'translation', date: '2024-01-13', assignee: 'Maria S.' },
    { id: 'ORD-007', name: 'Contract - Smith & Co', pages: 8, docType: 'text', status: 'completed', date: '2024-01-13' },
    { id: 'ORD-008', name: 'Immigration Form I-130', pages: 4, docType: 'image', status: 'ocr_review', date: '2024-01-13' },
  ];

  const statusConfig: Record<string, { color: string; bg: string; label: string }> = {
    uploaded: { color: 'text-gray-600', bg: 'bg-gray-100', label: 'Uploaded' },
    ocr_review: { color: 'text-amber-600', bg: 'bg-amber-50', label: 'OCR Review' },
    translation: { color: 'text-blue-600', bg: 'bg-blue-50', label: 'Translating' },
    completed: { color: 'text-green-600', bg: 'bg-green-50', label: 'Completed' },
  };

  const docTypeConfig: Record<DocType, { label: string; color: string }> = {
    image: { label: 'Image', color: 'text-blue-600 bg-blue-50' },
    text: { label: 'Text', color: 'text-purple-600 bg-purple-50' },
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Orders</h1>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">Manage your translation orders</p>
        </div>
        <Link href="/dashboard/orders/new">
          <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg w-full sm:w-auto"><Plus className="h-4 w-4 mr-2" />New Order</Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input type="text" placeholder="Search orders..." className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <select className="flex-1 sm:flex-none px-3 sm:px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600">
            <option>All Status</option>
            <option>Uploaded</option>
            <option>OCR Review</option>
            <option>Translating</option>
            <option>Completed</option>
          </select>
          <Button variant="outline" size="sm" className="rounded-lg"><Filter className="h-4 w-4 sm:mr-2" /><span className="hidden sm:inline">Filters</span></Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard label="Total Orders" value="164" />
        <StatCard label="In Progress" value="8" color="text-blue-600" />
        <StatCard label="Completed" value="156" color="text-green-600" />
        <StatCard label="This Month" value="24" />
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Order</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Document</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Pages</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Credits</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order) => {
              const status = statusConfig[order.status];
              const docType = docTypeConfig[order.docType];
              const credits = calcCredits(order.pages, order.docType);
              return (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4"><span className="text-sm font-mono text-gray-900">{order.id}</span></td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center"><FileText className="h-4 w-4 text-gray-500" /></div>
                      <span className="text-sm text-gray-900">{order.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-medium px-2 py-1 rounded ${docType.color}`}>{docType.label}</span>
                  </td>
                  <td className="px-5 py-4"><span className="text-sm text-gray-600">{order.pages}</span></td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      <CreditCard className="h-3.5 w-3.5 text-purple-500" />
                      <span className="text-sm font-semibold text-purple-600">{credits}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${status.bg} ${status.color}`}>{status.label}</span>
                  </td>
                  <td className="px-5 py-4"><span className="text-sm text-gray-500">{order.date}</span></td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/dashboard/orders/${order.id}`}>
                        <Button variant="ghost" size="sm"><Eye className="h-4 w-4 mr-1" />View</Button>
                      </Link>
                      {order.status === 'completed' && <Button variant="ghost" size="sm"><Download className="h-4 w-4" /></Button>}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-500">Showing 1-8 of 164 orders</p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8"><ChevronLeft className="h-4 w-4" /></Button>
            <Button variant="outline" size="sm" className="h-8 w-8 bg-purple-600 text-white border-purple-600">1</Button>
            <Button variant="outline" size="sm" className="h-8 w-8">2</Button>
            <Button variant="outline" size="sm" className="h-8 w-8">3</Button>
            <span className="text-gray-400">...</span>
            <Button variant="outline" size="sm" className="h-8 w-8">21</Button>
            <Button variant="outline" size="sm" className="h-8"><ChevronRight className="h-4 w-4" /></Button>
          </div>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-3">
        {orders.map((order) => {
          const status = statusConfig[order.status];
          const docType = docTypeConfig[order.docType];
          const credits = calcCredits(order.pages, order.docType);
          return (
            <Link key={order.id} href={`/dashboard/orders/${order.id}`} className="block bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="h-4 w-4 text-gray-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{order.name}</p>
                    <p className="text-xs text-gray-500 font-mono">{order.id}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${status.bg} ${status.color}`}>
                  {status.label}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className={`font-medium px-1.5 py-0.5 rounded ${docType.color}`}>{docType.label}</span>
                  <span className="text-gray-500">{order.pages} pages</span>
                  <div className="flex items-center gap-1">
                    <CreditCard className="h-3 w-3 text-purple-500" />
                    <span className="font-semibold text-purple-600">{credits}</span>
                  </div>
                </div>
                <span className="text-gray-500">{order.date}</span>
              </div>
            </Link>
          );
        })}
        {/* Mobile Pagination */}
        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-gray-500">1-8 of 164</p>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" className="h-8 w-8 p-0"><ChevronLeft className="h-4 w-4" /></Button>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0 bg-purple-600 text-white border-purple-600">1</Button>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">2</Button>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0"><ChevronRight className="h-4 w-4" /></Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color = 'text-gray-900' }: { label: string; value: string; color?: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4">
      <p className="text-xs sm:text-sm text-gray-500">{label}</p>
      <p className={`text-xl sm:text-2xl font-semibold mt-1 ${color}`}>{value}</p>
    </div>
  );
}
