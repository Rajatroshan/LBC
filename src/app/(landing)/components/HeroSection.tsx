'use client';

import { useRouter } from 'next/navigation';
import { APP_ROUTES } from '@/core/routes';
import { 
  Sparkles, 
  ShieldCheck, 
  Wallet, 
  ArrowRight, 
  CheckCircle2, 
  Landmark
} from 'lucide-react';

export default function HeroSection() {
  const router = useRouter();

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-950 text-white pt-20 sm:pt-28 pb-16"
    >
      {/* Subtle Background Glows & Texture */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-10 w-72 sm:w-96 h-72 sm:h-96 bg-amber-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-80 sm:w-[500px] h-80 sm:h-[500px] bg-emerald-400 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-8 sm:gap-12 items-center">
          {/* Left Column: Heading & Value Proposition (7 Cols) */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-amber-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Luhuren Bae Club • Village Chanda System</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              Manage Festival Chanda & Community Funds{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-yellow-400">
                100% Transparently
              </span>
            </h1>

            <p className="text-sm sm:text-lg text-emerald-100 max-w-2xl leading-relaxed">
              Say goodbye to messy paper registers. Track family chanda contributions, verify festival collections with instant signed receipts, and settle member out-of-pocket vendor reimbursements effortlessly.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                onClick={() => router.push(APP_ROUTES.LOGIN)}
                className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-gray-950 rounded-xl font-bold transition-all shadow-xl hover:shadow-2xl transform active:scale-95 flex items-center justify-center gap-2 text-sm"
              >
                <span>Access Portal / Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#features"
                className="w-full sm:w-auto px-6 py-3.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl font-semibold transition-all backdrop-blur-md text-sm text-center"
              >
                Explore Features ↓
              </a>
            </div>

            {/* Realistic Community Stats */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-6 border-t border-emerald-700/60 max-w-xl text-center sm:text-left">
              <div>
                <p className="text-xl sm:text-3xl font-black text-white">650+</p>
                <p className="text-[10px] sm:text-xs text-emerald-200 mt-0.5 font-medium">Village Families</p>
              </div>
              <div>
                <p className="text-xl sm:text-3xl font-black text-amber-300">₹12.5L+</p>
                <p className="text-[10px] sm:text-xs text-emerald-200 mt-0.5 font-medium">Handled Cleanly</p>
              </div>
              <div>
                <p className="text-xl sm:text-3xl font-black text-white">100%</p>
                <p className="text-[10px] sm:text-xs text-emerald-200 mt-0.5 font-medium">Verified Receipts</p>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Realistic App Card Showcase (5 Cols) */}
          <div className="lg:col-span-5 relative">
            {/* Main Interactive Live Preview Card */}
            <div className="bg-white/95 backdrop-blur-xl text-gray-900 rounded-3xl p-4 sm:p-6 shadow-2xl border border-white/40 space-y-3.5">
              {/* Card Header */}
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center text-white font-bold text-base shadow-md">
                    🪔
                  </div>
                  <div>
                    <h2 className="text-xs sm:text-sm font-bold text-gray-900">Durga Puja Mahotsav</h2>
                    <p className="text-[10px] text-gray-500">Live Collection Progress</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800">
                  Active Festival
                </span>
              </div>

              {/* Progress & Target */}
              <div className="p-3 bg-emerald-50/70 rounded-2xl border border-emerald-200/60 space-y-1.5">
                <div className="flex justify-between items-baseline text-xs">
                  <span className="text-gray-600 text-[11px] font-medium">Collected / Target</span>
                  <span className="font-extrabold text-emerald-800 text-xs sm:text-sm">₹1,85,000 / ₹2,00,000</span>
                </div>
                {/* Progress bar */}
                <div className="w-full h-2 bg-emerald-200/70 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full transition-all duration-1000" style={{ width: '92.5%' }}></div>
                </div>
                <div className="flex justify-between text-[10px] text-emerald-700">
                  <span>92.5% Target Achieved</span>
                  <span>74 Families Paid</span>
                </div>
              </div>

              {/* Verified Family Contribution Item */}
              <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-200/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-primary-100 text-primary-700 font-bold flex items-center justify-center text-[10px]">
                    RS
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-xs">Rajat Kumar Sahu</p>
                    <p className="text-[9px] text-gray-500">Family #104 • 5 Members</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-extrabold text-emerald-700 text-xs">₹2,500</p>
                  <span className="inline-flex items-center gap-0.5 text-[8px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded-full">
                    <CheckCircle2 className="w-2 h-2" /> Verified
                  </span>
                </div>
              </div>

              {/* Out-of-Pocket Reimbursement Item */}
              <div className="p-2.5 bg-amber-50/70 rounded-xl border border-amber-200/70 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 font-bold flex items-center justify-center text-[10px]">
                    <Wallet className="w-3.5 h-3.5 text-amber-700" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-xs">Stage Lighting & Sound</p>
                    <p className="text-[9px] text-gray-500">Out-of-Pocket Claim</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-extrabold text-amber-800 text-xs">₹4,500</p>
                  <span className="inline-flex items-center gap-0.5 text-[8px] font-bold text-primary-700 bg-primary-100 px-1.5 py-0.2 rounded-full">
                    <Landmark className="w-2 h-2" /> Settled
                  </span>
                </div>
              </div>

              {/* Bottom Quick Metric Footer */}
              <div className="grid grid-cols-2 gap-2 pt-0.5 text-center">
                <div className="p-1.5 bg-gray-50 rounded-lg">
                  <p className="text-[9px] text-gray-400 font-medium">TREASURY BALANCE</p>
                  <p className="text-xs sm:text-sm font-black text-gray-800">₹48,250</p>
                </div>
                <div className="p-1.5 bg-gray-50 rounded-lg">
                  <p className="text-[9px] text-gray-400 font-medium">RECEIPTS ISSUED</p>
                  <p className="text-xs sm:text-sm font-black text-primary-700">142 Slips</p>
                </div>
              </div>
            </div>

            {/* Decorative Floating Badges */}
            <div className="hidden sm:flex absolute -bottom-4 -left-4 bg-white text-gray-900 px-3.5 py-2 rounded-2xl shadow-xl border border-gray-100 items-center gap-2 text-xs font-bold">
              <div className="w-6 h-6 rounded-lg bg-emerald-500 text-white flex items-center justify-center">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-[10px] font-extrabold text-gray-900">1-Click Admin Approval</p>
                <p className="text-[8px] text-gray-400 font-normal">Audit-safe PDF vouchers</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
