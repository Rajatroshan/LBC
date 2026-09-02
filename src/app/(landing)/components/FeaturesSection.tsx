'use client';

import React from 'react';
import Link from 'next/link';
import { APP_ROUTES } from '@/core/routes';
import { ArrowRight, Sparkles } from 'lucide-react';
import { CartoonDiya, CartoonMatkaGullak } from './VillageIllustrations';

const villageFeatures = [
  {
    iconEmoji: '🪔',
    badge: 'PUJA & FESTIVAL CYCLES',
    title: 'Festival Mandap & Quota Tracker',
    description: 'Set up single-day or week-long festivals (Durga Puja, Deepavali, Holi, Ratha Yatra). Automatically calculate per-family quotas and live collection targets.',
    bgColor: 'bg-amber-50/80',
    borderColor: 'border-amber-300',
    badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
    tag: 'Automated Quotas',
  },
  {
    iconEmoji: '📜',
    badge: 'CHANDA VERIFICATION',
    title: 'Dual-Layer Chanda & Signed Receipts',
    description: 'Volunteers collect chanda at village doorsteps with provisional receipts. Admins verify contributions in 1-click to credit the central treasury.',
    bgColor: 'bg-emerald-50/80',
    borderColor: 'border-emerald-300',
    badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    tag: '1-Click Verification',
  },
  {
    iconEmoji: '🏺',
    badge: 'TREASURY & GULLAK',
    title: 'Master Treasury Gullak & Invoices',
    description: 'Track tent, sound, decoration, priest, and catering costs. Instant PDF invoices with itemized totals, timestamps, and authorized signatory stamps.',
    bgColor: 'bg-orange-50/80',
    borderColor: 'border-orange-300',
    badgeBg: 'bg-orange-100 text-orange-900 border-orange-300',
    tag: 'Official Invoices',
  },
  {
    iconEmoji: '👛',
    badge: 'REIMBURSEMENTS HUB',
    title: 'Out-of-Pocket Member Reimbursements',
    description: 'Committee members paying vendor bills from personal pockets maintain individual ledgers. Request reimbursement to UPI and receive signed payout vouchers.',
    bgColor: 'bg-yellow-50/80',
    borderColor: 'border-yellow-300',
    badgeBg: 'bg-yellow-100 text-yellow-900 border-yellow-300',
    tag: 'Settlement Vouchers',
  },
  {
    iconEmoji: '🏡',
    badge: 'PARIVAR DIRECTORY',
    title: 'Village Families & Household Register',
    description: 'Maintain family head names, member count, addresses, and phone contacts. Access a lifetime history of festival contributions across every past year.',
    bgColor: 'bg-amber-50/80',
    borderColor: 'border-amber-300',
    badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
    tag: 'Complete History',
  },
  {
    iconEmoji: '📊',
    badge: 'GRAM SABHA AUDITS',
    title: 'Sabha Financial Balance Sheets',
    description: 'Generate real-time festival balance sheets comparing total collections against expenses. Ready for presentation at annual village general body meetings.',
    bgColor: 'bg-emerald-50/80',
    borderColor: 'border-emerald-300',
    badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    tag: 'Sabha Ready',
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 sm:py-28 bg-[#FFFDF7] relative overflow-hidden border-t-2 border-b-2 border-amber-200">
      
      {/* Background Decorative Earthen Accents */}
      <div className="absolute top-10 left-10 opacity-30 pointer-events-none">
        <CartoonDiya size={40} />
      </div>
      <div className="absolute bottom-10 right-10 opacity-30 pointer-events-none">
        <CartoonMatkaGullak size={44} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-black">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Designed For Village Mandap Committees &amp; Gram Sabha</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-stone-900">
            Smart Digital Tools for a{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600">
              Harmonious Village
            </span>
          </h2>
          <p className="text-sm sm:text-base text-stone-600 font-medium">
            Engineered to remove mistrust, lost paper registers, and disagreements during annual village puja audits.
          </p>
        </div>

        {/* Feature Cards Grid (Storybook Kiosks) */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto">
          {villageFeatures.map((feature, index) => (
            <div
              key={index}
              className={`${feature.bgColor} ${feature.borderColor} border-2 rounded-3xl p-6 sm:p-7 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1.5`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-white border-2 border-amber-200 flex items-center justify-center text-2xl shadow-md group-hover:scale-110 group-hover:rotate-6 transition-transform">
                    {feature.iconEmoji}
                  </div>
                  <span className={`text-[10px] font-black px-3 py-1 rounded-full border ${feature.badgeBg}`}>
                    {feature.tag}
                  </span>
                </div>

                <p className="text-[10px] font-black text-amber-800 tracking-wider uppercase mb-1">
                  {feature.badge}
                </p>
                <h3 className="text-xl font-black text-stone-900 mb-2 group-hover:text-orange-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-medium">
                  {feature.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t-2 border-dashed border-amber-200/80 flex items-center justify-between text-xs font-bold text-orange-700">
                <span>View workflow</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Festive CTA Banner */}
        <div className="mt-14 max-w-4xl mx-auto bg-gradient-to-r from-orange-600 via-amber-600 to-emerald-700 text-white rounded-3xl p-8 sm:p-10 shadow-xl border-4 border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-xl sm:text-2xl font-black">Digitize Your Village Club Chanda Today</h3>
            <p className="text-amber-100 text-xs sm:text-sm font-medium">Join 650+ village households with 100% digital receipts and zero paperwork.</p>
          </div>
          <Link href={APP_ROUTES.LOGIN}>
            <button className="px-7 py-3.5 bg-white hover:bg-amber-50 text-stone-950 rounded-2xl font-black text-sm shadow-md whitespace-nowrap transition-all transform active:scale-95 border-2 border-amber-300">
              Open Village Portal →
            </button>
          </Link>
        </div>

      </div>
    </section>
  );
}
