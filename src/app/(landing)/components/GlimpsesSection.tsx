'use client';

import React from 'react';
import { 
  LayoutDashboard, 
  Sparkles, 
  CreditCard, 
  Wallet, 
  Receipt, 
  BarChart3, 
  ShieldCheck
} from 'lucide-react';

const moduleScreens = [
  {
    title: 'Financial & Community Dashboard',
    tag: 'Live Analytics',
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
  return (
    <section id="glimpses" className="py-24 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-100 text-primary-800 text-xs font-bold mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>A Complete Digital Ecosystem</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 mb-4">
            Designed for Village Trust & Accountability
          </h2>
          <p className="text-base sm:text-lg text-gray-600">
            Take a closer look at how each module works seamlessly to keep your community accounts accurate and accessible.
          </p>
        </div>

        {/* Showcase Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {moduleScreens.map((item, idx) => {
            const IconComp = item.icon;
            return (
              <div
                key={idx}
                className="bg-gray-50/70 rounded-3xl p-6 border border-gray-200 hover:border-primary-400 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
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

                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed mb-4">
                    {item.description}
                  </p>

                  {/* Highlights Mini Card */}
                  <div className="p-3 bg-white rounded-xl border border-gray-200/80 mb-4">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">LIVE METRIC PREVIEW</p>
                    <div className="grid grid-cols-3 gap-1.5 text-center">
                      {item.metrics.map((m, mIdx) => (
                        <div key={mIdx} className="p-1.5 bg-gray-50 rounded-lg">
                          <p className="text-[9px] text-gray-500 font-medium truncate">{m.label}</p>
                          <p className="text-xs font-black text-gray-900 mt-0.5">{m.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-200/60 flex items-center justify-between text-xs text-primary-700 font-semibold">
                  <span>{item.highlight}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
