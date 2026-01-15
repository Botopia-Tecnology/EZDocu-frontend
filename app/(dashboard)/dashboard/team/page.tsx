import { getSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Users,
  Plus,
  Mail,
  MoreHorizontal,
  Shield,
  Clock,
  FileStack,
  UserPlus
} from 'lucide-react';

export default async function TranslatorTeamPage() {
  const session = await getSession();

  if (!session) {
    redirect('/sign-in');
  }

  const teamMembers = [
    { id: 1, name: 'Maria Santos', email: 'maria@agency.com', role: 'Translator', orders: 45, status: 'active', joinedAt: '2023-06-15' },
    { id: 2, name: 'John Davis', email: 'john@agency.com', role: 'Translator', orders: 32, status: 'active', joinedAt: '2023-08-20' },
    { id: 3, name: 'Ana Rodriguez', email: 'ana@agency.com', role: 'Reviewer', orders: 28, status: 'active', joinedAt: '2023-10-05' },
  ];

  const pendingInvites = [
    { email: 'carlos@email.com', role: 'Translator', sentAt: '2024-01-10' },
  ];

  const roleConfig: Record<string, { color: string; bg: string }> = {
    Translator: { color: 'text-blue-700', bg: 'bg-blue-50' },
    Reviewer: { color: 'text-violet-700', bg: 'bg-violet-50' },
    Admin: { color: 'text-amber-700', bg: 'bg-amber-50' },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Team</h1>
          <p className="text-gray-500 mt-1">Manage your team members and invitations</p>
        </div>
        <Button className="bg-gray-900 hover:bg-gray-800 text-white rounded-lg">
          <UserPlus className="h-4 w-4 mr-2" />
          Invite Member
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">{teamMembers.length}</p>
              <p className="text-sm text-gray-500">Team Members</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
              <Mail className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">{pendingInvites.length}</p>
              <p className="text-sm text-gray-500">Pending Invites</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <FileStack className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">{teamMembers.reduce((sum, m) => sum + m.orders, 0)}</p>
              <p className="text-sm text-gray-500">Total Orders</p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Members */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Team Members</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {teamMembers.map((member) => {
            const role = roleConfig[member.role];
            return (
              <div key={member.id} className="px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center text-white font-medium">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{member.name}</p>
                    <p className="text-xs text-gray-500">{member.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${role.bg} ${role.color}`}>
                    {member.role}
                  </span>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{member.orders}</p>
                    <p className="text-xs text-gray-500">orders</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Joined</p>
                    <p className="text-xs text-gray-500">{member.joinedAt}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pending Invites */}
      {pendingInvites.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Pending Invitations</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {pendingInvites.map((invite, i) => (
              <div key={i} className="px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{invite.email}</p>
                    <p className="text-xs text-gray-500">Invited as {invite.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Clock className="h-3.5 w-3.5" />
                    Sent {invite.sentAt}
                  </div>
                  <Button variant="outline" size="sm">Resend</Button>
                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                    Cancel
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info Card */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-5">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Shield className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Team Roles</h3>
            <p className="text-sm text-gray-600 mt-1">
              <strong>Translators</strong> can work on assigned orders. <strong>Reviewers</strong> can approve translations before completion.
              Only account owners can invite new members and manage billing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
