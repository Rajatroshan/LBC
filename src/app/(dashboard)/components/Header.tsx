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
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully.', 'See you soon');
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

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 shrink-0 z-30">
      {/* Left side: Sidebar Toggles & Title/Greeting */}
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={onToggleMobileMenu}
          className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 lg:hidden focus:outline-none focus:ring-2 focus:ring-primary-500"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Desktop Sidebar Toggle Button */}
        <button
          type="button"
          onClick={onToggleCollapse}
          className="hidden lg:flex p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label="Toggle sidebar"
        >
          {isCollapsed ? (
            <PanelLeftOpen className="w-5 h-5" />
          ) : (
            <PanelLeftClose className="w-5 h-5" />
          )}
        </button>

        {/* User Greeting & Status */}
        <div className="flex items-center gap-2.5 min-w-0">
          {user?.photoURL ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.photoURL}
              alt={user.name || 'User'}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border border-gray-200 shrink-0"
            />
          ) : (
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary-100 text-primary-700 font-semibold flex items-center justify-center text-xs sm:text-sm border border-primary-200 shrink-0">
              {getInitials(user?.name)}
            </div>
          )}

          <div className="min-w-0 truncate">
            <h2 className="text-sm sm:text-base font-semibold text-gray-900 truncate">
              {user?.name || 'Welcome'}
            </h2>
            <p className="text-[11px] sm:text-xs text-gray-500 truncate hidden xs:block">
              {user?.role === 'ADMIN' ? 'Administrator' : 'Member'} • {user?.email}
            </p>
          </div>
        </div>
      </div>

      {/* Right side: Logout Action */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 text-xs sm:text-sm"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>
    </header>
  );
};
