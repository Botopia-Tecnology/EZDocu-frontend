'use client';

import { useState } from 'react';
import { Search, Download, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { mockLogs, actionLabels, accountOptions, type ConsumptionLog } from '@/lib/data/logs';

const formatTimestamp = (timestamp: string) => {
  return new Date(timestamp).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};

export default function LogsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [accountFilter, setAccountFilter] = useState('all');

  const filteredLogs = mockLogs.filter(log => {
    const matchesSearch = log.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.accountName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.userName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAction = actionFilter === 'all' || log.action === actionFilter;
    const matchesAccount = accountFilter === 'all' || log.accountId === accountFilter;
    return matchesSearch && matchesAction && matchesAccount;
  });

  const totalCredits = filteredLogs.reduce((sum, log) => sum + log.creditsConsumed, 0);

  const handleExportCSV = () => {
    const headers = ['Timestamp', 'Account', 'User', 'Order ID', 'Action', 'Document Type', 'Pages', 'Credits', 'Details'];
    const rows = filteredLogs.map(log => [
      new Date(log.timestamp).toLocaleString(), log.accountName, log.userName, log.orderId,
      actionLabels[log.action].label, log.documentType, log.pageCount, log.creditsConsumed, log.details
    ]);
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = window.URL.createObjectURL(blob);
    a.download = `consumption-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Consumption Logs</h1>
          <p className="text-gray-500 mt-1">Detailed logs of all credit consumption activities</p>
        </div>
        <button onClick={handleExportCSV} className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors">
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Logs" value={filteredLogs.length} />
        <StatCard label="Credits Consumed" value={totalCredits} color="text-purple-600" />
        <StatCard label="OCR Operations" value={filteredLogs.filter(l => l.action.includes('ocr')).length} color="text-blue-600" />
        <StatCard label="Translations" value={filteredLogs.filter(l => l.action.includes('translation')).length} color="text-violet-600" />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input type="text" placeholder="Search by order, account, or user..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500" />
          </div>
          <Filter className="h-4 w-4 text-gray-400" />
          <select value={actionFilter} onChange={(e) => setActionFilter(e.target.value)} className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm">
            <option value="all">All Actions</option>
            <option value="ocr_generated">OCR Generated</option>
            <option value="ocr_edited">OCR Edited</option>
            <option value="translation_generated">Translation Generated</option>
            <option value="translation_edited">Translation Edited</option>
            <option value="download">Download</option>
          </select>
          <select value={accountFilter} onChange={(e) => setAccountFilter(e.target.value)} className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm">
            <option value="all">All Accounts</option>
            {accountOptions.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {['Timestamp', 'Account / User', 'Order', 'Action', 'Document', 'Pages', 'Credits', 'Details'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredLogs.map((log) => <LogRow key={log.id} log={log} />)}
          </tbody>
        </table>
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-500">Showing <span className="font-medium">{filteredLogs.length}</span> logs</p>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-50" disabled><ChevronLeft className="h-4 w-4" /></button>
            <span className="px-3 py-1 text-sm font-medium text-purple-600 bg-purple-50 rounded-lg">1</span>
            <button className="p-2 rounded-lg border border-gray-200 hover:bg-gray-100"><ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color = 'text-gray-900' }: { label: string; value: number; color?: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
    </div>
  );
}

function LogRow({ log }: { log: ConsumptionLog }) {
  const actionInfo = actionLabels[log.action];
  const ActionIcon = actionInfo.icon;
  return (
    <tr className="hover:bg-gray-50/50">
      <td className="px-4 py-3 text-sm text-gray-600">{formatTimestamp(log.timestamp)}</td>
      <td className="px-4 py-3">
        <p className="text-sm font-medium text-gray-900">{log.accountName}</p>
        <p className="text-xs text-gray-500">{log.userName}</p>
      </td>
      <td className="px-4 py-3 text-sm font-mono text-purple-600">{log.orderId}</td>
      <td className="px-4 py-3">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${actionInfo.color}`}>
          <ActionIcon className="h-3.5 w-3.5" />{actionInfo.label}
        </span>
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">{log.documentType}</td>
      <td className="px-4 py-3 text-center text-sm font-medium text-gray-900">{log.pageCount}</td>
      <td className="px-4 py-3 text-center">
        <span className={`text-sm font-bold ${log.creditsConsumed > 0 ? 'text-purple-600' : 'text-gray-400'}`}>
          {log.creditsConsumed > 0 ? `-${log.creditsConsumed}` : '0'}
        </span>
      </td>
      <td className="px-4 py-3 text-sm text-gray-500">{log.details}</td>
    </tr>
  );
}
