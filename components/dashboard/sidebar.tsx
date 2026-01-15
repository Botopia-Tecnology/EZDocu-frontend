'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  FileText,
  LayoutDashboard,
  Users,
  CreditCard,
  Settings,
  FileStack,
  BarChart3,
  LogOut,
  Building2,
  ClipboardList,
  ChevronRight
} from 'lucide-react';

type UserType = 'admin' | 'translator' | 'member';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navByRole: Record<UserType, NavItem[]> = {
  admin: [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Accounts', href: '/admin/accounts', icon: Building2 },
    { label: 'Orders', href: '/admin/orders', icon: FileStack },
    { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
  ],
  translator: [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Orders', href: '/dashboard/orders', icon: FileStack },
    { label: 'Team', href: '/dashboard/team', icon: Users },
    { label: 'Credits', href: '/dashboard/credits', icon: CreditCard },
    { label: 'Settings', href: '/dashboard/settings', icon: Settings },
  ],
  member: [
    { label: 'My Tasks', href: '/workspace', icon: ClipboardList },
    { label: 'Orders', href: '/workspace/orders', icon: FileStack },
    { label: 'Settings', href: '/workspace/settings', icon: Settings },
  ],
};

interface SidebarProps {
  userType: UserType;
  userName?: string;
  accountName?: string;
}

export function Sidebar({ userType, userName, accountName }: SidebarProps) {
  const pathname = usePathname();
  const navItems = navByRole[userType] || navByRole.translator;

  const handleLogout = async () => {
    await fetch('/api/auth/session', { method: 'DELETE' });
    window.location.href = '/sign-in';
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen fixed left-0 top-0">
      {/* Logo */}
      <div className="h-16 px-6 flex items-center border-b border-gray-100">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-semibold text-gray-900">EZDocu</span>
        </Link>
      </div>

      {/* Account info */}
      {accountName && (
        <div className="px-4 py-3 border-b border-gray-100">
          <div className="px-2 py-2 bg-gray-50 rounded-lg">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Account</p>
            <p className="text-sm font-medium text-gray-900 truncate mt-0.5">{accountName}</p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== '/admin' && item.href !== '/dashboard' && item.href !== '/workspace' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                isActive
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className="h-5 w-5" />
                {item.label}
              </div>
              {isActive && <ChevronRight className="h-4 w-4 opacity-50" />}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center text-white text-sm font-medium">
            {userName?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{userName || 'User'}</p>
            <p className="text-xs text-gray-500 capitalize">{userType}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
