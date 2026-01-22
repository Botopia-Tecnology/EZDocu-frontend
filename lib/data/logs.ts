import { Eye, Edit3, Languages, ArrowDownToLine } from 'lucide-react';

export type LogType = 'ocr_generated' | 'ocr_edited' | 'translation_generated' | 'translation_edited' | 'download';

export interface ConsumptionLog {
  id: string;
  timestamp: string;
  accountId: string;
  accountName: string;
  userId: string;
  userName: string;
  orderId: string;
  action: LogType;
  documentType: string;
  pageCount: number;
  creditsConsumed: number;
  details: string;
}

export const actionLabels: Record<LogType, { label: string; icon: React.ComponentType<{ className?: string }>; color: string }> = {
  ocr_generated: { label: 'OCR Generated', icon: Eye, color: 'bg-blue-100 text-blue-700' },
  ocr_edited: { label: 'OCR Edited', icon: Edit3, color: 'bg-cyan-100 text-cyan-700' },
  translation_generated: { label: 'Translation Generated', icon: Languages, color: 'bg-purple-100 text-purple-700' },
  translation_edited: { label: 'Translation Edited', icon: Edit3, color: 'bg-violet-100 text-violet-700' },
  download: { label: 'Download', icon: ArrowDownToLine, color: 'bg-green-100 text-green-700' },
};

export const mockLogs: ConsumptionLog[] = [
  { id: 'LOG-001', timestamp: '2025-01-22T14:32:00Z', accountId: 'ACC-001', accountName: 'Legal Translations Inc', userId: 'USR-001', userName: 'John Smith', orderId: 'ORD-1234', action: 'ocr_generated', documentType: 'Legal', pageCount: 5, creditsConsumed: 5, details: 'Birth Certificate - Spanish' },
  { id: 'LOG-002', timestamp: '2025-01-22T14:28:00Z', accountId: 'ACC-001', accountName: 'Legal Translations Inc', userId: 'USR-001', userName: 'John Smith', orderId: 'ORD-1234', action: 'ocr_edited', documentType: 'Legal', pageCount: 5, creditsConsumed: 0, details: 'Manual corrections applied' },
  { id: 'LOG-003', timestamp: '2025-01-22T14:15:00Z', accountId: 'ACC-002', accountName: 'Global Docs Co', userId: 'USR-003', userName: 'Maria Garcia', orderId: 'ORD-1230', action: 'translation_generated', documentType: 'Immigration', pageCount: 3, creditsConsumed: 6, details: 'Passport - Portuguese to English' },
  { id: 'LOG-004', timestamp: '2025-01-22T13:45:00Z', accountId: 'ACC-002', accountName: 'Global Docs Co', userId: 'USR-003', userName: 'Maria Garcia', orderId: 'ORD-1230', action: 'translation_edited', documentType: 'Immigration', pageCount: 3, creditsConsumed: 0, details: 'Terminology adjustments' },
  { id: 'LOG-005', timestamp: '2025-01-22T13:30:00Z', accountId: 'ACC-003', accountName: 'Academic Services', userId: 'USR-005', userName: 'David Lee', orderId: 'ORD-1225', action: 'download', documentType: 'Academic', pageCount: 12, creditsConsumed: 0, details: 'Final PDF downloaded' },
  { id: 'LOG-006', timestamp: '2025-01-22T12:00:00Z', accountId: 'ACC-001', accountName: 'Legal Translations Inc', userId: 'USR-002', userName: 'Sarah Johnson', orderId: 'ORD-1220', action: 'ocr_generated', documentType: 'Legal', pageCount: 8, creditsConsumed: 8, details: 'Contract - German' },
  { id: 'LOG-007', timestamp: '2025-01-22T11:30:00Z', accountId: 'ACC-004', accountName: 'Quick Translate LLC', userId: 'USR-007', userName: 'Anna Brown', orderId: 'ORD-1218', action: 'translation_generated', documentType: 'General', pageCount: 2, creditsConsumed: 4, details: 'Letter - French to English' },
  { id: 'LOG-008', timestamp: '2025-01-22T10:45:00Z', accountId: 'ACC-003', accountName: 'Academic Services', userId: 'USR-005', userName: 'David Lee', orderId: 'ORD-1215', action: 'download', documentType: 'Academic', pageCount: 6, creditsConsumed: 0, details: 'Transcript downloaded' },
];

export const accountOptions = [
  { id: 'ACC-001', name: 'Legal Translations Inc' },
  { id: 'ACC-002', name: 'Global Docs Co' },
  { id: 'ACC-003', name: 'Academic Services' },
  { id: 'ACC-004', name: 'Quick Translate LLC' },
];
