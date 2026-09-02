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
      setIsScrolled(window.scrollY > 20);
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
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#FFFDF7]/95 backdrop-blur-md shadow-md py-2.5 border-b-2 border-amber-200'
          : 'bg-gradient-to-b from-amber-100/90 via-amber-50/50 to-transparent py-3 sm:py-4'
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo with Cute Traditional Village Diya */}
          <div 
            onClick={() => scrollToSection('home')} 
            className="flex items-center space-x-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 via-amber-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-md border-2 border-amber-200 group-hover:scale-105 transition-transform">
              <span className="text-white font-black text-xl">🪔</span>
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black tracking-tight text-stone-900">
                LBC
              </span>
              <span className="hidden sm:inline-block text-[10px] font-black ml-2 px-2 py-0.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900">
                🌾 Apna Gaon
              </span>
            </div>
          </div>

          {/* Menu Links - Desktop */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8 text-sm">
            <button
              onClick={() => scrollToSection('home')}
              className="font-bold transition-colors text-stone-800 hover:text-orange-600"
            >
              Gaon Home
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="font-bold transition-colors text-stone-800 hover:text-orange-600"
            >
              Village Features
            </button>
            <button
              onClick={() => scrollToSection('glimpses')}
              className="font-bold transition-colors text-stone-800 hover:text-orange-600"
            >
              Utsav Glimpses
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="font-bold transition-colors text-stone-800 hover:text-orange-600"
            >
              About Club
            </button>
            <button
              onClick={() => scrollToSection('developer')}
              className="font-black transition-colors text-orange-800 hover:text-orange-900 flex items-center gap-1 bg-amber-100/90 px-3 py-1 rounded-full border-2 border-amber-300 shadow-sm"
            >
              <Code2 className="w-3.5 h-3.5 text-orange-700" />
              <span>Developer</span>
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="font-bold transition-colors text-stone-800 hover:text-orange-600"
            >
              Contact
            </button>
          </div>

          {/* Auth & Mobile Toggle Buttons */}
          <div className="flex items-center space-x-2.5">
            {/* Desktop Auth Buttons */}
            <div className="hidden sm:flex items-center space-x-2.5">
              <button
                onClick={() => router.push(APP_ROUTES.LOGIN)}
                className="px-4 py-2 rounded-2xl text-xs font-bold transition-all text-stone-800 hover:bg-amber-100/80 border-2 border-amber-300 bg-white"
              >
                Sign In
              </button>
              <button
                onClick={() => router.push(APP_ROUTES.LOGIN)}
                className="px-4 py-2 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-white rounded-2xl text-xs font-black transition-all shadow-md hover:shadow-lg flex items-center gap-1.5 border-2 border-amber-200"
              >
                <span>Village Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
              className="md:hidden p-2 rounded-2xl border-2 border-amber-300 bg-white text-stone-900 shadow-sm transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FFFDF7] text-stone-900 border-b-2 border-amber-300 px-5 pt-4 pb-6 mt-2 space-y-4 shadow-2xl animate-fade-in">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <button
              onClick={() => scrollToSection('home')}
              className="p-3 text-left rounded-2xl bg-amber-50 hover:bg-amber-100 font-black text-stone-800 border border-amber-200"
            >
              🌾 Gaon Home
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="p-3 text-left rounded-2xl bg-amber-50 hover:bg-amber-100 font-black text-stone-800 border border-amber-200"
            >
              ✨ Features
            </button>
            <button
              onClick={() => scrollToSection('glimpses')}
              className="p-3 text-left rounded-2xl bg-amber-50 hover:bg-amber-100 font-black text-stone-800 border border-amber-200"
            >
              🪔 Utsav Gallery
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="p-3 text-left rounded-2xl bg-amber-50 hover:bg-amber-100 font-black text-stone-800 border border-amber-200"
            >
              📖 About Club
            </button>
            <button
              onClick={() => scrollToSection('developer')}
              className="col-span-2 p-3 text-left rounded-2xl bg-gradient-to-r from-amber-100 to-orange-100 border-2 border-amber-300 font-black text-orange-950 flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-orange-700" />
                Meet Developer (Rajat Sahu)
              </span>
              <span className="text-[10px] bg-orange-600 text-white px-2 py-0.5 rounded-full font-extrabold">Tech Mahindra</span>
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="col-span-2 p-3 text-left rounded-2xl bg-amber-50 hover:bg-amber-100 font-bold text-stone-700 border border-amber-200"
            >
              📞 Village Contacts &amp; Committee Info
            </button>
          </div>

          <div className="pt-2 border-t-2 border-dashed border-amber-200 flex flex-col gap-2">
            <button
              onClick={() => { setMobileMenuOpen(false); router.push(APP_ROUTES.LOGIN); }}
              className="w-full py-3.5 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white font-black rounded-2xl text-sm shadow-md flex items-center justify-center gap-2 border-2 border-amber-200"
            >
              <span>Access Member / Admin Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
