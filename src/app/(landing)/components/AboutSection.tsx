'use client';

import React from 'react';
import { ShieldCheck, Heart, Award, Users, CheckCircle2, Sparkles } from 'lucide-react';
import { CuteTempleMandap, CuteFarmerAvatar, CuteVillageCow, CartoonDiya } from './VillageIllustrations';

export default function AboutSection() {
  return (
    <section id="about" className="py-20 sm:py-28 bg-[#FFFDF7] relative overflow-hidden border-b-2 border-amber-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-8 sm:gap-12 items-center">
            
            {/* Left - Storybook Cartoon Village Illustration Showcase (5 Cols) */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-amber-300 bg-gradient-to-b from-amber-100 via-orange-50 to-emerald-50 p-6 sm:p-8 flex flex-col items-center justify-between min-h-[420px] text-center">
                
                {/* Top Badge */}
                <div className="flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/90 border border-amber-300 text-xs font-black text-amber-900 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Gram Heritage &amp; Ekta</span>
                </div>

                {/* Center Cartoon Mandap & Characters */}
                <div className="my-4 space-y-3">
                  <CuteTempleMandap size={110} className="mx-auto hover:scale-105 transition-transform" />
                  
                  <div className="flex items-end justify-center gap-3">
                    <CuteFarmerAvatar size={60} className="hover:scale-110 transition-transform" />
                    <CuteVillageCow size={56} className="hover:scale-110 transition-transform" />
                    <CartoonDiya size={42} />
                  </div>
                </div>

                {/* Bottom Storybook Banner */}
                <div className="bg-white/95 rounded-2xl p-3.5 border-2 border-amber-200 shadow-sm w-full">
                  <p className="text-xs font-black text-stone-900">Luhuren Bae Club • Village Mandap</p>
                  <p className="text-[10px] text-stone-600 mt-0.5 font-semibold">Bridging traditional village values with modern digital clarity.</p>
                </div>
              </div>

              {/* Floating Stat Card */}
              <div className="absolute -bottom-5 -right-3 bg-white p-3.5 rounded-2xl shadow-lg border-2 border-amber-300 hidden sm:flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Award className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-black text-stone-900">Zero Register Errors</p>
                  <p className="text-[10px] text-emerald-700 font-bold">Har Rupaya Ka Khula Hisab</p>
                </div>
              </div>
            </div>

            {/* Right - Story & Values (7 Cols) */}
            <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-black">
                <Heart className="w-3.5 h-3.5 text-rose-600 fill-rose-600" />
                <span>Our Village Story &amp; Purpose</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-stone-900">
                Gaon Ka Vishwas,{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600">
                  Digital Mandap
                </span>
              </h2>

              <div className="space-y-3.5 text-xs sm:text-sm text-stone-700 leading-relaxed font-medium">
                <p>
                  <strong className="text-stone-900 font-black">LBC (Luhuren Bae Club)</strong> is a grassroots community initiative engineered to eliminate disputes, misplaced paper receipts, and confusion during annual village festivals.
                </p>
                <p>
                  Whether organizing Durga Puja, Deepavali, Ganesh Puja, or the grand community feast, hundreds of households contribute their hard-earned money. LBC ensures that every contribution is digitally recorded, verified by committee admins, and instantly receipted.
                </p>
                <p>
                  Village volunteers who spend out of their own pockets for emergency festival preparations (decorations, flowers, sound) can claim transparent reimbursements backed by downloadable audit vouchers.
                </p>
              </div>

              {/* Core Principles */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-3">
                <div className="p-4 bg-amber-50/80 rounded-2xl border-2 border-amber-200">
                  <div className="w-8 h-8 rounded-xl bg-white border border-amber-300 text-amber-800 flex items-center justify-center font-bold mb-2 shadow-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <h4 className="font-black text-stone-900 text-xs sm:text-sm">100% Transparency</h4>
                  <p className="text-[11px] text-stone-600 mt-1 font-medium">Every household can view their contributions and verified receipts.</p>
                </div>

                <div className="p-4 bg-orange-50/80 rounded-2xl border-2 border-orange-200">
                  <div className="w-8 h-8 rounded-xl bg-white border border-orange-300 text-orange-800 flex items-center justify-center font-bold mb-2 shadow-sm">
                    <ShieldCheck className="w-4 h-4 text-orange-600" />
                  </div>
                  <h4 className="font-black text-stone-900 text-xs sm:text-sm">Dual Verification</h4>
                  <p className="text-[11px] text-stone-600 mt-1 font-medium">Provisional slips verified by admin before central treasury credits.</p>
                </div>

                <div className="p-4 bg-emerald-50/80 rounded-2xl border-2 border-emerald-200">
                  <div className="w-8 h-8 rounded-xl bg-white border border-emerald-300 text-emerald-800 flex items-center justify-center font-bold mb-2 shadow-sm">
                    <Users className="w-4 h-4 text-emerald-600" />
                  </div>
                  <h4 className="font-black text-stone-900 text-xs sm:text-sm">Gram Harmony</h4>
                  <p className="text-[11px] text-stone-600 mt-1 font-medium">Sabha-ready reports that foster trust and community pride.</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
