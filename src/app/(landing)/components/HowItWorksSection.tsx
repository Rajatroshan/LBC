'use client';

import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

const villageSteps = [
  {
    step: '01',
    iconEmoji: '🪔',
    title: 'Puja Mandap & Quota Setup',
    description: 'Committee announces festival dates (Durga Puja, Deepavali, etc.) and fixes the chanda contribution per village household.',
    badge: 'Step 1 • Yojna',
    cardBg: 'bg-amber-50/90',
    borderColor: 'border-amber-300',
  },
  {
    step: '02',
    iconEmoji: '📜',
    title: 'Doorstep Chanda Collection',
    description: 'Volunteers collect family subscriptions and instantly issue an official digital provisional slip to each household head.',
    badge: 'Step 2 • Sangrah',
    cardBg: 'bg-orange-50/90',
    borderColor: 'border-orange-300',
  },
  {
    step: '03',
    iconEmoji: '🛡️',
    title: 'Admin Verification & Gullak Credit',
    description: 'Committee Admins verify the collection in 1-click. Funds are credited to the central treasury gullak with verified green receipts.',
    badge: 'Step 3 • Pramanikaran',
    cardBg: 'bg-emerald-50/90',
    borderColor: 'border-emerald-300',
  },
  {
    step: '04',
    iconEmoji: '📊',
    title: 'Vendor Invoices & Sabha Audit',
    description: 'Log tent/sound expenses, settle out-of-pocket claims, and present complete PDF balance sheets at the Gram Sabha gathering.',
    badge: 'Step 4 • Khula Hisab',
    cardBg: 'bg-yellow-50/90',
    borderColor: 'border-yellow-300',
  },
];

export default function HowItWorksSection() {
  return (
    <section className="py-20 sm:py-28 bg-[#FFFDF7] relative overflow-hidden border-b-2 border-amber-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-black">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Simple 4-Step Village Workflow</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-stone-900">
            How Festival Chanda Flows in{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600">
              Our Village
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 font-medium">
            From initial festival announcement to final vendor payouts and Sabha general body audits.
          </p>
        </div>

        {/* Workflow Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto relative">
          {villageSteps.map((step, idx) => (
            <div
              key={idx}
              className={`${step.cardBg} ${step.borderColor} border-2 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 relative flex flex-col justify-between group hover:-translate-y-1`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-black text-stone-300 group-hover:text-amber-500 transition-colors">
                    {step.step}
                  </span>
                  <div className="w-12 h-12 rounded-2xl bg-white border-2 border-amber-200 flex items-center justify-center text-2xl shadow-md group-hover:scale-110 transition-transform">
                    {step.iconEmoji}
                  </div>
                </div>

                <span className="text-[10px] font-black text-amber-800 uppercase tracking-wider block mb-1">
                  {step.badge}
                </span>
                <h3 className="text-base sm:text-lg font-black text-stone-900 mb-2 group-hover:text-orange-600 transition-colors">
                  {step.title}
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed font-medium">
                  {step.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t-2 border-dashed border-amber-200/80 flex items-center gap-1 text-[11px] font-bold text-stone-500">
                <span>Village Step {idx + 1}</span>
                {idx < 3 && <ArrowRight className="w-3.5 h-3.5 text-orange-600 ml-auto group-hover:translate-x-1 transition-transform" />}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
