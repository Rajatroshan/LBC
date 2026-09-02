'use client';

import React from 'react';
import { ShieldCheck, Users, CheckCircle2, HeartHandshake, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { APP_ROUTES } from '@/core/routes';

export default function WhoIsThisForSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-100 text-primary-800 text-xs font-bold mb-3">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>Built for Everyone in the Village</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 mb-4">
            Tailored for Committee Leaders & Community Families
          </h2>
          <p className="text-base sm:text-lg text-gray-600">
            Dedicated tools for festival organizers to manage funds and easy access for villagers to view verified receipts.
          </p>
        </div>

        {/* 2 Roles Showcase */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Card 1: For Committee Admins & Treasurers */}
          <div className="bg-white rounded-3xl p-8 border border-emerald-200/80 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center shadow-lg">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
                  Admins & Treasurers
                </span>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Pooja Committees & Club Leaders
              </h3>
              <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                Take full control of collections, vendor bills, and annual Sabha reports without spreadsheet stress.
              </p>

              <ul className="space-y-3.5 text-sm text-gray-700">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>1-Click Payment Verification to credit the central treasury live</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Review and settle member out-of-pocket reimbursements with UPI tracking</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Record vendor expenses (tent, light, sound, food) & issue invoices</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Export instant PDF balance sheets ready for village meetings</span>
                </li>
              </ul>
            </div>

            <div className="pt-6 mt-6 border-t border-gray-100">
              <Link href={APP_ROUTES.LOGIN}>
                <button className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-2">
                  Admin Sign In <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>

          {/* Card 2: For Community Members & Families */}
          <div className="bg-white rounded-3xl p-8 border border-amber-200/80 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-lg">
                  <Users className="w-7 h-7" />
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-800">
                  Villagers & Families
                </span>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Community Members & Donors
              </h3>
              <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                Enjoy 100% visibility into your contributions, instant signed PDF receipts, and simple reimbursement claims.
              </p>

              <ul className="space-y-3.5 text-sm text-gray-700">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <span>Record chanda payments and download instant provisional slips</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <span>Receive verified, signed PDF receipts as soon as Admin confirms</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <span>Log out-of-pocket festival expenses and claim money back easily</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <span>View upcoming festival dates, quotas, and family contribution history</span>
                </li>
              </ul>
            </div>

            <div className="pt-6 mt-6 border-t border-gray-100">
              <Link href={APP_ROUTES.LOGIN}>
                <button className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-gray-950 font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-2">
                  Member Sign In <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
