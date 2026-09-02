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
  UserCheck,
  X
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
}) => {
  const pathname = usePathname();
  const { isAdmin } = useAuth();

  const menuItems = [
    { label: 'Mandap Dashboard', emoji: '🌾', href: APP_ROUTES.DASHBOARD, Icon: LayoutDashboard, adminOnly: false },
    { label: 'Gram Parivar', emoji: '🏡', href: APP_ROUTES.FAMILIES, Icon: Users, adminOnly: false },
    { label: 'Utsav & Pujas', emoji: '🪔', href: APP_ROUTES.FESTIVALS, Icon: Sparkles, adminOnly: false },
    { label: 'Record Chanda', emoji: '📜', href: APP_ROUTES.PAYMENTS, Icon: CreditCard, adminOnly: false },
    { label: 'Record Expense', emoji: '🏺', href: APP_ROUTES.EXPENSES, Icon: Receipt, adminOnly: false },
    { label: 'Reimbursements', emoji: '👛', href: APP_ROUTES.REIMBURSEMENTS, Icon: Wallet, adminOnly: false },
    { label: 'Utsav Calendar', emoji: '📅', href: APP_ROUTES.CALENDAR, Icon: CalendarDays, adminOnly: false },
    { label: 'Sabha Reports', emoji: '📊', href: APP_ROUTES.REPORTS, Icon: BarChart3, adminOnly: true },
    { label: 'Member Approvals', emoji: '👥', href: APP_ROUTES.MEMBERS, Icon: UserCheck, adminOnly: true },
    { label: 'Settings', emoji: '⚙️', href: APP_ROUTES.SETTINGS, Icon: Settings, adminOnly: false },
  ];

  const filteredItems = menuItems.filter(item => !item.adminOnly || isAdmin);

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container with Dashboard-matching Orange-to-Green Gradient & Hidden Scrollbar */}
      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-50 bg-gradient-to-b from-amber-100/95 via-orange-50/90 to-emerald-100/95 border-r border-amber-300/80 flex flex-col transition-all duration-300 ease-in-out lg:relative lg:translate-x-0 shadow-sm',
          // Mobile responsive slide-in
          mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full',
          // Desktop width handling
          isCollapsed ? 'lg:w-20' : 'w-64'
        )}
      >
        {/* Sidebar Header / Brand */}
        <div className={clsx(
          'h-16 flex items-center border-b border-amber-300/70 px-4 bg-amber-200/40 backdrop-blur-xs',
          isCollapsed ? 'lg:justify-center justify-between' : 'justify-between'
        )}>
          <div className={clsx('flex items-center gap-2.5 overflow-hidden', isCollapsed && 'lg:hidden')}>
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white font-black text-base shadow-sm border border-amber-200">
              🪔
            </div>
            <div>
              <h1 className="text-base font-black text-stone-900 leading-tight">LBC Mandap</h1>
              <p className="text-[10px] text-amber-900 font-bold leading-none">Village Chanda System</p>
            </div>
          </div>

          {/* Icon only on desktop collapsed */}
          {isCollapsed && (
            <div className="hidden lg:flex w-9 h-9 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 items-center justify-center text-white font-black text-base shadow-sm border border-amber-200">
              🪔
            </div>
          )}

          {/* Close button on mobile */}
          <button
            onClick={onMobileClose}
            className="p-1.5 rounded-xl text-stone-700 hover:bg-amber-200/60 lg:hidden focus:outline-none"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items (Scrollbar completely hidden while scrolling smoothly) */}
        <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {filteredItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => onMobileClose()}
                title={isCollapsed ? item.label : undefined}
                className={clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all duration-150 group font-bold text-xs sm:text-sm',
                  isActive
                    ? 'bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white shadow-md border-2 border-amber-200 font-black'
                    : 'text-stone-800 hover:bg-white/80 hover:text-stone-950 border border-transparent hover:border-amber-300/60 shadow-xs hover:shadow-xs',
                  isCollapsed && 'lg:justify-center lg:px-2'
                )}
              >
                <span className="text-base shrink-0 group-hover:scale-110 transition-transform">{item.emoji}</span>
                <span className={clsx('truncate', isCollapsed && 'lg:hidden')}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Daily Village Quote Card */}
        {!isCollapsed && (
          <div className="p-3 border-2 border-amber-300/80 bg-white/85 m-2.5 rounded-2xl text-center space-y-1 shadow-xs">
            <div className="flex items-center justify-center gap-1 text-[10px] font-black text-amber-900">
              <span>🌾 Gaon Ekta Sandesh</span>
            </div>
            <p className="text-[10px] text-stone-700 italic font-bold leading-snug">
              &ldquo;Mili-juli chanda se khilta gaon, 100% Khula Hisab.&rdquo;
            </p>
          </div>
        )}
      </aside>
    </>
  );
};

