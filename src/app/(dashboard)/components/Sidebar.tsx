'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { APP_ROUTES } from '@/core/routes';
import { useAuth } from '@/contexts/AuthContext';
import { clsx } from 'clsx';
import { 
  LayoutDashboard, 
  Users, 
  Sparkles, 
  CreditCard, 
  CalendarDays, 
  BarChart3, 
  Settings, 
  Wallet,
  Receipt,
  X, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';

interface SidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  mobileOpen,
  onMobileClose,
  isCollapsed,
  onToggleCollapse,
}) => {
  const pathname = usePathname();
  const { isAdmin } = useAuth();

  const menuItems = [
    { label: 'Dashboard', href: APP_ROUTES.DASHBOARD, Icon: LayoutDashboard, adminOnly: false },
    { label: 'Families', href: APP_ROUTES.FAMILIES, Icon: Users, adminOnly: false },
    { label: 'Festivals', href: APP_ROUTES.FESTIVALS, Icon: Sparkles, adminOnly: false },
    { label: 'Record Payment', href: APP_ROUTES.PAYMENTS, Icon: CreditCard, adminOnly: false },
    { label: 'Record Expense', href: APP_ROUTES.EXPENSE_RECORD, Icon: Receipt, adminOnly: false },
    { label: 'Reimbursements', href: APP_ROUTES.REIMBURSEMENTS, Icon: Wallet, adminOnly: false },
    { label: 'Calendar', href: APP_ROUTES.CALENDAR, Icon: CalendarDays, adminOnly: false },
    { label: 'Reports', href: APP_ROUTES.REPORTS, Icon: BarChart3, adminOnly: true },
    { label: 'Settings', href: APP_ROUTES.SETTINGS, Icon: Settings, adminOnly: false },
  ];

  const filteredItems = menuItems.filter(item => !item.adminOnly || isAdmin);

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-50 bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out lg:static',
          // Mobile responsive slide-in
          mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0',
          // Desktop width handling
          isCollapsed ? 'lg:w-20' : 'w-64'
        )}
      >
        {/* Sidebar Header / Brand */}
        <div className={clsx(
          'h-16 flex items-center border-b border-gray-200 px-4',
          isCollapsed ? 'lg:justify-center justify-between' : 'justify-between'
        )}>
          <div className={clsx('flex items-center gap-3 overflow-hidden', isCollapsed && 'lg:hidden')}>
            <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
              L
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 leading-tight">LBC</h1>
              <p className="text-xs text-gray-500 font-medium leading-none">Chanda Management</p>
            </div>
          </div>

          {/* Icon only on desktop collapsed */}
          {isCollapsed && (
            <div className="hidden lg:flex w-9 h-9 rounded-xl bg-primary-600 items-center justify-center text-white font-bold text-lg shadow-sm">
              L
            </div>
          )}

          {/* Close button on mobile */}
          <button
            onClick={onMobileClose}
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 lg:hidden focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
          {filteredItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            const Icon = item.Icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => onMobileClose()}
                title={isCollapsed ? item.label : undefined}
                className={clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group font-medium text-sm',
                  isActive
                    ? 'bg-primary-50 text-primary-700 shadow-xs'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                  isCollapsed && 'lg:justify-center lg:px-2'
                )}
              >
                <Icon
                  className={clsx(
                    'w-5 h-5 shrink-0 transition-colors',
                    isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-600'
                  )}
                />
                <span className={clsx('truncate', isCollapsed && 'lg:hidden')}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Desktop Collapse Toggle & Version Footer */}
        <div className="p-3 border-t border-gray-100 space-y-2">
          {/* Desktop Toggle Button */}
          <button
            onClick={onToggleCollapse}
            className={clsx(
              'hidden lg:flex items-center gap-2 w-full px-3 py-2 text-xs font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors',
              isCollapsed && 'justify-center'
            )}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span>Collapse Sidebar</span>
              </>
            )}
          </button>

          <p className={clsx('text-[11px] text-gray-400 text-center tracking-tight', isCollapsed && 'lg:hidden')}>
            © 2026 LBC • v1.0.0
          </p>
        </div>
      </aside>
    </>
  );
};
