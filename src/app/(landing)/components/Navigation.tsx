'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { APP_ROUTES } from '@/core/routes';
import { Menu, X, Code2, ArrowRight } from 'lucide-react';

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = useCallback((id: string) => {
    setMobileMenuOpen(false);

    if (pathname !== '/') {
      router.push(`/#${id}`);
      return;
    }

    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  }, [pathname, router]);

  // Handle hash scroll on initial landing from external/other pages
  useEffect(() => {
    if (pathname === '/' && typeof window !== 'undefined' && window.location.hash) {
      const hashId = window.location.hash.replace('#', '');
      setTimeout(() => {
        const el = document.getElementById(hashId);
        if (el) {
          const headerOffset = 80;
          const elementPosition = el.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
      }, 200);
    }
  }, [pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#FFFDF7]/95 backdrop-blur-md shadow-md py-2.5 border-b-2 border-amber-300'
          : 'bg-gradient-to-b from-amber-100/95 via-amber-100/60 to-transparent py-3 sm:py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2 sm:gap-4 h-12">
          
          {/* 1. Left Group: Logo + Left-Aligned Menu Links */}
          <div className="flex items-center gap-3 xl:gap-6 min-w-0">
            {/* Logo & Village Badge */}
            <div 
              onClick={() => scrollToSection('home')} 
              className="flex items-center gap-2 cursor-pointer group shrink-0"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-500 via-amber-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-md border-2 border-amber-300 group-hover:scale-105 transition-transform">
                <span className="text-white font-black text-lg sm:text-xl leading-none">🪔</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg sm:text-xl font-black tracking-tight text-stone-900 leading-none">
                  LBC
                </span>
                <span className="hidden xl:inline-flex items-center text-[9px] font-black px-2 py-0.5 rounded-full bg-amber-100 border border-amber-300 text-amber-950">
                  🌾 Apna Gaon
                </span>
              </div>
            </div>

            {/* Desktop Menu Links (Shifted Left, Compact Spacing) */}
            <nav className="hidden lg:flex items-center gap-2.5 xl:gap-4 text-xs xl:text-sm font-bold text-stone-700 whitespace-nowrap">
              <button
                type="button"
                onClick={() => scrollToSection('home')}
                className="hover:text-orange-600 transition-colors px-1 cursor-pointer"
              >
                Home
              </button>
              
              <button
                type="button"
                onClick={() => scrollToSection('khula-hisab')}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-950 font-black border border-amber-300 hover:bg-amber-200 transition-colors text-xs cursor-pointer"
              >
                <span>📜 Khula Hisab</span>
              </button>

              <button
                type="button"
                onClick={() => router.push('/samachar')}
                className="hover:text-orange-600 transition-colors px-1 cursor-pointer"
              >
                📰 Samachar
              </button>

              <button
                type="button"
                onClick={() => scrollToSection('features')}
                className="hover:text-orange-600 transition-colors px-1 cursor-pointer"
              >
                Features
              </button>

              <button
                type="button"
                onClick={() => scrollToSection('glimpses')}
                className="hover:text-orange-600 transition-colors px-1 cursor-pointer"
              >
                Utsav Gallery
              </button>

              <button
                type="button"
                onClick={() => scrollToSection('about')}
                className="hover:text-orange-600 transition-colors px-1 cursor-pointer"
              >
                About Club
              </button>

              <button
                type="button"
                onClick={() => scrollToSection('developer')}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-100 text-orange-900 font-extrabold border border-orange-300 hover:bg-orange-200 transition-colors text-xs cursor-pointer"
              >
                <Code2 className="w-3 h-3 text-orange-700" />
                <span>Developer</span>
              </button>

              <button
                type="button"
                onClick={() => scrollToSection('contact')}
                className="hover:text-orange-600 transition-colors px-1 cursor-pointer"
              >
                Contact
              </button>
            </nav>
          </div>

          {/* 2. Right: Sign In & Village Portal CTAs (Firmly Anchored on Right Margin) */}
          <div className="flex items-center gap-2 shrink-0 ml-auto">
            {/* Desktop Sign In Button */}
            <button
              type="button"
              onClick={() => router.push(APP_ROUTES.LOGIN)}
              className="hidden sm:inline-flex items-center justify-center h-9 px-3.5 rounded-xl text-xs font-black text-stone-800 bg-white hover:bg-amber-50 border-2 border-amber-300 shadow-2xs transition-all active:scale-95 cursor-pointer"
            >
              Sign In
            </button>

            {/* Desktop Portal CTA Button */}
            <button
              type="button"
              onClick={() => router.push(APP_ROUTES.LOGIN)}
              className="hidden sm:inline-flex items-center justify-center h-9 px-4 rounded-xl text-xs font-black text-white bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-700 border border-amber-300 shadow-sm transition-all gap-1.5 hover:scale-102 active:scale-95 shrink-0 cursor-pointer"
            >
              <span>Village Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
              className="lg:hidden p-2 rounded-xl text-stone-700 hover:bg-amber-100 border border-amber-300 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-orange-700" /> : <Menu className="w-5 h-5 text-orange-700" />}
            </button>
          </div>

        </div>
      </div>

      {/* 3. Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FFFDF7]/98 border-b-2 border-amber-300 backdrop-blur-md px-4 py-4 space-y-2 animate-in slide-in-from-top-2 duration-200 shadow-lg">
          <div className="flex flex-col space-y-2 text-sm font-bold text-stone-700">
            <button
              type="button"
              onClick={() => scrollToSection('home')}
              className="p-3 text-left rounded-xl bg-amber-50 hover:bg-amber-100 font-black text-stone-800 border border-amber-200"
            >
              🏠 Gaon Home
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('khula-hisab')}
              className="p-3 text-left rounded-xl bg-amber-200 hover:bg-amber-300 font-black text-amber-950 border-2 border-amber-400 shadow-2xs"
            >
              📜 100% Khula Hisab
            </button>
            <button
              type="button"
              onClick={() => { setMobileMenuOpen(false); router.push('/samachar'); }}
              className="p-3 text-left rounded-xl bg-orange-100 hover:bg-orange-200 font-black text-orange-950 border border-orange-300 shadow-2xs"
            >
              📰 Gaon Samachar (Social Feed)
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('features')}
              className="p-3 text-left rounded-xl bg-amber-50 hover:bg-amber-100 font-black text-stone-800 border border-amber-200"
            >
              ⚡ Features
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('glimpses')}
              className="p-3 text-left rounded-xl bg-amber-50 hover:bg-amber-100 font-black text-stone-800 border border-amber-200"
            >
              🪔 Utsav Gallery
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('about')}
              className="p-3 text-left rounded-xl bg-amber-50 hover:bg-amber-100 font-black text-stone-800 border border-amber-200"
            >
              🌾 About Club
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('developer')}
              className="p-3 text-left rounded-xl bg-orange-100 hover:bg-orange-200 font-black text-orange-900 border border-orange-300 flex items-center gap-1.5"
            >
              <Code2 className="w-4 h-4 text-orange-700" />
              <span>Developer Details</span>
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('contact')}
              className="p-3 text-left rounded-xl bg-amber-50 hover:bg-amber-100 font-black text-stone-800 border border-amber-200"
            >
              📞 Contact
            </button>

            <div className="pt-2 border-t border-amber-200 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => router.push(APP_ROUTES.LOGIN)}
                className="w-full py-3 rounded-xl bg-white text-stone-900 font-black text-xs border-2 border-amber-300 text-center shadow-xs"
              >
                Sign In to Member Account
              </button>
              <button
                type="button"
                onClick={() => router.push(APP_ROUTES.LOGIN)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white font-black text-xs text-center shadow-md border border-amber-200"
              >
                Enter Village Portal →
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
