import { getSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Settings,
  Globe,
  Bell,
  Shield,
  CreditCard,
  Mail,
  Database,
  Key,
  Save
} from 'lucide-react';

export default async function AdminSettingsPage() {
  const session = await getSession();

  if (!session || session.userType !== 'admin') {
    redirect('/dashboard');
  }

  const settingsSections = [
    {
      title: 'General',
      icon: Settings,
      settings: [
        { label: 'Platform Name', value: 'EZDocu', type: 'text' },
        { label: 'Support Email', value: 'support@ezdocu.com', type: 'email' },
        { label: 'Default Language', value: 'English', type: 'select' },
      ]
    },
    {
      title: 'Pricing',
      icon: CreditCard,
      settings: [
        { label: 'Scanned Document Price', value: '$1.00', type: 'text' },
        { label: 'Digital Document Price', value: '$2.00', type: 'text' },
        { label: 'Rush Processing Fee', value: '$5.00', type: 'text' },
      ]
    },
    {
      title: 'Notifications',
      icon: Bell,
      settings: [
        { label: 'Email Notifications', value: true, type: 'toggle' },
        { label: 'Low Credit Alerts', value: true, type: 'toggle' },
        { label: 'New Account Alerts', value: true, type: 'toggle' },
      ]
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
          <p className="text-gray-500 mt-1">Manage platform configuration</p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg">
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          {settingsSections.map((section, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <section.icon className="h-4 w-4 text-gray-600" />
                </div>
                <h2 className="font-semibold text-gray-900">{section.title}</h2>
              </div>
              <div className="p-5 space-y-4">
                {section.settings.map((setting, j) => (
                  <div key={j} className="flex items-center justify-between">
                    <label className="text-sm text-gray-700">{setting.label}</label>
                    {setting.type === 'toggle' ? (
                      <button
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          setting.value ? 'bg-purple-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
                            setting.value ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    ) : setting.type === 'select' ? (
                      <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900">
                        <option>{setting.value}</option>
                        <option>Spanish</option>
                        <option>Portuguese</option>
                      </select>
                    ) : (
                      <input
                        type={setting.type}
                        defaultValue={setting.value as string}
                        className="px-3 py-2 border border-gray-200 rounded-lg text-sm w-48 focus:outline-none focus:ring-2 focus:ring-gray-900"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* API Keys */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <Key className="h-4 w-4 text-gray-600" />
              </div>
              <h2 className="font-semibold text-gray-900">API Keys</h2>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider">OpenAI API Key</label>
                <div className="mt-1 flex items-center gap-2">
                  <input
                    type="password"
                    value="sk-••••••••••••••••"
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50"
                  />
                  <Button variant="outline" size="sm">Edit</Button>
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider">Stripe API Key</label>
                <div className="mt-1 flex items-center gap-2">
                  <input
                    type="password"
                    value="sk_live_••••••••"
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50"
                  />
                  <Button variant="outline" size="sm">Edit</Button>
                </div>
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <Shield className="h-4 w-4 text-gray-600" />
              </div>
              <h2 className="font-semibold text-gray-900">Security</h2>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Two-Factor Auth</span>
                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">Enabled</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Session Timeout</span>
                <span className="text-sm text-gray-600">24 hours</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">IP Whitelist</span>
                <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-full">Disabled</span>
              </div>
            </div>
          </div>

          {/* Database */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <Database className="h-4 w-4 text-gray-600" />
              </div>
              <h2 className="font-semibold text-gray-900">Database</h2>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Status</span>
                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">Connected</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Size</span>
                <span className="text-sm text-gray-600">2.4 GB</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Last Backup</span>
                <span className="text-sm text-gray-600">2 hours ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
