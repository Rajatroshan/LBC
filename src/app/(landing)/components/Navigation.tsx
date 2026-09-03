'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { APP_ROUTES } from '@/core/routes';
import { Menu, X, Code2, ArrowRight } from 'lucide-react';

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
          <div className="flex items-center gap-4 xl:gap-6 min-w-0">
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
                onClick={() => scrollToSection('home')}
                className="hover:text-orange-600 transition-colors px-1"
              >
                Home
              </button>
              
              <button
                onClick={() => scrollToSection('khula-hisab')}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-950 font-black border border-amber-300 hover:bg-amber-200 transition-colors text-xs"
              >
                <span>📜 Khula Hisab</span>
              </button>

              <button
                onClick={() => scrollToSection('gaon-samachar')}
                className="hover:text-orange-600 transition-colors px-1"
              >
                📰 Samachar
              </button>

              <button
                onClick={() => scrollToSection('features')}
                className="hover:text-orange-600 transition-colors px-1"
              >
                Features
              </button>

              <button
                onClick={() => scrollToSection('glimpses')}
                className="hover:text-orange-600 transition-colors px-1"
              >
                Utsav Gallery
              </button>

              <button
                onClick={() => scrollToSection('about')}
                className="hover:text-orange-600 transition-colors px-1"
              >
                About Club
              </button>

              <button
                onClick={() => scrollToSection('developer')}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-100 text-orange-900 font-extrabold border border-orange-300 hover:bg-orange-200 transition-colors text-xs"
              >
                <Code2 className="w-3 h-3 text-orange-700" />
                <span>Developer</span>
              </button>

              <button
                onClick={() => scrollToSection('contact')}
                className="hover:text-orange-600 transition-colors px-1"
              >
                Contact
              </button>
            </nav>
          </div>

          {/* 2. Right: Sign In & Village Portal CTAs (Firmly Anchored on Right Margin) */}
          <div className="flex items-center gap-2 shrink-0 ml-auto">
            {/* Desktop Sign In Button */}
            <button
              onClick={() => router.push(APP_ROUTES.LOGIN)}
              className="hidden sm:inline-flex items-center justify-center h-9 px-3.5 rounded-xl text-xs font-black text-stone-800 bg-white hover:bg-amber-50 border-2 border-amber-300 shadow-2xs transition-all active:scale-95"
            >
              Sign In
            </button>

            {/* Desktop Portal CTA Button */}
            <button
              onClick={() => router.push(APP_ROUTES.LOGIN)}
              className="hidden sm:inline-flex items-center justify-center h-9 px-4 rounded-xl text-xs font-black text-white bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-700 border border-amber-300 shadow-sm transition-all gap-1.5 hover:scale-102 active:scale-95 shrink-0"
            >
              <span>Village Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
              className="lg:hidden p-2 rounded-xl border-2 border-amber-300 bg-white text-stone-900 shadow-2xs transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FFFDF7] text-stone-900 border-b-2 border-amber-300 px-4 pt-3 pb-5 mt-2 space-y-3 shadow-2xl animate-fade-in">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => scrollToSection('home')}
              className="p-3 text-left rounded-xl bg-amber-50 hover:bg-amber-100 font-black text-stone-800 border border-amber-200"
            >
              🌾 Gaon Home
            </button>
            <button
              onClick={() => scrollToSection('khula-hisab')}
              className="p-3 text-left rounded-xl bg-amber-200 hover:bg-amber-300 font-black text-amber-950 border-2 border-amber-400 shadow-2xs"
            >
              📜 100% Khula Hisab
            </button>
            <button
              onClick={() => scrollToSection('gaon-samachar')}
              className="p-3 text-left rounded-xl bg-orange-100 hover:bg-orange-200 font-black text-orange-950 border border-orange-300 shadow-2xs"
            >
              📰 Gaon Samachar
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="p-3 text-left rounded-xl bg-amber-50 hover:bg-amber-100 font-black text-stone-800 border border-amber-200"
            >
              ✨ Features
            </button>
            <button
              onClick={() => scrollToSection('glimpses')}
              className="p-3 text-left rounded-xl bg-amber-50 hover:bg-amber-100 font-black text-stone-800 border border-amber-200"
            >
              🪔 Utsav Gallery
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="p-3 text-left rounded-xl bg-amber-50 hover:bg-amber-100 font-black text-stone-800 border border-amber-200"
            >
              📖 About Club
            </button>
            <button
              onClick={() => scrollToSection('developer')}
              className="p-3 text-left rounded-xl bg-orange-100 border border-orange-300 font-black text-orange-950 flex items-center justify-between"
            >
              <span>👨💻 Developer</span>
              <span className="text-[9px] bg-orange-600 text-white px-1.5 py-0.5 rounded font-extrabold">Rajat Sahu</span>
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="col-span-2 p-3 text-left rounded-xl bg-amber-50 hover:bg-amber-100 font-bold text-stone-700 border border-amber-200"
            >
              📞 Village Contacts &amp; Committee Info
            </button>
          </div>

          <div className="pt-2 border-t-2 border-dashed border-amber-200 flex flex-col gap-2">
            <button
              onClick={() => { setMobileMenuOpen(false); router.push(APP_ROUTES.LOGIN); }}
              className="w-full py-3 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white font-black rounded-xl text-xs shadow-md flex items-center justify-center gap-2 border border-amber-200"
            >
              <span>🔑 Sign In to Village Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
