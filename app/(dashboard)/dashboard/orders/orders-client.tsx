'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
    FileText,
    Search,
    Plus,
    Filter,
    Eye,
    Download,
    ChevronLeft,
    ChevronRight,
    CreditCard,
    UserPlus,
    Check,
    Loader2,
} from 'lucide-react';
import { Order, TeamMemberBasic, assignOrder } from './actions';

interface OrdersClientProps {
    orders: Order[];
    stats: {
        total: number;
        inProgress: number;
        completed: number;
        thisMonth: number;
    };
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
    teamMembers: TeamMemberBasic[];
    isOwner: boolean;
}

const calcCredits = (pages: number, type: 'image' | 'text') =>
    type === 'image' ? pages : pages * 2;

const statusConfig: Record<string, { color: string; bg: string; label: string }> = {
    uploaded: { color: 'text-gray-600', bg: 'bg-gray-100', label: 'Uploaded' },
    ocr_in_progress: { color: 'text-orange-600', bg: 'bg-orange-50', label: 'OCR Processing' },
    ocr_review: { color: 'text-amber-600', bg: 'bg-amber-50', label: 'OCR Review' },
    translation_in_progress: { color: 'text-indigo-600', bg: 'bg-indigo-50', label: 'Translating' },
    translation: { color: 'text-blue-600', bg: 'bg-blue-50', label: 'Translation Review' },
    completed: { color: 'text-green-600', bg: 'bg-green-50', label: 'Completed' },
};

const docTypeConfig: Record<'image' | 'text', { label: string; color: string }> = {
    image: { label: 'Image', color: 'text-blue-600 bg-blue-50' },
    text: { label: 'Text', color: 'text-purple-600 bg-purple-50' },
};

export function OrdersClient({
    orders,
    stats,
    pagination,
    teamMembers,
    isOwner,
}: OrdersClientProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [assigningOrderId, setAssigningOrderId] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const handleAssign = async (orderId: string, memberId: string) => {
        setAssigningOrderId(orderId);
        startTransition(async () => {
            const result = await assignOrder(orderId, memberId);
            if (!result.success) {
                alert(result.message);
            }
            setAssigningOrderId(null);
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>
                    <p className="text-gray-500 mt-1">Manage your translation orders</p>
                </div>
                <Link href="/dashboard/orders/new">
                    <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg">
                        <Plus className="h-4 w-4 mr-2" />
                        New Order
                    </Button>
                </Link>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search orders..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600"
                >
                    <option value="all">All Status</option>
                    <option value="uploaded">Uploaded</option>
                    <option value="ocr_review">OCR Review</option>
                    <option value="translation">Translating</option>
                    <option value="completed">Completed</option>
                </select>
                <Button variant="outline" size="sm" className="rounded-lg">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                </Button>
            </div>

            <div className="grid grid-cols-4 gap-4">
                <StatCard label="Total Orders" value={String(stats.total)} />
                <StatCard label="In Progress" value={String(stats.inProgress)} color="text-blue-600" />
                <StatCard label="Completed" value={String(stats.completed)} color="text-green-600" />
                <StatCard label="This Month" value={String(stats.thisMonth)} />
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-100 bg-gray-50">
                            <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">
                                Order
                            </th>
                            <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">
                                Document
                            </th>
                            <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">
                                Type
                            </th>
                            <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">
                                Pages
                            </th>
                            <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">
                                Credits
                            </th>
                            <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">
                                Status
                            </th>
                            <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">
                                Assigned To
                            </th>
                            <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">
                                Date
                            </th>
                            <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {orders.map((order) => {
                            const status = statusConfig[order.status] || statusConfig.uploaded;
                            const docType = docTypeConfig[order.documentType];
                            const credits = calcCredits(order.totalPages, order.documentType);
                            const isAssigning = assigningOrderId === order.id;

                            return (
                                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-5 py-4">
                                        <span className="text-sm font-mono text-gray-900">
                                            {order.orderNumber}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                                                <FileText className="h-4 w-4 text-gray-500" />
                                            </div>
                                            <span className="text-sm text-gray-900">{order.documentName}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className={`text-xs font-medium px-2 py-1 rounded ${docType.color}`}>
                                            {docType.label}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className="text-sm text-gray-600">{order.totalPages}</span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-1">
                                            <CreditCard className="h-3.5 w-3.5 text-purple-500" />
                                            <span className="text-sm font-semibold text-purple-600">{credits}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span
                                            className={`text-xs font-medium px-2.5 py-1 rounded-full ${status.bg} ${status.color}`}
                                        >
                                            {status.label}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4">
                                        {isOwner ? (
                                            <div className="relative">
                                                {isAssigning ? (
                                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                        Assigning...
                                                    </div>
                                                ) : (
                                                    <select
                                                        value={order.assignedTo?.id || ''}
                                                        onChange={(e) => {
                                                            if (e.target.value) {
                                                                handleAssign(order.id, e.target.value);
                                                            }
                                                        }}
                                                        className="text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-purple-500 min-w-[140px]"
                                                    >
                                                        <option value="">Unassigned</option>
                                                        {teamMembers.map((member) => (
                                                            <option key={member.id} value={member.id}>
                                                                {member.firstName} {member.lastName}
                                                            </option>
                                                        ))}
                                                    </select>
                                                )}
                                            </div>
                                        ) : (
                                            <span className="text-sm text-gray-600">
                                                {order.assignedTo
                                                    ? `${order.assignedTo.firstName} ${order.assignedTo.lastName}`
                                                    : '-'}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className="text-sm text-gray-500">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link href={`/dashboard/orders/${order.id}`}>
                                                <Button variant="ghost" size="sm">
                                                    <Eye className="h-4 w-4 mr-1" />
                                                    View
                                                </Button>
                                            </Link>
                                            {order.status === 'completed' && (
                                                <Button variant="ghost" size="sm">
                                                    <Download className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        {orders.length === 0 && (
                            <tr>
                                <td colSpan={9} className="px-5 py-12 text-center text-gray-500">
                                    No orders found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                {pagination.totalPages > 1 && (
                    <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between">
                        <p className="text-sm text-gray-500">
                            Showing {(pagination.page - 1) * pagination.limit + 1}-
                            {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                            {pagination.total} orders
                        </p>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-8"
                                disabled={pagination.page === 1}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => i + 1).map(
                                (pageNum) => (
                                    <Button
                                        key={pageNum}
                                        variant="outline"
                                        size="sm"
                                        className={`h-8 w-8 ${
                                            pageNum === pagination.page
                                                ? 'bg-purple-600 text-white border-purple-600'
                                                : ''
                                        }`}
                                    >
                                        {pageNum}
                                    </Button>
                                )
                            )}
                            {pagination.totalPages > 5 && (
                                <>
                                    <span className="text-gray-400">...</span>
                                    <Button variant="outline" size="sm" className="h-8 w-8">
                                        {pagination.totalPages}
                                    </Button>
                                </>
                            )}
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-8"
                                disabled={pagination.page === pagination.totalPages}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function StatCard({
    label,
    value,
    color = 'text-gray-900',
}: {
    label: string;
    value: string;
    color?: string;
}) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-sm text-gray-500">{label}</p>
            <p className={`text-2xl font-semibold mt-1 ${color}`}>{value}</p>
        </div>
    );
}
