'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Settings,
  FileStack,
  BarChart3,
  LogOut,
  Building2,
  ClipboardList,
  ChevronRight,
  ScrollText,
  FileText,
  ToggleRight,
  Award,
  Menu,
  X,
} from 'lucide-react';

type UserType = 'admin' | 'team' | 'member' | 'user';

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
    { label: 'Logs', href: '/admin/logs', icon: ScrollText },
    { label: 'Templates', href: '/admin/templates', icon: FileText },
    { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { label: 'Features', href: '/admin/features', icon: ToggleRight },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
  ],
  team: [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Orders', href: '/dashboard/orders', icon: FileStack },
    { label: 'Team', href: '/dashboard/team', icon: Users },
    { label: 'Credits', href: '/dashboard/credits', icon: CreditCard },
    { label: 'Certificate', href: '/dashboard/certificate', icon: Award },
    { label: 'Settings', href: '/dashboard/settings', icon: Settings },
  ],
  member: [
    { label: 'My Tasks', href: '/workspace', icon: ClipboardList },
    { label: 'Orders', href: '/workspace/orders', icon: FileStack },
    { label: 'Settings', href: '/workspace/settings', icon: Settings },
  ],
  user: [
    { label: 'My Workspace', href: '/workspace', icon: LayoutDashboard },
    { label: 'Orders', href: '/workspace/orders', icon: FileStack },
    { label: 'Credits', href: '/workspace/credits', icon: CreditCard },
    { label: 'Settings', href: '/workspace/settings', icon: Settings },
  ],
};

interface SidebarProps {
  userType: UserType;
  userName?: string;
  accountName?: string;
  accountLogo?: string;
}

export function Sidebar({ userType, userName, accountName, accountLogo }: SidebarProps) {
  const pathname = usePathname();
  const navItems = navByRole[userType] || navByRole.team;
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Show company logo for team/member roles if available
  const showCompanyBranding = (userType === 'team' || userType === 'member') && accountLogo;

  const handleLogout = async () => {
    await fetch('/api/auth/session', { method: 'DELETE' });
    window.location.href = '/sign-in';
  };

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileOpen]);

  const SidebarContent = () => (
    <>
      {/* Logo - Show company logo for team/member, EZDocu logo for others */}
      <div className="h-16 px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          {showCompanyBranding ? (
            <>
              <img src={accountLogo} alt={accountName || ''} className="h-8 w-8 rounded-lg object-cover" />
              <span className="text-lg font-semibold text-gray-900 truncate max-w-[140px]">{accountName}</span>
            </>
          ) : (
            <>
              <Image src="/icon.svg" alt="" width={28} height={28} className="h-7 w-7" />
              <span className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">EZDocu</span>
            </>
          )}
        </Link>
        {/* Close button for mobile */}
        <button
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden p-2 -mr-2 text-gray-500 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Account info - Only show if NOT using company branding (for admin/user roles with an account) */}
      {accountName && !showCompanyBranding && (
        <div className="px-4 pb-4">
          <div className="px-3 py-2.5 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl border border-purple-100/50">
            <p className="text-[10px] font-semibold text-purple-600/70 uppercase tracking-wider">Account</p>
            <p className="text-sm font-medium text-gray-900 truncate mt-0.5">{accountName}</p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== '/admin' && item.href !== '/dashboard' && item.href !== '/workspace' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-md shadow-purple-500/20'
                  : 'text-gray-600 hover:bg-purple-50 hover:text-purple-700'
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className={cn("h-[18px] w-[18px]", isActive ? "text-white" : "text-gray-400")} />
                {item.label}
              </div>
              {isActive && <ChevronRight className="h-4 w-4 opacity-70" />}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-gray-100/80">
        <div className="flex items-center gap-3 mb-3 p-2 rounded-xl hover:bg-gray-100/50 transition-colors cursor-pointer">
          <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center text-white text-sm font-semibold shadow-sm">
            {userName?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{userName || 'User'}</p>
            <p className="text-xs text-gray-500 capitalize">{userType}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 w-full px-3 py-2.5 rounded-xl text-sm font-medium bg-purple-600 hover:bg-purple-700 text-white transition-colors shadow-sm"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-40">
        <Link href="/" className="flex items-center gap-2">
          {showCompanyBranding ? (
            <>
              <img src={accountLogo} alt={accountName || ''} className="h-8 w-8 rounded-lg object-cover" />
              <span className="text-lg font-semibold text-gray-900 truncate max-w-[140px]">{accountName}</span>
            </>
          ) : (
            <>
              <Image src="/icon.svg" alt="" width={28} height={28} className="h-7 w-7" />
              <span className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">EZDocu</span>
            </>
          )}
        </Link>
        <button
          onClick={() => setIsMobileOpen(true)}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
        >
          <Menu className="h-6 w-6" />
        </button>
      </header>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          'lg:hidden fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col z-50 transform transition-transform duration-300 ease-in-out',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <SidebarContent />
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-gradient-to-b from-white to-gray-50/50 border-r border-gray-200/80 flex-col h-screen fixed left-0 top-0">
        <SidebarContent />
      </aside>
    </>
  );
}
