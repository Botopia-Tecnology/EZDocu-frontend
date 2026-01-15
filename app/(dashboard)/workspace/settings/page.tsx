import { getSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  User,
  Bell,
  Shield,
  Save,
  Upload,
  Building2
} from 'lucide-react';

export default async function MemberSettingsPage() {
  const session = await getSession();

  if (!session) {
    redirect('/sign-in');
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
          <p className="text-gray-500 mt-1">Manage your account preferences</p>
        </div>
        <Button className="bg-gray-900 hover:bg-gray-800 text-white rounded-lg">
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <User className="h-4 w-4 text-gray-600" />
              </div>
              <h2 className="font-semibold text-gray-900">Profile</h2>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center text-white text-xl font-semibold">
                  {session.user.firstName?.[0]}{session.user.lastName?.[0]}
                </div>
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Photo
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-700">First Name</label>
                  <input
                    type="text"
                    defaultValue={session.user.firstName || ''}
                    className="mt-1.5 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-700">Last Name</label>
                  <input
                    type="text"
                    defaultValue={session.user.lastName || ''}
                    className="mt-1.5 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-700">Email</label>
                <input
                  type="email"
                  defaultValue={session.user.email}
                  className="mt-1.5 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50"
                  disabled
                />
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <Bell className="h-4 w-4 text-gray-600" />
              </div>
              <h2 className="font-semibold text-gray-900">Notifications</h2>
            </div>
            <div className="p-5 space-y-4">
              {[
                { label: 'New task assignments', description: 'Get notified when a new task is assigned to you', enabled: true },
                { label: 'Task deadlines', description: 'Reminders for upcoming deadlines', enabled: true },
                { label: 'Comments and feedback', description: 'Notifications when someone comments on your work', enabled: true },
                { label: 'Daily summary', description: 'Receive a daily summary of your tasks', enabled: false },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.label}</p>
                    <p className="text-xs text-gray-500">{item.description}</p>
                  </div>
                  <button
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      item.enabled ? 'bg-gray-900' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        item.enabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Account Info */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <Building2 className="h-4 w-4 text-gray-600" />
              </div>
              <h2 className="font-semibold text-gray-900">Account</h2>
            </div>
            <div className="p-5 space-y-3">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Organization</p>
                <p className="text-sm font-medium text-gray-900 mt-1">{session.accounts[0]?.name || 'My Team'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Role</p>
                <p className="text-sm font-medium text-gray-900 mt-1 capitalize">{session.userType}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Member Since</p>
                <p className="text-sm font-medium text-gray-900 mt-1">January 2024</p>
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
            <div className="p-5 space-y-4">
              <Button variant="outline" className="w-full justify-start">
                Change Password
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Enable Two-Factor Auth
              </Button>
              <div className="pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-2">Active Sessions</p>
                <p className="text-sm text-gray-700">1 active session</p>
                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50 mt-2 -ml-2">
                  Sign out all devices
                </Button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-5 text-white">
            <h3 className="font-medium mb-4">Your Stats</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Tasks Completed</span>
                <span className="font-semibold">24</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Pages Translated</span>
                <span className="font-semibold">156</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Avg. Quality Score</span>
                <span className="font-semibold">98%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
