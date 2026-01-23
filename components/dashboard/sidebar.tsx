'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
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
  ChevronDown,
  Globe
} from 'lucide-react';

type Lang = 'en' | 'es' | 'pt';

const langNames: Record<Lang, string> = { en: 'EN', es: 'ES', pt: 'PT' };
const langFlags: Record<Lang, string> = { en: '🇺🇸', es: '🇪🇸', pt: '🇧🇷' };
const langLabels: Record<Lang, string> = { en: 'English', es: 'Español', pt: 'Português' };

type UserType = 'admin' | 'team' | 'member';

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
};

interface SidebarProps {
  userType: UserType;
  userName?: string;
  accountName?: string;
}

export function Sidebar({ userType, userName, accountName }: SidebarProps) {
  const pathname = usePathname();
  const navItems = navByRole[userType] || navByRole.team;
  const [lang, setLang] = useState<Lang>('en');
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('lang') as Lang;
    if (saved && ['en', 'es', 'pt'].includes(saved)) {
      setLang(saved);
    }
  }, []);

  const handleLangChange = (newLang: Lang) => {
    setLang(newLang);
    localStorage.setItem('lang', newLang);
    setLangMenuOpen(false);
  };

  const handleLogout = async () => {
    await fetch('/api/auth/session', { method: 'DELETE' });
    window.location.href = '/sign-in';
  };

  return (
    <aside className="w-64 bg-gradient-to-b from-white to-gray-50/50 border-r border-gray-200/80 flex flex-col h-screen fixed left-0 top-0">
      {/* Logo */}
      <div className="h-16 px-6 flex items-center">
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/icon.svg" alt="" width={28} height={28} className="h-7 w-7" />
          <span className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">EZDocu</span>
        </Link>
      </div>

      {/* Account info */}
      {accountName && (
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

      {/* Language Selector */}
      <div className="px-3 py-3 border-t border-gray-100/80">
        <div className="relative">
          <button
            onClick={() => setLangMenuOpen(!langMenuOpen)}
            className="flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-purple-50 hover:text-purple-700 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-gray-400" />
              <span>{langFlags[lang]}</span>
              <span>{langLabels[lang]}</span>
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${langMenuOpen ? 'rotate-180' : ''}`} />
          </button>
          {langMenuOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-50">
              {(['en', 'es', 'pt'] as Lang[]).map((l) => (
                <button
                  key={l}
                  onClick={() => handleLangChange(l)}
                  className={`w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-purple-50 transition-colors cursor-pointer ${lang === l ? 'bg-purple-50 text-purple-600' : 'text-gray-700'}`}
                >
                  <span>{langFlags[l]}</span>
                  <span>{langLabels[l]}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

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
    </aside>
  );
}
