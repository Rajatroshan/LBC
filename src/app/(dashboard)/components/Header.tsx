'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Menu, PanelLeftClose, PanelLeftOpen, LogOut } from 'lucide-react';
import { APP_ROUTES } from '@/core/routes';
import { useToast } from '@/contexts/ToastContext';

interface HeaderProps {
  onToggleMobileMenu: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleMobileMenu,
  isCollapsed,
  onToggleCollapse,
}) => {
  const { user, firebaseUser, isAdmin, logout } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully. Namaste!', 'See you soon');
      router.push(APP_ROUTES.LOGIN);
    } catch (err) {
      console.error('Logout error:', err);
      toast.error('Failed to log out. Please try again.', 'Error');
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .filter(Boolean)
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const photoURL = user?.photoURL || firebaseUser?.photoURL;
  const displayName = user?.name || firebaseUser?.displayName || 'User';
  const displayEmail = user?.email || firebaseUser?.email;

  return (
    <header className="h-16 bg-[#FFFDF7] border-b border-amber-200/80 flex items-center justify-between px-4 sm:px-6 shrink-0 z-30 shadow-xs">
      {/* Left side: Sidebar Toggles & Title/Greeting */}
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={onToggleMobileMenu}
          className="p-2 rounded-2xl text-stone-700 hover:text-stone-950 hover:bg-amber-100 border border-amber-200 lg:hidden focus:outline-none"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Desktop Sidebar Toggle Button */}
        <button
          type="button"
          onClick={onToggleCollapse}
          className="hidden lg:flex p-2 rounded-2xl text-stone-600 hover:text-stone-900 hover:bg-amber-100 border border-amber-200 transition-colors focus:outline-none"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label="Toggle sidebar"
        >
          {isCollapsed ? (
            <PanelLeftOpen className="w-5 h-5" />
          ) : (
            <PanelLeftClose className="w-5 h-5" />
          )}
        </button>

        {/* User Greeting & Status with Profile Picture */}
        <div className="flex items-center gap-2.5 min-w-0">
          {photoURL ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photoURL}
              alt={displayName}
              className="w-10 h-10 rounded-2xl object-cover border-2 border-amber-300 shadow-sm shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-200 via-orange-200 to-amber-300 text-amber-900 font-black flex items-center justify-center text-sm border-2 border-amber-300 shadow-sm shrink-0">
              {getInitials(displayName)}
            </div>
          )}

          <div className="min-w-0 truncate">
            <h2 className="text-xs sm:text-sm font-black text-stone-900 truncate flex items-center gap-1.5">
              <span>Namaste, {displayName}</span>
              <span className="hidden sm:inline-block">🙏</span>
            </h2>
            <p className="text-[10px] sm:text-xs text-amber-800 font-bold truncate">
              {isAdmin || user?.role === 'ADMIN' ? '🛡️ Admin' : '👨🌾 Member'} • {displayEmail}
            </p>
          </div>
        </div>
      </div>

      {/* Right side: Daily Blessing & Logout */}
      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/90 border border-amber-300 text-xs font-black text-amber-900 shadow-xs">
          <span>🪔</span>
          <span>100% Khula Hisab</span>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border-2 border-amber-300 bg-white hover:bg-amber-50 text-stone-800 font-bold text-xs"
        >
          <LogOut className="w-4 h-4 text-orange-600" />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>
    </header>
  );
};
