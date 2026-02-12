'use client';

import { useRouter } from 'next/navigation';
import { APP_ROUTES } from '@/core/routes';

export default function CTASection() {
  const router = useRouter();

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Dark Green Background */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)',
        }}
      />

      {/* Pattern Overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Icon */}
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-5xl">
              🚀
            </div>
          </div>

          {/* Heading */}
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Manage Your Festival Contributions Digitally?
          </h2>

          {/* Subtext */}
          <p className="text-xl text-green-50 mb-10 max-w-2xl mx-auto">
            Join hundreds of community members who trust LBC for transparent and
            efficient festival contribution management.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push(APP_ROUTES.LOGIN)}
              className="px-10 py-4 bg-white text-primary-600 rounded-xl font-bold text-lg hover:bg-green-50 transition-all shadow-2xl hover:shadow-3xl transform hover:-translate-y-1"
            >
              Login Now
            </button>
            <button
              onClick={() => router.push(APP_ROUTES.LOGIN)}
              className="px-10 py-4 bg-transparent border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white hover:text-primary-600 transition-all"
            >
              Admin Access
            </button>
          </div>

          {/* Trust Badges */}
          <div className="mt-16 pt-16 border-t border-white/20">
            <div className="grid md:grid-cols-3 gap-8 text-white">
              <div>
                <div className="text-5xl font-bold mb-2">500+</div>
                <div className="text-green-100">Active Families</div>
              </div>
              <div>
                <div className="text-5xl font-bold mb-2">50+</div>
                <div className="text-green-100">Festivals Managed</div>
              </div>
              <div>
                <div className="text-5xl font-bold mb-2">100%</div>
                <div className="text-green-100">Transparency</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
}
