'use client';

import React from 'react';
import { ShieldCheck, Heart, Award, Users, CheckCircle2 } from 'lucide-react';

export default function AboutSection() {
  return (
    <section id="about" className="py-24 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left - High Quality Real Community Photo Frame (5 Cols) */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <img
                  src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1000&q=80"
                  alt="Luhuren Bae Club Community Members"
                  className="w-full h-[460px] object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <p className="text-xs font-bold text-amber-300 uppercase tracking-wider">COMMUNITY HERITAGE</p>
                  <p className="text-lg font-bold">Luhuren Bae Club • Unity in Devotion</p>
                  <p className="text-xs text-gray-300 mt-1">Bridging traditional village harmony with digital transparency.</p>
                </div>
              </div>

              {/* Floating Stat Card */}
              <div className="absolute -bottom-6 -right-4 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 hidden sm:flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900">Zero Register Errors</p>
                  <p className="text-[10px] text-gray-500">Every ₹1 accounted for</p>
                </div>
              </div>
            </div>

            {/* Right - Story & Values (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                <span>Our Story & Purpose</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900">
                Built by the Village, for the Village
              </h2>

              <div className="space-y-4 text-base text-gray-600 leading-relaxed">
                <p>
                  <strong className="text-gray-900 font-bold">LBC (Luhuren Bae Club)</strong> is a grassroots community platform created to eliminate disputes, lost receipts, and handwritten register confusion during annual village festivals.
                </p>
                <p>
                  Whether organizing Durga Puja, Deepavali, Ganesh Puja, or the village feast, hundreds of families contribute their hard-earned money. LBC ensures that every single rupee is digitally tracked, verified by admins, and instantly receipted.
                </p>
                <p>
                  Members who spend out of their own pockets for emergency festival items (decorations, flowers, lighting) can claim transparent reimbursements backed by downloadable audit vouchers.
                </p>
              </div>

              {/* Core Principles */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="w-8 h-8 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center font-bold mb-2">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm">100% Transparency</h4>
                  <p className="text-xs text-gray-500 mt-1">Every family can view their contributions and verified receipts.</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold mb-2">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm">Dual Verification</h4>
                  <p className="text-xs text-gray-500 mt-1">Provisional member slips verified before central treasury credits.</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold mb-2">
                    <Users className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm">Village Harmony</h4>
                  <p className="text-xs text-gray-500 mt-1">Sabha-ready reports that foster trust and community pride.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
