'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { APP_ROUTES } from '@/core/routes';

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white shadow-md py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">L</span>
            </div>
            <span className={`text-2xl font-bold transition-colors ${
              isScrolled ? 'text-primary-700' : 'text-white'
            }`}>
              LBC
            </span>
          </div>

          {/* Menu Links - Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection('home')}
              className={`font-medium transition-colors hover:text-primary-600 ${
                isScrolled ? 'text-gray-700' : 'text-white'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className={`font-medium transition-colors hover:text-primary-600 ${
                isScrolled ? 'text-gray-700' : 'text-white'
              }`}
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('glimpses')}
              className={`font-medium transition-colors hover:text-primary-600 ${
                isScrolled ? 'text-gray-700' : 'text-white'
              }`}
            >
              Glimpses
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className={`font-medium transition-colors hover:text-primary-600 ${
                isScrolled ? 'text-gray-700' : 'text-white'
              }`}
            >
              About Us
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className={`font-medium transition-colors hover:text-primary-600 ${
                isScrolled ? 'text-gray-700' : 'text-white'
              }`}
            >
              Contact
            </button>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push(APP_ROUTES.LOGIN)}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                isScrolled
                  ? 'text-primary-600 hover:bg-primary-50'
                  : 'text-white border border-white hover:bg-white hover:text-primary-600'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => router.push(APP_ROUTES.LOGIN)}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-all shadow-lg hover:shadow-xl"
            >
              Admin Login
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
