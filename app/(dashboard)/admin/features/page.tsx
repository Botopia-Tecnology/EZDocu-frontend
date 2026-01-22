'use client';

import { useState } from 'react';
import { Search, ToggleLeft, ToggleRight, Clock, AlertTriangle } from 'lucide-react';
import { mockFeatures, categoryLabels, type Feature } from '@/lib/data/features';

export default function FeaturesPage() {
  const [features, setFeatures] = useState<Feature[]>(mockFeatures);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredFeatures = features.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || f.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFeature = (id: string) => {
    setFeatures(features.map(f => f.id === id ? { ...f, isEnabled: !f.isEnabled } : f));
  };

  const enabledCount = features.filter(f => f.isEnabled).length;
  const disabledCount = features.filter(f => !f.isEnabled).length;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Feature Toggles</h1>
          <p className="text-gray-500 mt-1">Enable or disable platform features</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Features" value={features.length} />
        <StatCard label="Enabled" value={enabledCount} color="text-green-600" />
        <StatCard label="Disabled" value={disabledCount} color="text-gray-400" />
        <StatCard label="Categories" value={Object.keys(categoryLabels).length} color="text-purple-600" />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input type="text" placeholder="Search features..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500" />
          </div>
          <div className="flex items-center gap-2">
            {['all', 'core', 'translation', 'billing', 'notifications', 'integrations'].map(cat => (
              <button key={cat} onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${selectedCategory === cat ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {cat === 'all' ? 'All' : categoryLabels[cat].label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-center gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-600" />
        <p className="text-sm text-amber-800">Disabling core features may affect system functionality. Changes take effect immediately.</p>
      </div>

      <div className="space-y-3">
        {filteredFeatures.map(feature => (
          <FeatureRow key={feature.id} feature={feature} onToggle={toggleFeature} />
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

function FeatureRow({ feature, onToggle }: { feature: Feature; onToggle: (id: string) => void }) {
  const catInfo = categoryLabels[feature.category];
  return (
    <div className={`bg-white rounded-xl border ${feature.isEnabled ? 'border-gray-200' : 'border-gray-100'} p-4 flex items-center justify-between hover:shadow-sm transition-shadow`}>
      <div className="flex items-center gap-4">
        <div className={`p-2 rounded-lg ${feature.isEnabled ? 'bg-green-100' : 'bg-gray-100'}`}>
          {feature.isEnabled ? <ToggleRight className="h-5 w-5 text-green-600" /> : <ToggleLeft className="h-5 w-5 text-gray-400" />}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className={`font-semibold ${feature.isEnabled ? 'text-gray-900' : 'text-gray-400'}`}>{feature.name}</h3>
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${catInfo.color}`}>{catInfo.label}</span>
          </div>
          <p className={`text-sm mt-0.5 ${feature.isEnabled ? 'text-gray-500' : 'text-gray-400'}`}>{feature.description}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <Clock className="h-3.5 w-3.5" />{feature.lastModified}
        </div>
        <button onClick={() => onToggle(feature.id)} className={`relative w-14 h-7 rounded-full transition-colors ${feature.isEnabled ? 'bg-green-500' : 'bg-gray-300'}`}>
          <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${feature.isEnabled ? 'left-8' : 'left-1'}`} />
        </button>
      </div>
    </div>
  );
}
