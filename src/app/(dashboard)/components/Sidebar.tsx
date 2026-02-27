'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { APP_ROUTES } from '@/core/routes';
import { useAuth } from '@/contexts/AuthContext';
import { clsx } from 'clsx';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { isAdmin } = useAuth();

  const menuItems = [
    { label: 'Dashboard', href: APP_ROUTES.DASHBOARD, icon: '📊', adminOnly: false },
    { label: 'Families', href: APP_ROUTES.FAMILIES, icon: '👨‍👩‍👧‍👦', adminOnly: false },
    { label: 'Festivals', href: APP_ROUTES.FESTIVALS, icon: '🎉', adminOnly: false },
    { label: 'Payments', href: APP_ROUTES.PAYMENTS, icon: '💰', adminOnly: true },
    { label: 'Calendar', href: APP_ROUTES.CALENDAR, icon: '📅', adminOnly: false },
    { label: 'Reports', href: APP_ROUTES.REPORTS, icon: '📈', adminOnly: true },
    { label: 'Settings', href: APP_ROUTES.SETTINGS, icon: '⚙️', adminOnly: false },
  ];

  const filteredItems = menuItems.filter(item => !item.adminOnly || isAdmin);

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-primary-600">LBC</h1>
        <p className="text-sm text-gray-500">Chanda Management</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {filteredItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                isActive
                  ? 'bg-primary-50 text-primary-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              )}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          © 2026 LBC | v1.0.0
        </p>
      </div>
    </aside>
  );
};
