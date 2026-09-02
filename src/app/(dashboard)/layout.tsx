'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Loader } from '@/components/ui/Loader';
import { APP_ROUTES } from '@/core/routes';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, firebaseUser, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Mobile slide-over drawer state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Desktop collapsible sidebar state
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Automatically close mobile menu when navigating to another page
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!loading) {
      if (!user && !firebaseUser) {
        router.replace(APP_ROUTES.LOGIN);
      } else if (user && user.role !== 'ADMIN' && user.approvalStatus === 'PENDING_APPROVAL') {
        router.replace(APP_ROUTES.LOGIN);
      }
    }
  }, [user, firebaseUser, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FFFDF7]">
        <Loader size="lg" />
      </div>
    );
  }

  if (!user && !firebaseUser) {
    return null;
  }

  if (user && user.role !== 'ADMIN' && user.approvalStatus === 'PENDING_APPROVAL') {
    return null;
  }

  return (
    <div className="flex h-screen bg-[#FFFDF7] overflow-hidden">
      {/* Responsive Sidebar for Mobile & Desktop */}
      <Sidebar
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(prev => !prev)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <Header
          onToggleMobileMenu={() => setMobileMenuOpen(prev => !prev)}
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(prev => !prev)}
        />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
