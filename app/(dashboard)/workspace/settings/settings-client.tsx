'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  User,
  Building2,
  Bell,
  Shield,
  Save,
  Upload,
  Loader2,
  Eye,
  EyeOff,
  X,
  KeyRound,
  CheckCircle
} from 'lucide-react';
import { updateProfile, changePassword } from '../../dashboard/settings/actions';

interface SettingsClientProps {
  session: {
    user: {
      id: string;
      firstName: string | null;
      lastName: string | null;
      email: string;
    };
    userType: string;
    accounts: Array<{
      id: string;
      name: string;
    }>;
  };
}

export function WorkspaceSettingsClient({ session }: SettingsClientProps) {
  const [firstName, setFirstName] = useState(session.user.firstName || '');
  const [lastName, setLastName] = useState(session.user.lastName || '');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');

  // Change Password Modal State
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordPending, setPasswordPending] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const handleSaveChanges = async () => {
    setSaving(true);
    setSaveError('');
    setSaveSuccess(false);

    try {
      const result = await updateProfile(firstName, lastName);

      if (result.status === 200) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
        window.location.reload();
      } else {
        setSaveError(result.message || 'Failed to save changes');
      }
    } catch (err) {
      console.error('Save error:', err);
      setSaveError('Connection error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPasswordError('');

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return;
    }

    setPasswordPending(true);

    try {
      const result = await changePassword(currentPassword, newPassword);

      if (result.status === 200) {
        setPasswordSuccess(true);
      } else {
        setPasswordError(result.message || 'Failed to change password');
      }
    } catch (err) {
      console.error('Change password error:', err);
      setPasswordError('Connection error. Please try again.');
    } finally {
      setPasswordPending(false);
    }
  };

  const resetPasswordModal = () => {
    setShowPasswordModal(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError('');
    setPasswordSuccess(false);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Settings</h1>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">Manage your account preferences</p>
        </div>
        <Button
          className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg w-full sm:w-auto"
          onClick={handleSaveChanges}
          disabled={saving}
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : saveSuccess ? (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Saved!
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      {saveError && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-sm">
          {saveError}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Profile */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-gray-100 flex items-center gap-2 sm:gap-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-600" />
              </div>
              <h2 className="font-semibold text-gray-900 text-sm sm:text-base">Profile</h2>
            </div>
            <div className="p-4 sm:p-5 space-y-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center text-white text-base sm:text-xl font-semibold flex-shrink-0">
                  {firstName?.[0]}{lastName?.[0]}
                </div>
                <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                  <Upload className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                  Upload Photo
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="text-xs sm:text-sm text-gray-700">First Name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="mt-1.5 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="text-xs sm:text-sm text-gray-700">Last Name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="mt-1.5 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs sm:text-sm text-gray-700">Email</label>
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
            <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-gray-100 flex items-center gap-2 sm:gap-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <Bell className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-600" />
              </div>
              <h2 className="font-semibold text-gray-900 text-sm sm:text-base">Notifications</h2>
            </div>
            <div className="p-4 sm:p-5 space-y-3 sm:space-y-4">
              {[
                { label: 'New task assignments', description: 'Get notified when a new task is assigned to you', enabled: true },
                { label: 'Task deadlines', description: 'Reminders for upcoming deadlines', enabled: true },
                { label: 'Comments and feedback', description: 'Notifications when someone comments on your work', enabled: true },
                { label: 'Daily summary', description: 'Receive a daily summary of your tasks', enabled: false },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-900">{item.label}</p>
                    <p className="text-[10px] sm:text-xs text-gray-500">{item.description}</p>
                  </div>
                  <button
                    className={`relative inline-flex h-5 w-9 sm:h-6 sm:w-11 items-center rounded-full transition-colors flex-shrink-0 ${
                      item.enabled ? 'bg-purple-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-3.5 w-3.5 sm:h-4 sm:w-4 transform rounded-full bg-white transition-transform shadow-sm ${
                        item.enabled ? 'translate-x-4 sm:translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Side Panel */}
        <div className="space-y-4 sm:space-y-6">
          {/* Account Info */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-gray-100 flex items-center gap-2 sm:gap-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <Building2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-600" />
              </div>
              <h2 className="font-semibold text-gray-900 text-sm sm:text-base">Account</h2>
            </div>
            <div className="p-4 sm:p-5 space-y-2.5 sm:space-y-3">
              {session.accounts[0]?.name && (
                <div>
                  <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider">Organization</p>
                  <p className="text-xs sm:text-sm font-medium text-gray-900 mt-1">{session.accounts[0].name}</p>
                </div>
              )}
              <div>
                <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider">Role</p>
                <p className="text-xs sm:text-sm font-medium text-gray-900 mt-1 capitalize">{session.userType}</p>
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-gray-100 flex items-center gap-2 sm:gap-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <Shield className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-600" />
              </div>
              <h2 className="font-semibold text-gray-900 text-sm sm:text-base">Security</h2>
            </div>
            <div className="p-4 sm:p-5 space-y-3 sm:space-y-4">
              <Button
                variant="outline"
                className="w-full justify-start text-sm"
                onClick={() => setShowPasswordModal(true)}
              >
                Change Password
              </Button>
              <div className="pt-3 sm:pt-4 border-t border-gray-100">
                <p className="text-[10px] sm:text-xs text-gray-500 mb-1.5 sm:mb-2">Active Sessions</p>
                <p className="text-xs sm:text-sm text-gray-700">1 active session</p>
                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50 mt-2 -ml-2 text-xs sm:text-sm">
                  Sign out all devices
                </Button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-4 sm:p-5 text-white">
            <h3 className="font-medium mb-3 sm:mb-4 text-sm sm:text-base">Your Stats</h3>
            <div className="space-y-2.5 sm:space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-xs sm:text-sm">Tasks Completed</span>
                <span className="font-semibold text-sm sm:text-base">--</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-xs sm:text-sm">Pages Translated</span>
                <span className="font-semibold text-sm sm:text-base">--</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-xs sm:text-sm">Avg. Quality Score</span>
                <span className="font-semibold text-sm sm:text-base">--</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={resetPasswordModal}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-8">
            {/* Close button */}
            <button
              type="button"
              onClick={resetPasswordModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            {!passwordSuccess ? (
              <>
                <div className="text-center mb-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <KeyRound className="w-6 h-6 text-purple-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Change Password
                  </h2>
                  <p className="text-gray-500 mt-2 text-sm">
                    Enter your current password and choose a new one.
                  </p>
                </div>

                <form onSubmit={handleChangePassword}>
                  <div className="mb-4">
                    <label className="text-sm font-medium text-gray-700">
                      Current Password
                    </label>
                    <div className="relative">
                      <Input
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                        className="mt-1.5 h-12 rounded-lg border-gray-200 focus:border-purple-500 focus:ring-purple-500 pr-12"
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 mt-0.5 text-gray-400 hover:text-gray-600"
                      >
                        {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="text-sm font-medium text-gray-700">
                      New Password
                    </label>
                    <div className="relative">
                      <Input
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        minLength={8}
                        className="mt-1.5 h-12 rounded-lg border-gray-200 focus:border-purple-500 focus:ring-purple-500 pr-12"
                        placeholder="Min. 8 characters"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 mt-0.5 text-gray-400 hover:text-gray-600"
                      >
                        {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="text-sm font-medium text-gray-700">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        minLength={8}
                        className="mt-1.5 h-12 rounded-lg border-gray-200 focus:border-purple-500 focus:ring-purple-500 pr-12"
                        placeholder="Confirm your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 mt-0.5 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {passwordError && (
                    <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                      {passwordError}
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium"
                    disabled={passwordPending}
                  >
                    {passwordPending ? (
                      <>
                        <Loader2 className="animate-spin mr-2 h-4 w-4" />
                        Changing password...
                      </>
                    ) : (
                      'Change Password'
                    )}
                  </Button>
                </form>
              </>
            ) : (
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Password Changed!
                </h2>
                <p className="text-gray-500 mb-6">
                  Your password has been changed successfully.
                </p>
                <Button
                  type="button"
                  onClick={resetPasswordModal}
                  className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium"
                >
                  Done
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
