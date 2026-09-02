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
          ? 'bg-white/95 backdrop-blur-md shadow-md py-3'
          : 'bg-gradient-to-b from-gray-950/80 via-gray-950/40 to-transparent py-4 sm:py-5'
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div 
            onClick={() => scrollToSection('home')} 
            className="flex items-center space-x-2.5 cursor-pointer"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 via-primary-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white font-black text-xl">L</span>
            </div>
            <div>
              <span className={`text-xl sm:text-2xl font-black tracking-tight transition-colors ${
                isScrolled ? 'text-gray-900' : 'text-white'
              }`}>
                LBC
              </span>
              <span className={`hidden sm:inline-block text-[10px] font-bold ml-2 px-1.5 py-0.5 rounded ${
                isScrolled ? 'bg-primary-50 text-primary-700' : 'bg-white/20 text-emerald-200'
              }`}>
                Village Chanda
              </span>
            </div>
          </div>

          {/* Menu Links - Desktop */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8 text-sm">
            <button
              onClick={() => scrollToSection('home')}
              className={`font-semibold transition-colors hover:text-primary-500 ${
                isScrolled ? 'text-gray-700' : 'text-gray-100'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className={`font-semibold transition-colors hover:text-primary-500 ${
                isScrolled ? 'text-gray-700' : 'text-gray-100'
              }`}
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('glimpses')}
              className={`font-semibold transition-colors hover:text-primary-500 ${
                isScrolled ? 'text-gray-700' : 'text-gray-100'
              }`}
            >
              Glimpses
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className={`font-semibold transition-colors hover:text-primary-500 ${
                isScrolled ? 'text-gray-700' : 'text-gray-100'
              }`}
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('developer')}
              className="font-bold transition-colors text-amber-400 hover:text-amber-300 flex items-center gap-1 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/30"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Developer</span>
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className={`font-semibold transition-colors hover:text-primary-500 ${
                isScrolled ? 'text-gray-700' : 'text-gray-100'
              }`}
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
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  isScrolled
                    ? 'text-gray-700 hover:bg-gray-100 border border-gray-200'
                    : 'text-white border border-white/30 hover:bg-white/10'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => router.push(APP_ROUTES.LOGIN)}
                className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-gray-950 rounded-xl text-xs font-extrabold transition-all shadow-md hover:shadow-lg flex items-center gap-1.5"
              >
                <span>Portal Access</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
              className={`md:hidden p-2 rounded-xl border transition-colors ${
                isScrolled
                  ? 'text-gray-900 border-gray-200 bg-gray-50'
                  : 'text-white border-white/20 bg-white/10 backdrop-blur-md'
              }`}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-950/95 backdrop-blur-2xl text-white border-b border-gray-800 px-5 pt-4 pb-6 mt-2 space-y-4 shadow-2xl animate-fade-in">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <button
              onClick={() => scrollToSection('home')}
              className="p-2.5 text-left rounded-xl bg-gray-900 hover:bg-gray-800 font-semibold text-gray-200"
            >
              🏠 Home
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="p-2.5 text-left rounded-xl bg-gray-900 hover:bg-gray-800 font-semibold text-gray-200"
            >
              ✨ Features
            </button>
            <button
              onClick={() => scrollToSection('glimpses')}
              className="p-2.5 text-left rounded-xl bg-gray-900 hover:bg-gray-800 font-semibold text-gray-200"
            >
              🖼️ Glimpses
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="p-2.5 text-left rounded-xl bg-gray-900 hover:bg-gray-800 font-semibold text-gray-200"
            >
              📖 About Us
            </button>
            <button
              onClick={() => scrollToSection('developer')}
              className="col-span-2 p-2.5 text-left rounded-xl bg-gradient-to-r from-amber-500/20 to-primary-500/20 border border-amber-400/40 font-bold text-amber-300 flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-amber-400" />
                Meet Developer (Rajat Sahu)
              </span>
              <span className="text-[10px] bg-amber-400 text-gray-950 px-2 py-0.5 rounded-full font-extrabold">TechM</span>
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="col-span-2 p-2.5 text-left rounded-xl bg-gray-900 hover:bg-gray-800 font-semibold text-gray-300"
            >
              📞 Contact & Community Info
            </button>
          </div>

          <div className="pt-2 border-t border-gray-800 flex flex-col gap-2">
            <button
              onClick={() => { setMobileMenuOpen(false); router.push(APP_ROUTES.LOGIN); }}
              className="w-full py-3 bg-gradient-to-r from-amber-400 to-amber-500 text-gray-950 font-black rounded-xl text-sm shadow-lg flex items-center justify-center gap-2"
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
