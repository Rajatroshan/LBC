'use client';

import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Sparkles, 
  CreditCard, 
  Wallet, 
  Receipt, 
  BarChart3, 
  ShieldCheck, 
  ArrowRight
} from 'lucide-react';

const moduleScreens = [
  {
    id: 'dashboard',
    title: 'Financial & Community Dashboard',
    tag: 'Live Treasury',
    description: 'Real-time overview of active festivals, treasury balance, total collections, and member reimbursement liability.',
    icon: LayoutDashboard,
    badgeColor: 'bg-emerald-100 text-emerald-800',
    highlight: 'Available Treasury Balance: ₹48,250',
    metrics: [
      { label: 'Collections 2026', value: '₹1,85,000' },
      { label: 'Expenses Disbursed', value: '₹1,36,750' },
      { label: 'Families Contributing', value: '650' },
    ],
  },
  {
    id: 'payments',
    title: 'Dual-Approval Payments & Verification',
    tag: '1-Click Audit',
    description: 'Provisional member chanda slips enter the Admin queue. 1-click verification marks as Paid and issues official signed PDF receipts.',
    icon: CreditCard,
    badgeColor: 'bg-primary-100 text-primary-800',
    highlight: 'Verified & Marked as Paid with Instant Receipt',
    metrics: [
      { label: 'Official Receipts', value: '142 Slips' },
      { label: 'Pending Verification', value: '3 Awaiting' },
      { label: 'Signed PDFs', value: '100% Generated' },
    ],
  },
  {
    id: 'reimbursements',
    title: 'Out-of-Pocket Reimbursements Hub',
    tag: 'Member Ledgers',
    description: 'Members log vendor expenses from personal money. Raise money requests to receive instant Admin payout settlement vouchers.',
    icon: Wallet,
    badgeColor: 'bg-amber-100 text-amber-800',
    highlight: 'Settlement Vouchers with UPI Payout Records',
    metrics: [
      { label: 'Community Out-of-Pocket', value: '₹42,500' },
      { label: 'Reimbursed Payouts', value: '₹38,000' },
      { label: 'Settled Claims', value: '18 Vouchers' },
    ],
  },
  {
    id: 'festivals',
    title: 'Festival Lifecycle & Duration Tracking',
    tag: 'Annual Calendar',
    description: 'Predefined festival dropdowns, single-day or multi-day durations, quotas per family, and automatic active status management.',
    icon: Sparkles,
    badgeColor: 'bg-purple-100 text-purple-800',
    highlight: 'Predefined Festivals: Durga Puja, Diwali, Holi, Rath Yatra',
    metrics: [
      { label: 'Active Festivals', value: '3 Active' },
      { label: 'Scheduled in 2026', value: '12 Total' },
      { label: 'Auto-Expiring', value: 'Enabled' },
    ],
  },
  {
    id: 'expenses',
    title: 'Vendor Expenses & Disbursal Invoices',
    tag: 'Treasury Payouts',
    description: 'Categorized vendor records for Tent, Sound & Light, Priest, Decoration, and Catering with downloadable computer-generated invoices.',
    icon: Receipt,
    badgeColor: 'bg-blue-100 text-blue-800',
    highlight: 'Official Invoices with Itemized Breakdowns',
    metrics: [
      { label: 'Categories Tracked', value: '8 Types' },
      { label: 'Master Account Direct', value: 'Supported' },
      { label: 'Invoices Generated', value: '29 Invoices' },
    ],
  },
  {
    id: 'reports',
    title: 'General Body Meeting Financial Statements',
    tag: 'Audit Ready',
    description: 'Festival-by-festival financial statements, collection percentages, and itemized expenditure reports for village sabhas.',
    icon: BarChart3,
    badgeColor: 'bg-rose-100 text-rose-800',
    highlight: 'Exportable & Printable Annual Balance Sheets',
    metrics: [
      { label: 'Surplus Analysis', value: 'Automatic' },
      { label: 'Sabha Statements', value: '1-Click PDF' },
      { label: 'Audit Trail', value: 'Immutable' },
    ],
  },
];

export default function GlimpsesSection() {
  const [selectedModule, setSelectedModule] = useState(0);
  const active = moduleScreens[selectedModule];
  const ActiveIcon = active.icon;

  return (
    <section id="glimpses" className="py-20 sm:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-100 text-primary-800 text-xs font-bold mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Interactive Module Explorer</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 mb-3">
            Explore the Platform Features
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            Click on any module below to preview live metrics and transparent workflows.
          </p>
        </div>

        {/* Interactive Module Filter Buttons */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {moduleScreens.map((item, idx) => {
            const IconC = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedModule(idx)}
                className={`py-2 px-4 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                  idx === selectedModule
                    ? 'bg-primary-600 text-white shadow-md scale-105'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                <IconC className="w-3.5 h-3.5" />
                <span>{item.tag}</span>
              </button>
            );
          })}
        </div>

        {/* Featured Live Preview Spotlight Card */}
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950 text-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-gray-800 mb-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-primary-600 flex items-center justify-center text-white shadow-md">
                <ActiveIcon className="w-6 h-6" />
              </div>
              <div>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${active.badgeColor}`}>
                  {active.tag}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                  {active.title}
                </h3>
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-300 my-5 leading-relaxed">
            {active.description}
          </p>

          {/* Metrics Preview Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {active.metrics.map((m, mIdx) => (
              <div key={mIdx} className="p-4 bg-gray-800/80 rounded-2xl border border-gray-700/60 text-center">
                <p className="text-xs text-gray-400 font-medium">{m.label}</p>
                <p className="text-xl font-black text-amber-300 mt-1">{m.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-800 flex items-center justify-between text-xs text-emerald-400 font-bold">
            <span>✓ {active.highlight}</span>
          </div>
        </div>

        {/* Grid of All Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {moduleScreens.map((item, idx) => {
            const IconComp = item.icon;
            return (
              <div
                key={idx}
                onClick={() => setSelectedModule(idx)}
                className={`cursor-pointer rounded-3xl p-6 border transition-all duration-300 flex flex-col justify-between ${
                  idx === selectedModule
                    ? 'bg-primary-50/70 border-primary-400 shadow-md ring-2 ring-primary-300'
                    : 'bg-gray-50/70 hover:bg-white border-gray-200 hover:border-primary-300 shadow-sm hover:shadow-lg'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 shadow-2xs flex items-center justify-center text-primary-600">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${item.badgeColor}`}>
                      {item.tag}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-gray-900 mb-1.5">
                    {item.title}
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed mb-4">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-200/60 flex items-center justify-between text-[11px] text-primary-700 font-bold">
                  <span>Preview Details</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
