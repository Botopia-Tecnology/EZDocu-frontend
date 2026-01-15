import { getSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  FileStack,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  FileText,
  Lightbulb,
  Play
} from 'lucide-react';
import Link from 'next/link';

export default async function MemberWorkspace() {
  const session = await getSession();

  if (!session) {
    redirect('/sign-in');
  }

  const stats = {
    assignedTasks: 5,
    inProgress: 2,
    completedToday: 8,
    pendingReview: 1,
  };

  const assignedOrders = [
    { id: '1', name: 'Birth Certificate - Garcia', status: 'ocr_review', pages: 2, priority: 'high', assignedAt: '1 hour ago' },
    { id: '2', name: 'Diploma - Universidad Central', status: 'translation', pages: 4, priority: 'normal', assignedAt: '3 hours ago' },
    { id: '3', name: 'Tax Document - Lopez', status: 'uploaded', pages: 6, priority: 'normal', assignedAt: '5 hours ago' },
    { id: '4', name: 'Medical Record - Johnson', status: 'ocr_review', pages: 3, priority: 'low', assignedAt: 'Yesterday' },
    { id: '5', name: 'Contract - Smith & Co', status: 'translation', pages: 8, priority: 'high', assignedAt: 'Yesterday' },
  ];

  const statusConfig: Record<string, { color: string; bg: string; label: string; action: string }> = {
    uploaded: { color: 'text-gray-600', bg: 'bg-gray-100', label: 'Ready for OCR', action: 'Start OCR' },
    ocr_review: { color: 'text-amber-600', bg: 'bg-amber-50', label: 'OCR Review', action: 'Review' },
    translation: { color: 'text-blue-600', bg: 'bg-blue-50', label: 'Translation', action: 'Translate' },
  };

  const priorityConfig: Record<string, { color: string; bg: string; label: string }> = {
    high: { color: 'text-red-700', bg: 'bg-red-50 border-red-100', label: 'High' },
    normal: { color: 'text-gray-600', bg: 'bg-gray-50 border-gray-100', label: 'Normal' },
    low: { color: 'text-green-700', bg: 'bg-green-50 border-green-100', label: 'Low' },
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">My Workspace</h1>
        <p className="text-gray-500 mt-1">
          Welcome back, {session.user.firstName || 'Team Member'}. You have {stats.assignedTasks} tasks assigned.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 bg-violet-50 rounded-lg flex items-center justify-center">
              <FileStack className="h-5 w-5 text-violet-600" />
            </div>
            <span className="text-xs font-medium text-violet-600 bg-violet-50 px-2 py-1 rounded-full">Assigned</span>
          </div>
          <p className="mt-4 text-2xl font-semibold text-gray-900">{stats.assignedTasks}</p>
          <p className="text-sm text-gray-500 mt-1">Tasks to complete</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">Active</span>
          </div>
          <p className="mt-4 text-2xl font-semibold text-gray-900">{stats.inProgress}</p>
          <p className="text-sm text-gray-500 mt-1">In progress</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            </div>
          </div>
          <p className="mt-4 text-2xl font-semibold text-gray-900">{stats.completedToday}</p>
          <p className="text-sm text-gray-500 mt-1">Completed today</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-amber-600" />
            </div>
          </div>
          <p className="mt-4 text-2xl font-semibold text-gray-900">{stats.pendingReview}</p>
          <p className="text-sm text-gray-500 mt-1">Pending review</p>
        </div>
      </div>

      {/* Assigned Orders */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-gray-900">Assigned Orders</h2>
            <p className="text-sm text-gray-500">Orders assigned to you for processing</p>
          </div>
          <Link href="/workspace/orders" className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1 transition-colors">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="divide-y divide-gray-100">
          {assignedOrders.map((order) => {
            const status = statusConfig[order.status];
            const priority = priorityConfig[order.priority];
            return (
              <div key={order.id} className="px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${priority.bg}`}>
                    <FileText className={`h-5 w-5 ${priority.color}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-900">{order.name}</p>
                      {order.priority === 'high' && (
                        <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                          High priority
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {order.pages} pages · Assigned {order.assignedAt}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${status.bg} ${status.color}`}>
                    {status.label}
                  </span>
                  <Link href={`/workspace/orders/${order.id}`}>
                    <Button size="sm" variant="outline" className="rounded-lg">
                      <Play className="h-3.5 w-3.5 mr-1.5" />
                      {status.action}
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tip Card */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-5">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Lightbulb className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Workflow Tip</h3>
            <p className="text-sm text-gray-600 mt-1">
              Each order follows a workflow: <span className="font-medium">Upload → OCR Review → Translation → Complete</span>.
              You must verify and approve each step before proceeding to the next one.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
