'use client';

import { useRouter } from 'next/navigation';
import { APP_ROUTES } from '@/core/routes';

export default function HeroSection() {
  const router = useRouter();

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #43a047 0%, #1b5e20 100%)',
      }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-32 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Side - Content */}
          <div className="text-white animate-slide-in-left">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Manage Festival Contributions{' '}
              <span className="text-secondary-300">Digitally</span> with LBC
            </h1>
            <p className="text-xl mb-8 text-green-50 leading-relaxed">
              A simple community platform to track village festival collections,
              families, and transparent contributions.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => router.push(APP_ROUTES.LOGIN)}
                className="px-8 py-4 bg-white text-primary-600 rounded-lg font-semibold hover:bg-green-50 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
              >
                Get Started
              </button>
              <button
                onClick={() => router.push(APP_ROUTES.LOGIN)}
                className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-all"
              >
                Login
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-green-400">
              <div>
                <div className="text-3xl font-bold">500+</div>
                <div className="text-green-100 text-sm">Families</div>
              </div>
              <div>
                <div className="text-3xl font-bold">50+</div>
                <div className="text-green-100 text-sm">Festivals</div>
              </div>
              <div>
                <div className="text-3xl font-bold">100%</div>
                <div className="text-green-100 text-sm">Transparency</div>
              </div>
            </div>
          </div>

          {/* Right Side - App Mockup */}
          <div className="relative animate-float">
            <div className="relative z-10">
              {/* Phone Mockup */}
              <div className="bg-white rounded-3xl shadow-2xl p-4 max-w-md mx-auto">
                <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-6">
                  {/* Mock Dashboard */}
                  <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <div className="h-3 w-24 bg-primary-200 rounded"></div>
                      <div className="h-6 w-6 bg-primary-500 rounded-full"></div>
                    </div>
                    <div className="h-2 w-32 bg-gray-200 rounded mb-2"></div>
                    <div className="h-2 w-20 bg-gray-200 rounded"></div>
                  </div>

                  {/* Mock Cards */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white rounded-lg p-3 shadow-sm">
                      <div className="h-8 w-8 bg-primary-500 rounded-lg mb-2"></div>
                      <div className="h-2 w-16 bg-gray-200 rounded mb-1"></div>
                      <div className="h-3 w-12 bg-primary-300 rounded"></div>
                    </div>
                    <div className="bg-white rounded-lg p-3 shadow-sm">
                      <div className="h-8 w-8 bg-secondary-500 rounded-lg mb-2"></div>
                      <div className="h-2 w-16 bg-gray-200 rounded mb-1"></div>
                      <div className="h-3 w-12 bg-secondary-300 rounded"></div>
                    </div>
                  </div>

                  {/* Mock List */}
                  <div className="mt-4 space-y-2">
                    <div className="bg-white rounded-lg p-3 shadow-sm flex items-center gap-3">
                      <div className="h-10 w-10 bg-primary-200 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-2 w-24 bg-gray-200 rounded mb-1"></div>
                        <div className="h-2 w-16 bg-gray-100 rounded"></div>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-3 shadow-sm flex items-center gap-3">
                      <div className="h-10 w-10 bg-secondary-200 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-2 w-24 bg-gray-200 rounded mb-1"></div>
                        <div className="h-2 w-16 bg-gray-100 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-6 -right-6 w-20 h-20 bg-secondary-400 rounded-2xl animate-float-delayed opacity-80"></div>
            <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-primary-300 rounded-full animate-float opacity-80"></div>
          </div>
        </div>
      </div>

      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
}
