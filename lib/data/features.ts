export interface Feature {
  id: string;
  name: string;
  description: string;
  category: 'core' | 'translation' | 'billing' | 'notifications' | 'integrations';
  isEnabled: boolean;
  lastModified: string;
}

export const categoryLabels: Record<string, { label: string; color: string }> = {
  core: { label: 'Core', color: 'bg-purple-100 text-purple-700' },
  translation: { label: 'Translation', color: 'bg-blue-100 text-blue-700' },
  billing: { label: 'Billing', color: 'bg-green-100 text-green-700' },
  notifications: { label: 'Notifications', color: 'bg-orange-100 text-orange-700' },
  integrations: { label: 'Integrations', color: 'bg-pink-100 text-pink-700' },
};

export const mockFeatures: Feature[] = [
  { id: 'FT-001', name: 'OCR Processing', description: 'Enable OCR for scanned documents', category: 'core', isEnabled: true, lastModified: '2025-01-20' },
  { id: 'FT-002', name: 'AI Translation', description: 'Enable AI-powered translation engine', category: 'translation', isEnabled: true, lastModified: '2025-01-20' },
  { id: 'FT-003', name: 'Manual Translation Edit', description: 'Allow users to edit AI translations', category: 'translation', isEnabled: true, lastModified: '2025-01-18' },
  { id: 'FT-004', name: 'Certificate Generation', description: 'Auto-generate translation certificates', category: 'core', isEnabled: true, lastModified: '2025-01-15' },
  { id: 'FT-005', name: 'Credit System', description: 'Enable credit-based billing', category: 'billing', isEnabled: true, lastModified: '2025-01-15' },
  { id: 'FT-006', name: 'Auto-Recharge', description: 'Allow automatic credit recharge', category: 'billing', isEnabled: true, lastModified: '2025-01-10' },
  { id: 'FT-007', name: 'Email Notifications', description: 'Send email notifications for orders', category: 'notifications', isEnabled: true, lastModified: '2025-01-10' },
  { id: 'FT-008', name: 'Slack Integration', description: 'Enable Slack notifications', category: 'integrations', isEnabled: false, lastModified: '2025-01-05' },
  { id: 'FT-009', name: 'API Access', description: 'Allow API access for integrations', category: 'integrations', isEnabled: false, lastModified: '2025-01-05' },
  { id: 'FT-010', name: 'Team Management', description: 'Enable team features and roles', category: 'core', isEnabled: true, lastModified: '2025-01-01' },
];
