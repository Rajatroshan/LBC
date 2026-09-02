'use client';

import React from 'react';
import { Sparkles, CreditCard, ShieldCheck, Wallet, ArrowRight } from 'lucide-react';

const workflowSteps = [
  {
    step: '01',
    title: 'Schedule Festival & Quotas',
    description: 'Committee sets up the festival (Durga Puja, Diwali, etc.), dates, and fixed contribution quota per family.',
    icon: Sparkles,
    badge: 'Step 1 • Planning',
    color: 'from-amber-500 to-orange-600',
  },
  {
    step: '02',
    title: 'Record & Issue Provisional Slip',
    description: 'Members or volunteers submit payments. An amber provisional contribution slip is instantly generated.',
    icon: CreditCard,
    badge: 'Step 2 • Collection',
    color: 'from-primary-600 to-emerald-700',
  },
  {
    step: '03',
    title: 'Admin Verification & Treasury Credit',
    description: 'Admin reviews the verification queue and confirms receipt with 1-click. Master treasury balance updates live.',
    icon: ShieldCheck,
    badge: 'Step 3 • Authorization',
    color: 'from-emerald-600 to-teal-700',
  },
  {
    step: '04',
    title: 'Vendor Invoices & Reimbursements',
    description: 'Track vendor costs and settle out-of-pocket member claims with signed PDF vouchers and complete audit trails.',
    icon: Wallet,
    badge: 'Step 4 • Settlement',
    color: 'from-blue-600 to-indigo-700',
  },
];

export default function HowItWorksSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold mb-3">
            <span>Simple, Transparent 4-Step Process</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 mb-4">
            How Festival Management Works in LBC
          </h2>
          <p className="text-base sm:text-lg text-gray-600">
            From initial festival announcement to final vendor payouts and Sabha reports.
          </p>
        </div>

        {/* Workflow Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto relative">
          {workflowSteps.map((step, idx) => {
            const IconComp = step.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 border border-gray-200/90 shadow-sm hover:shadow-xl transition-all duration-300 relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black text-gray-200">
                      {step.step}
                    </span>
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${step.color} text-white flex items-center justify-center shadow-md`}>
                      <IconComp className="w-5 h-5" />
                    </div>
                  </div>

                  <span className="text-[10px] font-extrabold text-primary-700 uppercase tracking-wider block mb-1">
                    {step.badge}
                  </span>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-gray-100 flex items-center gap-1 text-[11px] font-bold text-gray-400">
                  <span>Phase {idx + 1}</span>
                  {idx < 3 && <ArrowRight className="w-3 h-3 text-primary-500 ml-auto" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
