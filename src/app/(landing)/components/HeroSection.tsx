'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { APP_ROUTES } from '@/core/routes';
import { 
  ArrowRight, 
  CheckCircle2, 
  Landmark, 
  Sparkles, 
  ShieldCheck, 
  Wallet,
  Coins
} from 'lucide-react';
import { 
  CartoonClouds, 
  FlyingBirds, 
  CuteFarmerAvatar, 
  CuteTempleMandap, 
  CuteVillageCow, 
  CuteTractor, 
  SwayingCrops, 
  CartoonDiya, 
  MarigoldToran 
} from './VillageIllustrations';

export default function HeroSection() {
  const router = useRouter();
  const [farmerGreeted, setFarmerGreeted] = useState(false);
  const [bellRung, setBellRung] = useState(false);

  const handleFarmerClick = () => {
    setFarmerGreeted(true);
    setTimeout(() => setFarmerGreeted(false), 3000);
  };

  const handleBellRing = () => {
    setBellRung(true);
    setTimeout(() => setBellRung(false), 1500);
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-gradient-to-b from-amber-100/70 via-orange-50/60 to-emerald-50/80 text-stone-900 pt-20 sm:pt-24 pb-12 select-none"
    >
      {/* 🌸 Traditional Doorway Marigold Toran Garland */}
      <MarigoldToran className="absolute top-16 left-0 right-0 z-20 opacity-90" />

      {/* 🌤️ Animated Sky with Slow Clouds & Flying Birds */}
      <CartoonClouds className="z-0" />
      <div className="absolute top-24 left-0 w-full z-0">
        <FlyingBirds />
      </div>

      {/* ☀️ Warm Morning Sun vector behind clouds */}
      <div className="absolute top-10 right-12 sm:right-32 w-32 h-32 sm:w-44 sm:h-44 bg-gradient-to-br from-amber-300 via-orange-300 to-yellow-200 rounded-full blur-2xl opacity-40 pointer-events-none animate-float-gentle"></div>

      {/* Main Content Container */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 my-auto">
        <div className="grid lg:grid-cols-12 gap-8 sm:gap-12 items-center">
          
          {/* Left Column: Village Storybook Headline & CTAs (7 Cols) */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-center lg:text-left">
            
            {/* Playful Traditional Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100/90 border-2 border-amber-300 text-xs font-bold text-amber-900 shadow-sm animate-float-gentle">
              <span className="text-base">🪔</span>
              <span>Luhuren Bae Club • Digital Gram Sabha & Mandap</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            </div>

            {/* Headline with Indian Village warmth */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-stone-900 leading-[1.15]">
              Apna Gaon, Digital Chanda &amp;{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-600 to-emerald-700">
                100% Khula Hisab
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-sm sm:text-lg text-stone-700 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
              Say goodbye to missing paper diaries and festival confusion. Manage village puja subscriptions, issue instant digital signed receipts to every family, and approve vendor reimbursements with complete transparency.
            </p>

            {/* Village Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
              <button
                onClick={() => router.push(APP_ROUTES.LOGIN)}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-white rounded-2xl font-black text-sm transition-all shadow-lg hover:shadow-orange-300/50 transform active:scale-95 flex items-center justify-center gap-2 border-2 border-amber-200"
              >
                <span>🌱 Enter Village Portal / Login</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#features"
                className="w-full sm:w-auto px-6 py-4 bg-white/90 hover:bg-amber-50 border-2 border-amber-200 text-stone-800 rounded-2xl font-bold transition-all shadow-sm text-sm text-center"
              >
                🌾 Explore Village Features ↓
              </a>
            </div>

            {/* Interactive Cartoon Characters & Community Badges */}
            <div className="pt-6 border-t-2 border-dashed border-amber-200 flex flex-wrap items-center justify-center lg:justify-start gap-6">
              
              {/* Interactive Waving Farmer */}
              <div 
                onClick={handleFarmerClick}
                className="flex items-center gap-2.5 bg-white/90 border-2 border-amber-300 px-3.5 py-2 rounded-2xl shadow-sm hover:shadow-md cursor-pointer transition-all hover:scale-105 active:scale-95 group"
                title="Click to say Namaste!"
              >
                <CuteFarmerAvatar size={46} />
                <div className="text-left">
                  <p className="text-xs font-black text-stone-900 flex items-center gap-1">
                    Kisan Bhai {farmerGreeted ? '🙏 Namaste!' : '👋'}
                  </p>
                  <p className="text-[10px] text-amber-700 font-semibold">
                    {farmerGreeted ? 'Sabhi Parivar Safe!' : 'Tap for blessings!'}
                  </p>
                </div>
              </div>

              {/* Village Stats Pills */}
              <div className="flex items-center gap-4 text-left">
                <div className="bg-white/80 border border-emerald-200 px-3.5 py-2 rounded-2xl">
                  <p className="text-xl sm:text-2xl font-black text-emerald-800">650+</p>
                  <p className="text-[10px] text-emerald-700 font-bold">Village Families</p>
                </div>

                <div className="bg-white/80 border border-orange-200 px-3.5 py-2 rounded-2xl">
                  <p className="text-xl sm:text-2xl font-black text-orange-800">₹12.5L+</p>
                  <p className="text-[10px] text-orange-700 font-bold">Puja Treasury</p>
                </div>

                <div className="bg-white/80 border border-amber-200 px-3.5 py-2 rounded-2xl">
                  <p className="text-xl sm:text-2xl font-black text-amber-800">100%</p>
                  <p className="text-[10px] text-amber-700 font-bold">Signed Slips</p>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Cartoon Village Mandap Digital Card Preview (5 Cols) */}
          <div className="lg:col-span-5 relative">
            
            {/* Interactive Storybook Card */}
            <div className="bg-white/95 backdrop-blur-md rounded-3xl p-5 sm:p-6 shadow-xl border-4 border-amber-200 space-y-4 relative">
              
              {/* Card Header with Cute Cartoon Mandap & Bell */}
              <div className="flex items-center justify-between pb-3 border-b-2 border-amber-100">
                <div className="flex items-center gap-3">
                  <div 
                    onClick={handleBellRing}
                    className={`cursor-pointer transition-transform ${bellRung ? 'animate-bell scale-110' : 'hover:scale-105'}`}
                    title="Click temple to ring the bell!"
                  >
                    <CuteTempleMandap size={52} />
                  </div>
                  <div>
                    <h2 className="text-sm sm:text-base font-black text-stone-900 flex items-center gap-1.5">
                      Durga Puja Mahotsav 🪔
                    </h2>
                    <p className="text-[11px] text-amber-800 font-semibold">
                      {bellRung ? '🔔 Tring! Puja Mandap Active' : 'Village Mandap Live Progress'}
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-[10px] font-black bg-emerald-100 border border-emerald-300 text-emerald-800 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Active Puja
                </span>
              </div>

              {/* Progress & Target with Earthen Village Styling */}
              <div className="p-3.5 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-200 space-y-2">
                <div className="flex justify-between items-baseline text-xs">
                  <span className="text-stone-700 text-[11px] font-bold">Total Chanda / Budget</span>
                  <span className="font-black text-orange-900 text-sm sm:text-base">₹1,85,000 / ₹2,00,000</span>
                </div>
                
                {/* Visual Progress Bar */}
                <div className="w-full h-3 bg-amber-200/80 rounded-full overflow-hidden p-0.5 border border-amber-300">
                  <div className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-1000 shadow-inner" style={{ width: '92.5%' }}></div>
                </div>

                <div className="flex justify-between text-[11px] text-stone-600 font-bold">
                  <span className="text-emerald-700">🌱 92.5% Target Achieved</span>
                  <span className="text-orange-800">👨🌾 74 Families Contributed</span>
                </div>
              </div>

              {/* Verified Contribution Entry */}
              <div className="p-3 bg-amber-50/50 rounded-2xl border border-amber-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-800 font-black flex items-center justify-center text-xs border border-orange-300">
                    RS
                  </div>
                  <div>
                    <p className="font-extrabold text-stone-900 text-xs">Rajat Kumar Sahu</p>
                    <p className="text-[10px] text-stone-500">Parivar #104 • 5 Sadasya</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-emerald-800 text-sm">₹2,500</p>
                  <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                    Verified Slip
                  </span>
                </div>
              </div>

              {/* Out-of-Pocket Reimbursement Entry */}
              <div className="p-3 bg-orange-50/50 rounded-2xl border border-orange-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 font-black flex items-center justify-center border border-amber-300">
                    <Wallet className="w-4 h-4 text-amber-700" />
                  </div>
                  <div>
                    <p className="font-extrabold text-stone-900 text-xs">Mandap Lighting &amp; Sound</p>
                    <p className="text-[10px] text-stone-500">Kisan Out-of-Pocket Claim</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-orange-900 text-sm">₹4,500</p>
                  <span className="inline-flex items-center gap-1 text-[9px] font-bold text-amber-800 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full">
                    <Landmark className="w-2.5 h-2.5 text-amber-700" />
                    Settled
                  </span>
                </div>
              </div>

              {/* Bottom Micro Metrics */}
              <div className="grid grid-cols-2 gap-2 pt-1 text-center">
                <div className="p-2 bg-stone-50 rounded-xl border border-stone-200">
                  <p className="text-[9px] text-stone-500 font-bold uppercase tracking-wider">TREASURY GULLAK</p>
                  <p className="text-sm font-black text-stone-800">₹48,250</p>
                </div>
                <div className="p-2 bg-stone-50 rounded-xl border border-stone-200">
                  <p className="text-[9px] text-stone-500 font-bold uppercase tracking-wider">RECEIPTS ISSUED</p>
                  <p className="text-sm font-black text-emerald-800">142 Receipts</p>
                </div>
              </div>

              {/* Decorative Diya Corner Accent */}
              <div className="absolute -top-6 -right-6">
                <CartoonDiya size={54} />
              </div>
            </div>

            {/* Floating Village Stamp Badge */}
            <div className="hidden sm:flex absolute -bottom-5 -left-5 bg-white text-stone-900 px-4 py-2.5 rounded-2xl shadow-lg border-2 border-amber-300 items-center gap-2.5 text-xs">
              <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-black text-stone-900">1-Click Admin Audit</p>
                <p className="text-[9px] text-stone-500 font-semibold">Instant Signed PDF Vouchers</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 🌾 Bottom Village Landscape Horizon with Swaying Crops, Cow, and Moving Tractor */}
      <div className="w-full relative mt-8 pt-4 border-t-2 border-amber-200/80 bg-gradient-to-t from-emerald-100/90 via-emerald-50/50 to-transparent">
        <div className="container mx-auto px-4 flex justify-between items-end overflow-hidden h-20 sm:h-24">
          
          {/* Left: Swaying crops & cute cow */}
          <div className="flex items-end gap-2">
            <SwayingCrops size={48} className="text-emerald-600" />
            <SwayingCrops size={54} className="text-emerald-700 -ml-4" />
            <CuteVillageCow size={64} className="hover:scale-110 transition-transform cursor-pointer" />
            <SwayingCrops size={42} className="hidden sm:block text-emerald-600" />
          </div>

          {/* Center: Friendly Village Banner */}
          <div className="hidden md:flex items-center gap-2 pb-2 text-stone-600 font-extrabold text-xs">
            <Coins className="w-4 h-4 text-amber-600" />
            <span>Luhuren Bae Village Community Foundation • Digital Mandap 2026</span>
          </div>

          {/* Right: Moving Tractor & Crops */}
          <div className="flex items-end gap-2">
            <CuteTractor size={60} className="hover:scale-110 transition-transform cursor-pointer" />
            <SwayingCrops size={48} className="text-emerald-600" />
            <SwayingCrops size={54} className="text-emerald-700 -ml-4" />
          </div>

        </div>
      </div>
    </section>
  );
}
