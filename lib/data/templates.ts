export type DocumentType = 'certificate' | 'legal' | 'immigration' | 'academic' | 'general';

export interface Template {
  id: string;
  name: string;
  type: DocumentType;
  version: string;
  isActive: boolean;
  lastModified: string;
  createdBy: string;
  description: string;
  content: string;
}

export const documentTypeLabels: Record<DocumentType, { label: string; color: string }> = {
  certificate: { label: 'Certificate', color: 'bg-purple-100 text-purple-700' },
  legal: { label: 'Legal', color: 'bg-blue-100 text-blue-700' },
  immigration: { label: 'Immigration', color: 'bg-green-100 text-green-700' },
  academic: { label: 'Academic', color: 'bg-orange-100 text-orange-700' },
  general: { label: 'General', color: 'bg-gray-100 text-gray-700' },
};

export const mockTemplates: Template[] = [
  { id: 'TPL-001', name: 'Standard Translation Certificate', type: 'certificate', version: '2.1', isActive: true, lastModified: '2025-01-20', createdBy: 'System', description: 'Default certificate template for all certified translations', content: 'I, {{translator_name}}, hereby certify that the attached translation from {{source_language}} to {{target_language}} is a true and accurate translation of the original document...' },
  { id: 'TPL-002', name: 'Legal Document Template', type: 'legal', version: '1.3', isActive: true, lastModified: '2025-01-18', createdBy: 'Admin', description: 'Template for legal documents including contracts, agreements, and court documents', content: 'CERTIFIED TRANSLATION\n\nDocument Type: {{document_type}}\nOriginal Language: {{source_language}}\n...' },
  { id: 'TPL-003', name: 'Immigration Document Template', type: 'immigration', version: '1.5', isActive: true, lastModified: '2025-01-15', createdBy: 'Admin', description: 'USCIS-compliant template for immigration documents', content: 'CERTIFICATION OF TRANSLATION\n\nI certify that I am fluent in {{source_language}} and English...' },
  { id: 'TPL-004', name: 'Academic Transcript Template', type: 'academic', version: '1.2', isActive: true, lastModified: '2025-01-10', createdBy: 'Admin', description: 'Template for academic transcripts, diplomas, and educational documents', content: 'CERTIFIED ACADEMIC DOCUMENT TRANSLATION\n\nInstitution: {{institution_name}}\n...' },
  { id: 'TPL-005', name: 'General Purpose Template', type: 'general', version: '1.0', isActive: false, lastModified: '2025-01-05', createdBy: 'Admin', description: 'Basic template for general document translations', content: 'TRANSLATION\n\nThis document has been translated from {{source_language}} to {{target_language}}...' },
];

export const availableVariables = [
  { name: 'translator_name', description: 'Full name of the translator' },
  { name: 'translator_certification', description: 'Certification number (e.g., ATA)' },
  { name: 'source_language', description: 'Original document language' },
  { name: 'target_language', description: 'Translation language' },
  { name: 'document_type', description: 'Type of document' },
  { name: 'translation_date', description: 'Date of translation' },
  { name: 'page_count', description: 'Number of pages' },
  { name: 'order_id', description: 'Order reference number' },
];
