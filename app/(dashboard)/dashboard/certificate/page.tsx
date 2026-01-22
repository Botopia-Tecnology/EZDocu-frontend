'use client';

import { useState } from 'react';
import { Award, Eye, Save, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const defaultTemplate = `I, {{translator_name}}, hereby certify that I am fluent in {{source_language}} and {{target_language}}, and that the attached document is a true and accurate translation of the original document.

Document Type: {{document_type}}
Number of Pages: {{page_count}}
Translation Date: {{translation_date}}
Order Reference: {{order_id}}

I certify that this translation was completed to the best of my knowledge and ability.

_______________________________
{{translator_name}}
{{certification_number}}
{{certification_body}}`;

const variables = [
  { key: 'translator_name', desc: 'Your full name' },
  { key: 'source_language', desc: 'Original language' },
  { key: 'target_language', desc: 'Target language' },
  { key: 'document_type', desc: 'Type of document' },
  { key: 'page_count', desc: 'Number of pages' },
  { key: 'translation_date', desc: 'Date of translation' },
  { key: 'order_id', desc: 'Order reference' },
  { key: 'certification_number', desc: 'Your cert number' },
  { key: 'certification_body', desc: 'Certifying organization' },
];

export default function CertificatePage() {
  const [template, setTemplate] = useState(defaultTemplate);
  const [showPreview, setShowPreview] = useState(false);

  const previewContent = template
    .replace('{{translator_name}}', 'John Smith')
    .replace('{{translator_name}}', 'John Smith')
    .replace('{{source_language}}', 'Spanish')
    .replace('{{target_language}}', 'English')
    .replace('{{document_type}}', 'Birth Certificate')
    .replace('{{page_count}}', '2')
    .replace('{{translation_date}}', new Date().toLocaleDateString())
    .replace('{{order_id}}', 'ORD-1234')
    .replace('{{certification_number}}', 'ATA-123456')
    .replace('{{certification_body}}', 'American Translators Association');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Certificate Template</h1>
          <p className="text-gray-500 mt-1">Customize your translation certificate</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setTemplate(defaultTemplate)}><RefreshCw className="h-4 w-4 mr-2" />Reset</Button>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white"><Save className="h-4 w-4 mr-2" />Save Template</Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center"><Award className="h-5 w-5 text-purple-600" /></div>
              <div>
                <h2 className="font-semibold text-gray-900">Template Editor</h2>
                <p className="text-xs text-gray-500">Use variables in double braces: {"{{variable}}"}</p>
              </div>
            </div>
            <textarea
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              className="w-full h-80 p-4 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
          </div>

          <button onClick={() => setShowPreview(!showPreview)} className="flex items-center gap-2 text-sm font-medium text-purple-600 hover:text-purple-700">
            <Eye className="h-4 w-4" />{showPreview ? 'Hide Preview' : 'Show Preview'}
          </button>

          {showPreview && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wider">Preview</h3>
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
                <pre className="whitespace-pre-wrap text-sm text-gray-800 font-serif">{previewContent}</pre>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Available Variables</h3>
            <div className="space-y-2">
              {variables.map((v) => (
                <div key={v.key} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <code className="text-xs font-mono text-purple-600">{`{{${v.key}}}`}</code>
                  <span className="text-xs text-gray-500">{v.desc}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl border border-purple-100 p-5">
            <h3 className="font-semibold text-purple-900 mb-2">How it works</h3>
            <ul className="text-sm text-purple-800 space-y-2">
              <li>• Certificate auto-generates with each order</li>
              <li>• Embedded in the final PDF document</li>
              <li>• No additional credits consumed</li>
              <li>• Variables replaced with order data</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
