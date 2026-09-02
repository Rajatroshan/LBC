'use client';

import React from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  Wallet, 
  Receipt, 
  Users, 
  BarChart3, 
  FileCheck2,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { APP_ROUTES } from '@/core/routes';

const coreFeatures = [
  {
    icon: Sparkles,
    badge: 'FESTIVALS & EVENTS',
    title: 'Festival Lifecycle & Multi-Day Trackers',
    description: 'Create single-day or duration festivals (Durga Puja, Deepavali, Holi, Ratha Yatra). Automatically sets family quotas, dates, and active collection targets.',
    accentColor: 'from-amber-500 to-orange-600',
    tag: 'Automated Quotas',
  },
  {
    icon: ShieldCheck,
    badge: 'PAYMENT VERIFICATION',
    title: 'Dual-Layer Chanda Collection & Approvals',
    description: 'Members record chanda payments and receive provisional slips. Admins verify contributions in 1-click to credit the central treasury and release official receipts.',
    accentColor: 'from-emerald-500 to-teal-600',
    tag: '1-Click Verification',
  },
  {
    icon: Wallet,
    badge: 'REIMBURSEMENTS HUB',
    title: 'Out-of-Pocket Member Reimbursements',
    description: 'Members paying vendor bills from personal pockets maintain individual ledgers. Raise money requests with UPI payout destinations and receive official settlement vouchers.',
    accentColor: 'from-primary-600 to-emerald-700',
    tag: 'Settlement Vouchers',
  },
  {
    icon: Receipt,
    badge: 'TREASURY & EXPENSES',
    title: 'Master Account Treasury & Invoices',
    description: 'Track tent, sound, decoration, priest, and catering costs. Instant PDF invoices with breakdown numbers, timestamps, and authorized signatory seals.',
    accentColor: 'from-blue-500 to-indigo-600',
    tag: 'Official Invoices',
  },
  {
    icon: Users,
    badge: 'HOUSEHOLDS DIRECTORY',
    title: 'Village Families & Household Directory',
    description: 'Manage head of families, member counts, address, phone numbers, and complete historical chanda contribution ledgers across all past years.',
    accentColor: 'from-purple-500 to-pink-600',
    tag: 'Complete History',
  },
  {
    icon: BarChart3,
    badge: 'AUDIT & TRANSPARENCY',
    title: 'Festival Balance Sheets & Audit Reports',
    description: 'Real-time financial balance sheets comparing collections versus actual expenses. Exportable statements for annual village general body meetings.',
    accentColor: 'from-rose-500 to-red-600',
    tag: 'Sabha Ready',
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-gray-50/80">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-3">
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Built Specifically for Village Committees & Clubs</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 mb-4">
            Everything Your Club Needs for Total Transparency
          </h2>
          <p className="text-base sm:text-lg text-gray-600">
            Engineered to remove arguments, lost paper receipts, and confusion during annual village festival accounts.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {coreFeatures.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-7 border border-gray-200/80 hover:border-primary-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.accentColor} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                      {feature.tag}
                    </span>
                  </div>

                  <p className="text-[10px] font-extrabold text-primary-700 tracking-wider mb-1">
                    {feature.badge}
                  </p>
                  <h3 className="text-xl font-bold text-gray-900 mb-2.5 group-hover:text-primary-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                <div className="pt-5 mt-5 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-primary-600">
                  <span>Learn workflow</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="mt-14 max-w-4xl mx-auto bg-gradient-to-r from-emerald-800 to-teal-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold mb-2">Ready to digitize your village club chanda?</h3>
            <p className="text-emerald-100 text-sm">Join over 650+ families with 100% digital records & zero paperwork.</p>
          </div>
          <Link href={APP_ROUTES.LOGIN}>
            <button className="px-6 py-3.5 bg-amber-400 hover:bg-amber-500 text-gray-950 rounded-xl font-bold text-sm shadow-lg whitespace-nowrap transition-all">
              Launch LBC Portal →
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
