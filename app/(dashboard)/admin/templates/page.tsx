'use client';

import { useState } from 'react';
import { Plus, FileText, Edit3, Eye, Trash2, Clock, ChevronDown, Copy } from 'lucide-react';
import { mockTemplates, documentTypeLabels, availableVariables, type Template, type DocumentType } from '@/lib/data/templates';

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>(mockTemplates);
  const [selectedType, setSelectedType] = useState('all');
  const [showPreview, setShowPreview] = useState<string | null>(null);
  const [showVariables, setShowVariables] = useState(false);

  const filteredTemplates = templates.filter(t => selectedType === 'all' || t.type === selectedType);
  const toggleStatus = (id: string) => setTemplates(templates.map(t => t.id === id ? { ...t, isActive: !t.isActive } : t));

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Global Templates</h1>
          <p className="text-gray-500 mt-1">Manage certificate and document templates</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowVariables(!showVariables)} className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50">
            <Copy className="h-4 w-4" />Variables
            <ChevronDown className={`h-4 w-4 transition-transform ${showVariables ? 'rotate-180' : ''}`} />
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700">
            <Plus className="h-4 w-4" />New Template
          </button>
        </div>
      </div>

      {showVariables && (
        <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl border border-purple-100 p-4 mb-6">
          <h3 className="text-sm font-semibold text-purple-900 mb-3">Available Variables</h3>
          <div className="grid grid-cols-4 gap-3">
            {availableVariables.map(v => (
              <div key={v.name} className="bg-white rounded-lg p-3 border border-purple-100">
                <code className="text-xs font-mono text-purple-600">{`{{${v.name}}}`}</code>
                <p className="text-xs text-gray-500 mt-1">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-5 gap-4 mb-6">
        <StatCard label="Total Templates" value={templates.length} />
        <StatCard label="Active" value={templates.filter(t => t.isActive).length} color="text-green-600" />
        <StatCard label="Certificate" value={templates.filter(t => t.type === 'certificate').length} color="text-purple-600" />
        <StatCard label="Document Types" value={templates.filter(t => t.type !== 'certificate').length} color="text-blue-600" />
        <StatCard label="Inactive" value={templates.filter(t => !t.isActive).length} color="text-gray-400" />
      </div>

      <div className="flex items-center gap-2 mb-6">
        {['all', 'certificate', 'legal', 'immigration', 'academic', 'general'].map(type => (
          <button key={type} onClick={() => setSelectedType(type)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${selectedType === type ? 'bg-purple-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            {type === 'all' ? 'All Templates' : documentTypeLabels[type as DocumentType].label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {filteredTemplates.map(template => (
          <TemplateCard key={template.id} template={template} showPreview={showPreview} setShowPreview={setShowPreview} toggleStatus={toggleStatus} />
        ))}
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

function TemplateCard({ template, showPreview, setShowPreview, toggleStatus }: {
  template: Template; showPreview: string | null; setShowPreview: (id: string | null) => void; toggleStatus: (id: string) => void
}) {
  const typeInfo = documentTypeLabels[template.type];
  return (
    <div className={`bg-white rounded-xl border ${template.isActive ? 'border-gray-200' : 'border-gray-100 opacity-60'} p-5 hover:shadow-md transition-shadow`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${template.isActive ? 'bg-purple-100' : 'bg-gray-100'}`}>
            <FileText className={`h-5 w-5 ${template.isActive ? 'text-purple-600' : 'text-gray-400'}`} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{template.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${typeInfo.color}`}>{typeInfo.label}</span>
              <span className="text-xs text-gray-400">v{template.version}</span>
            </div>
          </div>
        </div>
        <button onClick={() => toggleStatus(template.id)} className={`relative w-12 h-6 rounded-full transition-colors ${template.isActive ? 'bg-green-500' : 'bg-gray-300'}`}>
          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${template.isActive ? 'left-7' : 'left-1'}`} />
        </button>
      </div>
      <p className="text-sm text-gray-500 mb-4">{template.description}</p>
      <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
        <div className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />Modified {template.lastModified}</div>
        <span>by {template.createdBy}</span>
      </div>
      {showPreview === template.id && (
        <div className="bg-gray-50 rounded-lg p-3 mb-4 border border-gray-100">
          <p className="text-xs font-mono text-gray-600 whitespace-pre-wrap">{template.content}</p>
        </div>
      )}
      <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
        <button onClick={() => setShowPreview(showPreview === template.id ? null : template.id)} className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
          <Eye className="h-4 w-4" />{showPreview === template.id ? 'Hide' : 'Preview'}
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-purple-600 hover:bg-purple-50 rounded-lg">
          <Edit3 className="h-4 w-4" />Edit
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
          <Copy className="h-4 w-4" />Duplicate
        </button>
        {template.type !== 'certificate' && (
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg ml-auto">
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
