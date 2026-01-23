'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  ArrowLeft,
  Building2,
  Users,
  Mail,
  Calendar,
  Loader2,
  Edit2,
  Check,
  X,
  Power,
  PowerOff,
  Crown,
  Clock
} from 'lucide-react';
import Link from 'next/link';

interface Member {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  isOwner: boolean;
  joinedAt: string;
}

interface PendingInvitation {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  expiresAt: string;
}

interface AccountDetail {
  id: string;
  name: string;
  status: string;
  createdAt: string;
  owner: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
  members: Member[];
  pendingInvitations: PendingInvitation[];
}

interface AccountDetailClientProps {
  accountId: string;
  accessToken: string;
}

export function AccountDetailClient({ accountId, accessToken }: AccountDetailClientProps) {
  const [account, setAccount] = useState<AccountDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Edit member state
  const [editingMember, setEditingMember] = useState<string | null>(null);
  const [editFirstName, setEditFirstName] = useState('');
  const [editLastName, setEditLastName] = useState('');
  const [savingMember, setSavingMember] = useState(false);

  // Status update state
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  const fetchAccount = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/admin/accounts/${accountId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      const data = await response.json();
      if (data.status === 200) {
        setAccount(data.account);
      } else {
        setError(data.message || 'Failed to load account');
      }
    } catch (err) {
      setError('Failed to load account details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccount();
  }, [accountId]);

  const handleEditMember = (member: Member) => {
    setEditingMember(member.id);
    setEditFirstName(member.firstName);
    setEditLastName(member.lastName);
  };

  const handleSaveMember = async (memberId: string) => {
    setSavingMember(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/admin/members/${memberId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          firstName: editFirstName,
          lastName: editLastName
        })
      });

      const data = await response.json();
      if (data.status === 200) {
        fetchAccount();
        setEditingMember(null);
      }
    } catch (err) {
      console.error('Error updating member:', err);
    } finally {
      setSavingMember(false);
    }
  };

  const handleToggleMemberStatus = async (memberId: string, currentStatus: boolean) => {
    setUpdatingStatus(memberId);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/admin/members/${memberId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          isActive: !currentStatus,
          accountId: accountId
        })
      });

      const data = await response.json();
      if (data.status === 200) {
        fetchAccount();
      }
    } catch (err) {
      console.error('Error updating member status:', err);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleUpdateAccountStatus = async (newStatus: string) => {
    setUpdatingStatus('account');
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/admin/accounts/${accountId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();
      if (data.status === 200) {
        fetchAccount();
      }
    } catch (err) {
      console.error('Error updating account status:', err);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const statusConfig: Record<string, { color: string; bg: string }> = {
    active: { color: 'text-green-700', bg: 'bg-green-50' },
    trial: { color: 'text-blue-700', bg: 'bg-blue-50' },
    suspended: { color: 'text-red-700', bg: 'bg-red-50' },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (error || !account) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500">{error || 'Account not found'}</p>
        <Link href="/admin/accounts">
          <Button variant="outline" className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Accounts
          </Button>
        </Link>
      </div>
    );
  }

  const status = statusConfig[account.status] || statusConfig.trial;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/accounts">
          <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-gray-900">{account.name}</h1>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${status.bg} ${status.color}`}>
              {account.status}
            </span>
          </div>
          <p className="text-gray-500 mt-1">Account Details</p>
        </div>
        <div className="flex gap-2">
          {account.status !== 'active' && (
            <Button
              variant="outline"
              className="text-green-600 border-green-200 hover:bg-green-50"
              onClick={() => handleUpdateAccountStatus('active')}
              disabled={updatingStatus === 'account'}
            >
              {updatingStatus === 'account' ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Power className="h-4 w-4 mr-2" />
              )}
              Activate
            </Button>
          )}
          {account.status !== 'suspended' && (
            <Button
              variant="outline"
              className="text-red-600 border-red-200 hover:bg-red-50"
              onClick={() => handleUpdateAccountStatus('suspended')}
              disabled={updatingStatus === 'account'}
            >
              {updatingStatus === 'account' ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <PowerOff className="h-4 w-4 mr-2" />
              )}
              Suspend
            </Button>
          )}
        </div>
      </div>

      {/* Account Info */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-start gap-6">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
            <Building2 className="h-8 w-8 text-purple-600" />
          </div>
          <div className="flex-1 grid grid-cols-3 gap-6">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Owner</p>
              <p className="text-sm font-medium text-gray-900">{account.owner.firstName} {account.owner.lastName}</p>
              <p className="text-xs text-gray-500">{account.owner.email}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Members</p>
              <div className="flex items-center gap-1.5">
                <Users className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-900">{account.members.length}</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Created</p>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-900">
                  {new Date(account.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Members */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Team Members</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {account.members.map((member) => (
            <div key={member.id} className="px-6 py-4 flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                {member.firstName[0]}{member.lastName[0]}
              </div>
              <div className="flex-1">
                {editingMember === member.id ? (
                  <div className="flex items-center gap-2">
                    <Input
                      value={editFirstName}
                      onChange={(e) => setEditFirstName(e.target.value)}
                      className="h-8 w-32"
                      placeholder="First Name"
                    />
                    <Input
                      value={editLastName}
                      onChange={(e) => setEditLastName(e.target.value)}
                      className="h-8 w-32"
                      placeholder="Last Name"
                    />
                    <Button
                      size="sm"
                      className="h-8 w-8 p-0 bg-green-600 hover:bg-green-700"
                      onClick={() => handleSaveMember(member.id)}
                      disabled={savingMember}
                    >
                      {savingMember ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Check className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      onClick={() => setEditingMember(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900">
                      {member.firstName} {member.lastName}
                    </p>
                    {member.isOwner && (
                      <Crown className="h-4 w-4 text-yellow-500" />
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                      onClick={() => handleEditMember(member)}
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>
                  </div>
                )}
                <div className="flex items-center gap-2 mt-0.5">
                  <Mail className="h-3 w-3 text-gray-400" />
                  <p className="text-xs text-gray-500">{member.email}</p>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-500 capitalize">{member.role}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {member.isActive ? (
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-50 text-green-700">
                    Active
                  </span>
                ) : (
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                    Inactive
                  </span>
                )}
                {!member.isOwner && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className={`h-8 ${member.isActive ? 'text-red-600 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'}`}
                    onClick={() => handleToggleMemberStatus(member.id, member.isActive)}
                    disabled={updatingStatus === member.id}
                  >
                    {updatingStatus === member.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : member.isActive ? (
                      <>
                        <PowerOff className="h-4 w-4 mr-1" />
                        Deactivate
                      </>
                    ) : (
                      <>
                        <Power className="h-4 w-4 mr-1" />
                        Activate
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pending Invitations */}
      {account.pendingInvitations.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Pending Invitations</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {account.pendingInvitations.map((invitation) => (
              <div key={invitation.id} className="px-6 py-4 flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full flex items-center justify-center">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {invitation.firstName} {invitation.lastName}
                  </p>
                  <p className="text-xs text-gray-500">{invitation.email}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-yellow-50 text-yellow-700">
                    Pending
                  </span>
                  <p className="text-xs text-gray-400 mt-1">
                    Expires {new Date(invitation.expiresAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
