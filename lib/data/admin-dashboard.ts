export const stats = {
  totalAccounts: 156,
  activeAccounts: 142,
  ordersToday: 89,
  ordersThisWeek: 523,
  creditsConsumed: 12450,
  creditsSold: 15000,
  revenue: 12450,
};

export type AlertType = 'error' | 'warning' | 'info';

export interface Alert {
  id: number;
  type: AlertType;
  category: 'ocr' | 'translation' | 'orders' | 'credits' | 'system';
  message: string;
  details: string;
  time: string;
  count?: number;
}

export const operationalAlerts: Alert[] = [
  { id: 1, type: 'error', category: 'ocr', message: 'OCR Processing Failures', details: '2 documents failed OCR extraction', time: '5 min ago', count: 2 },
  { id: 2, type: 'error', category: 'translation', message: 'Translation Errors', details: '1 translation failed due to API timeout', time: '12 min ago', count: 1 },
  { id: 3, type: 'warning', category: 'orders', message: 'Stuck Orders', details: '4 orders in OCR Review for >24h', time: '1 hour ago', count: 4 },
  { id: 4, type: 'warning', category: 'credits', message: 'Low Credit Accounts', details: '3 accounts below minimum threshold', time: '2 hours ago', count: 3 },
];

export const topAccounts = [
  { name: 'Legal Translations Inc', orders: 145, credits: 2890 },
  { name: 'Immigration Services LLC', orders: 98, credits: 1960 },
  { name: 'Global Docs Pro', orders: 76, credits: 1520 },
  { name: 'Quick Translate Co', orders: 54, credits: 1080 },
];

export const ordersByStatus = [
  { status: 'Completed', count: 423, color: 'bg-green-500', width: '81%' },
  { status: 'In Translation', count: 45, color: 'bg-blue-500', width: '9%' },
  { status: 'OCR Review', count: 32, color: 'bg-amber-500', width: '6%' },
  { status: 'Uploaded', count: 23, color: 'bg-gray-400', width: '4%' },
];

export const alertStyles: Record<AlertType, { bg: string; border: string; icon: string; text: string }> = {
  error: { bg: 'bg-red-50', border: 'border-red-200', icon: 'text-red-600', text: 'text-red-800' },
  warning: { bg: 'bg-amber-50', border: 'border-amber-200', icon: 'text-amber-600', text: 'text-amber-800' },
  info: { bg: 'bg-blue-50', border: 'border-blue-200', icon: 'text-blue-600', text: 'text-blue-800' },
};
