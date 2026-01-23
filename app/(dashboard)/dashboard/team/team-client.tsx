'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Users,
    Mail,
    MoreHorizontal,
    Shield,
    Clock,
    UserPlus,
    X,
    Loader2
} from 'lucide-react';
import {
    TeamMember,
    PendingInvite,
    inviteMember,
    cancelInvite,
    resendInvite,
    removeMember
} from './actions';

interface TeamClientProps {
    members: TeamMember[];
    pendingInvites: PendingInvite[];
    accountName: string;
    ownerId: string;
    currentUserId: string;
}

export function TeamClient({
    members,
    pendingInvites,
    accountName,
    ownerId,
    currentUserId
}: TeamClientProps) {
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

    const isOwner = currentUserId === ownerId;

    const roleConfig: Record<string, { color: string; bg: string }> = {
        team: { color: 'text-amber-700', bg: 'bg-amber-50' },
        member: { color: 'text-blue-700', bg: 'bg-blue-50' },
        admin: { color: 'text-violet-700', bg: 'bg-violet-50' },
    };

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        const result = await inviteMember(inviteEmail);

        if (result.success) {
            setInviteEmail('');
            setIsInviteModalOpen(false);
        } else {
            setError(result.message);
        }

        setIsSubmitting(false);
    };

    const handleCancelInvite = async (inviteId: string) => {
        setActionLoadingId(inviteId);
        await cancelInvite(inviteId);
        setActionLoadingId(null);
    };

    const handleResendInvite = async (inviteId: string) => {
        setActionLoadingId(inviteId);
        await resendInvite(inviteId);
        setActionLoadingId(null);
    };

    const handleRemoveMember = async (memberId: string) => {
        if (!confirm('Are you sure you want to remove this member?')) return;
        setActionLoadingId(memberId);
        await removeMember(memberId);
        setActionLoadingId(null);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Team</h1>
                    <p className="text-gray-500 mt-1">Manage your team members and invitations</p>
                </div>
                {isOwner && (
                    <Button
                        onClick={() => setIsInviteModalOpen(true)}
                        className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
                    >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Invite Member
                    </Button>
                )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                            <Users className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-semibold text-gray-900">{members.length}</p>
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
            </div>

            {/* Team Members */}
            <div className="bg-white rounded-xl border border-gray-200">
                <div className="px-5 py-4 border-b border-gray-100">
                    <h2 className="font-semibold text-gray-900">Team Members</h2>
                </div>
                <div className="divide-y divide-gray-100">
                    {members.length === 0 ? (
                        <div className="px-5 py-8 text-center text-gray-500">
                            No team members yet. Invite someone to get started.
                        </div>
                    ) : (
                        members.map((member) => {
                            const role = roleConfig[member.role] || roleConfig.member;
                            return (
                                <div key={member.id} className="px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center text-white font-medium">
                                            {member.firstName?.[0]}{member.lastName?.[0]}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm font-medium text-gray-900">
                                                    {member.firstName} {member.lastName}
                                                </p>
                                                {member.isOwner && (
                                                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                                                        Owner
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-500">{member.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${role.bg} ${role.color}`}>
                                            {member.role}
                                        </span>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-600">Joined</p>
                                            <p className="text-xs text-gray-500">{formatDate(member.joinedAt)}</p>
                                        </div>
                                        {isOwner && !member.isOwner && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                onClick={() => handleRemoveMember(member.id)}
                                                disabled={actionLoadingId === member.id}
                                            >
                                                {actionLoadingId === member.id ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    <X className="h-4 w-4" />
                                                )}
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Pending Invites */}
            {pendingInvites.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200">
                    <div className="px-5 py-4 border-b border-gray-100">
                        <h2 className="font-semibold text-gray-900">Pending Invitations</h2>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {pendingInvites.map((invite) => (
                            <div key={invite.id} className="px-5 py-4 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{invite.email}</p>
                                        <p className="text-xs text-gray-500">Expires {formatDate(invite.expiresAt)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                        <Clock className="h-3.5 w-3.5" />
                                        Sent {formatDate(invite.sentAt)}
                                    </div>
                                    {isOwner && (
                                        <>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleResendInvite(invite.id)}
                                                disabled={actionLoadingId === invite.id}
                                            >
                                                {actionLoadingId === invite.id ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    'Resend'
                                                )}
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                onClick={() => handleCancelInvite(invite.id)}
                                                disabled={actionLoadingId === invite.id}
                                            >
                                                Cancel
                                            </Button>
                                        </>
                                    )}
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
                            <strong>Team</strong> members can create and manage orders. <strong>Members</strong> can work on assigned orders.
                            Only account owners can invite new members and manage billing.
                        </p>
                    </div>
                </div>
            </div>

            {/* Invite Modal */}
            {isInviteModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-900">Invite Team Member</h2>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => {
                                    setIsInviteModalOpen(false);
                                    setError('');
                                    setInviteEmail('');
                                }}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <form onSubmit={handleInvite}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={inviteEmail}
                                    onChange={(e) => setInviteEmail(e.target.value)}
                                    placeholder="colleague@company.com"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            {error && (
                                <p className="text-sm text-red-600 mb-4">{error}</p>
                            )}
                            <div className="flex justify-end gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setIsInviteModalOpen(false);
                                        setError('');
                                        setInviteEmail('');
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="bg-purple-600 hover:bg-purple-700 text-white"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        'Send Invitation'
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
