'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { familyService } from '@/services/family.service';
import { expenseService } from '@/services/expense.service';
import { paymentService } from '@/services/payment.service';
import { festivalService } from '@/services/festival.service';
import { Family, Expense, Festival, Payment } from '@/models';
import { formatCurrency, formatDate } from '@/utils';
import { EXPENSE_CATEGORY_LABELS, ExpenseCategory } from '@/constants';
import { Loader } from '@/components/ui/Loader';
import { MarigoldToran, CartoonDiya } from './VillageIllustrations';
import { 
  Users, 
  Receipt, 
  Sparkles, 
  Search, 
  CheckCircle2, 
  MapPin, 
  Calendar,
  Wallet,
  ShieldCheck,
  TrendingDown,
  Coins,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

const INITIAL_PAGE_SIZE = 12;

export default function PublicTransparencyHub() {
  const [families, setFamilies] = useState<Family[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'FAMILIES' | 'EXPENSES' | 'FESTIVALS'>('FAMILIES');
  
  // Search & Filters
  const [familySearch, setFamilySearch] = useState('');
  const [selectedExpenseCategory, setSelectedExpenseCategory] = useState<string>('ALL');

  // Pagination / Display Limit to protect homepage height
  const [visibleFamilyCount, setVisibleFamilyCount] = useState<number>(INITIAL_PAGE_SIZE);

  useEffect(() => {
    const fetchPublicData = async () => {
      try {
        setLoading(true);
        const [familiesData, expensesData, festivalsData, paymentsData] = await Promise.all([
          familyService.getAll().catch((err) => { console.warn('[Public Hub] Families fetch:', err); return []; }),
          expenseService.getAll().catch((err) => { console.warn('[Public Hub] Expenses fetch:', err); return []; }),
          festivalService.getAll().catch((err) => { console.warn('[Public Hub] Festivals fetch:', err); return []; }),
          paymentService.getAll().catch((err) => { console.warn('[Public Hub] Payments fetch:', err); return []; }),
        ]);

        const validFamilies = familiesData.filter(f => f.isActive !== false);
        setFamilies(validFamilies.length > 0 ? validFamilies : familiesData);
        setExpenses(expensesData.filter(e => e.approvalStatus === 'APPROVED' || !e.approvalStatus));
        setFestivals(festivalsData);
        setPayments(paymentsData.filter(p => p.status === 'PAID' || !p.status));
      } catch (err) {
        console.error('Failed to load public transparency data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicData();
  }, []);

  // Financial Computations
  const totalCollections = useMemo(() => {
    return payments.reduce((sum, p) => sum + (p.amount || 0), 0);
  }, [payments]);

  const totalExpenses = useMemo(() => {
    return expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  }, [expenses]);

  const netBalance = totalCollections - totalExpenses;

  // Filtered families
  const filteredFamilies = useMemo(() => {
    if (!familySearch.trim()) return families;
    const query = familySearch.toLowerCase();
    return families.filter(f => 
      f.headName.toLowerCase().includes(query) ||
      (f.address && f.address.toLowerCase().includes(query)) ||
      (f.phone && f.phone.includes(query))
    );
  }, [families, familySearch]);

  // Sliced families for view
  const displayedFamilies = useMemo(() => {
    if (familySearch.trim()) return filteredFamilies;
    return filteredFamilies.slice(0, visibleFamilyCount);
  }, [filteredFamilies, familySearch, visibleFamilyCount]);

  // Filtered expenses
  const filteredExpenses = useMemo(() => {
    if (selectedExpenseCategory === 'ALL') return expenses;
    return expenses.filter(e => e.category === selectedExpenseCategory);
  }, [expenses, selectedExpenseCategory]);

  return (
    <section id="khula-hisab" className="py-14 sm:py-20 bg-[#FFFDF7] relative overflow-hidden border-b-2 border-amber-200">
      
      {/* Background Decorative Earthen Accents */}
      <div className="absolute top-0 inset-x-0 pointer-events-none">
        <MarigoldToran className="opacity-90" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative pt-4 space-y-8">
        
        {/* Section Header */}
        <div className="text-center space-y-2.5 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 border border-amber-300 shadow-2xs">
            <CartoonDiya size={18} />
            <span className="text-xs sm:text-sm font-black text-amber-950 uppercase tracking-wide">
              100% Khula Hisab • Public Transparency Portal
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-stone-900 tracking-tight">
            Gaon Ka Khula Bahi-Khata &amp; Parivar Directory
          </h2>
          
          <p className="text-xs sm:text-sm text-stone-600 font-semibold leading-relaxed">
            Every single rupee collected from village households and every vendor expense bill is permanently open for public review. Real-time community accounting with 100% honesty.
          </p>
        </div>

        {/* 1. Live Treasury Matka Gullak Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {/* Card 1: Total Collections */}
          <div className="bg-white rounded-3xl p-5 border-2 border-emerald-300 shadow-sm hover:shadow-md transition-all space-y-1.5 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase text-emerald-800 tracking-wider flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5 text-emerald-600" />
                <span>Total Chanda Sangrah</span>
              </span>
              <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                📈
              </span>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-stone-900">
              {loading ? '...' : formatCurrency(totalCollections)}
            </p>
            <p className="text-[11px] text-stone-500 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>{payments.length} Verified Receipts Logged</span>
            </p>
          </div>

          {/* Card 2: Total Expenses */}
          <div className="bg-white rounded-3xl p-5 border-2 border-orange-300 shadow-sm hover:shadow-md transition-all space-y-1.5 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase text-orange-800 tracking-wider flex items-center gap-1.5">
                <Receipt className="w-3.5 h-3.5 text-orange-600" />
                <span>Total Kharcha Expended</span>
              </span>
              <span className="w-8 h-8 rounded-xl bg-orange-100 text-orange-800 flex items-center justify-center font-bold text-sm">
                🏺
              </span>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-stone-900">
              {loading ? '...' : formatCurrency(totalExpenses)}
            </p>
            <p className="text-[11px] text-stone-500 font-semibold flex items-center gap-1">
              <TrendingDown className="w-3.5 h-3.5 text-orange-600" />
              <span>{expenses.length} Verified Mandap Bills Logged</span>
            </p>
          </div>

          {/* Card 3: Mandap Gullak Balance */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-100/70 rounded-3xl p-5 border-2 border-amber-400 shadow-sm hover:shadow-md transition-all space-y-1.5 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase text-amber-900 tracking-wider flex items-center gap-1.5">
                <Wallet className="w-3.5 h-3.5 text-amber-700" />
                <span>Mandap Gullak Balance</span>
              </span>
              <span className="w-8 h-8 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center font-bold text-sm">
                💰
              </span>
            </div>
            <p className={`text-2xl sm:text-3xl font-black ${netBalance >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
              {loading ? '...' : formatCurrency(netBalance)}
            </p>
            <p className="text-[11px] text-amber-950 font-bold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-amber-700" />
              <span>{netBalance >= 0 ? 'Surplus Reserve Available' : 'Deficit Outstanding'}</span>
            </p>
          </div>

        </div>

        {/* 2. Interactive Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => setActiveTab('FAMILIES')}
            className={`px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm transition-all flex items-center gap-2 border-2 ${
              activeTab === 'FAMILIES'
                ? 'bg-orange-600 text-white border-orange-700 shadow-sm scale-102'
                : 'bg-white text-stone-700 border-amber-200 hover:bg-amber-50 shadow-2xs'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>🏡 Gram Parivar Directory ({families.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('EXPENSES')}
            className={`px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm transition-all flex items-center gap-2 border-2 ${
              activeTab === 'EXPENSES'
                ? 'bg-orange-600 text-white border-orange-700 shadow-sm scale-102'
                : 'bg-white text-stone-700 border-amber-200 hover:bg-amber-50 shadow-2xs'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>🏺 Kharcha Bahi-Khata ({expenses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('FESTIVALS')}
            className={`px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm transition-all flex items-center gap-2 border-2 ${
              activeTab === 'FESTIVALS'
                ? 'bg-orange-600 text-white border-orange-700 shadow-sm scale-102'
                : 'bg-white text-stone-700 border-amber-200 hover:bg-amber-50 shadow-2xs'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>🪔 Utsav &amp; Mandap Quotas ({festivals.length})</span>
          </button>
        </div>

        {/* 3. Tab Content Area with Fixed Max-Height & Scroll Controls */}
        {loading ? (
          <div className="flex justify-center py-16 bg-white rounded-3xl border-2 border-amber-200 shadow-sm">
            <Loader size="lg" />
          </div>
        ) : (
          <div className="bg-white/80 rounded-3xl p-4 sm:p-6 border-2 border-amber-300 shadow-sm backdrop-blur-xs">
            
            {/* TAB 1: GRAM PARIVAR DIRECTORY */}
            {activeTab === 'FAMILIES' && (
              <div className="space-y-4">
                
                {/* Search Bar & Counter Header */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-amber-700 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Search household by Mukhia name, ward, or phone..."
                      value={familySearch}
                      onChange={(e) => setFamilySearch(e.target.value)}
                      className="w-full pl-10 pr-16 py-2.5 bg-white rounded-2xl border-2 border-amber-200 text-xs font-semibold text-stone-900 focus:outline-none focus:border-amber-400 placeholder:text-stone-400"
                    />
                    {familySearch && (
                      <button 
                        onClick={() => setFamilySearch('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded-lg bg-stone-100 text-stone-600 hover:bg-stone-200 text-[10px] font-bold"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-2 text-xs font-bold text-stone-600 shrink-0">
                    <span className="px-3 py-1.5 rounded-xl bg-amber-100 text-amber-950 font-black text-[11px] border border-amber-300">
                      Showing {displayedFamilies.length} of {filteredFamilies.length} Parivars
                    </span>
                  </div>
                </div>

                {/* Family Cards Grid in a Controlled Scroll Container */}
                {filteredFamilies.length === 0 ? (
                  <div className="p-10 text-center bg-white rounded-2xl border-2 border-dashed border-amber-300 space-y-1.5">
                    <p className="text-2xl">🏡</p>
                    <p className="text-sm font-bold text-stone-800">No village parivar found</p>
                    <p className="text-xs text-stone-500">
                      {families.length === 0 
                        ? "Ensure Firestore public read rules are published in Firebase Console." 
                        : "Try searching with a different head name or ward."}
                    </p>
                  </div>
                ) : (
                  <div>
                    {/* Fixed Height Scroll Window */}
                    <div className="max-h-[500px] overflow-y-auto pr-1.5 space-y-3 divide-y divide-amber-100 scrollbar-thin scrollbar-thumb-amber-300 scrollbar-track-amber-50">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                        {displayedFamilies.map((family) => (
                          <div
                            key={family.id}
                            className="bg-white rounded-2xl p-4 border border-amber-200 hover:border-amber-400 hover:shadow-md transition-all space-y-2.5 relative overflow-hidden"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 text-orange-950 font-black text-xs flex items-center justify-center border border-amber-300 shrink-0">
                                  👨🌾
                                </div>
                                <div className="min-w-0">
                                  <h4 className="text-sm font-black text-stone-900 truncate">
                                    {family.headName}
                                  </h4>
                                  <p className="text-[11px] text-amber-800 font-semibold flex items-center gap-1 mt-0.5">
                                    <Users className="w-3 h-3 shrink-0 text-amber-700" />
                                    <span>{family.members} Family Members</span>
                                  </p>
                                </div>
                              </div>

                              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-[9px] font-black uppercase shrink-0">
                                Active
                              </span>
                            </div>

                            {family.address && (
                              <p className="text-[11px] text-stone-600 font-medium flex items-start gap-1 pt-1 border-t border-amber-100">
                                <MapPin className="w-3 h-3 text-stone-400 shrink-0 mt-0.5" />
                                <span className="truncate">{family.address}</span>
                              </p>
                            )}

                            <div className="flex items-center justify-between text-[10px] font-bold text-stone-500 pt-1 border-t border-amber-100">
                              <span>Verified Parivar</span>
                              <span className="text-emerald-700 font-black">✓ 100% Recorded</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Show More / Load All Controls */}
                    {!familySearch && visibleFamilyCount < filteredFamilies.length && (
                      <div className="pt-4 flex flex-wrap items-center justify-center gap-3 border-t border-amber-200 mt-3">
                        <button
                          onClick={() => setVisibleFamilyCount(prev => prev + 12)}
                          className="px-5 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 text-xs font-black border border-amber-300 shadow-2xs transition-all flex items-center gap-1.5"
                        >
                          <ChevronDown className="w-4 h-4" />
                          <span>Load More Parivars (+12)</span>
                        </button>

                        <button
                          onClick={() => setVisibleFamilyCount(filteredFamilies.length)}
                          className="px-4 py-2 rounded-xl bg-white hover:bg-amber-50 text-stone-700 text-xs font-bold border border-amber-200 transition-all"
                        >
                          View All ({filteredFamilies.length}) in Scroll Box
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: KHARCHA BAHI-KHATA (EXPENSES) */}
            {activeTab === 'EXPENSES' && (
              <div className="space-y-4">
                
                {/* Category Filter Chips & Counter Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      onClick={() => setSelectedExpenseCategory('ALL')}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-all border ${
                        selectedExpenseCategory === 'ALL'
                          ? 'bg-stone-900 text-white border-stone-900 shadow-2xs'
                          : 'bg-white text-stone-700 border-amber-200 hover:bg-amber-50'
                      }`}
                    >
                      All ({expenses.length})
                    </button>

                    {Object.entries(EXPENSE_CATEGORY_LABELS).map(([catKey, catLabel]) => {
                      const count = expenses.filter(e => e.category === catKey).length;
                      if (count === 0) return null;
                      return (
                        <button
                          key={catKey}
                          onClick={() => setSelectedExpenseCategory(catKey)}
                          className={`px-3 py-1 rounded-xl text-xs font-bold transition-all border ${
                            selectedExpenseCategory === catKey
                              ? 'bg-orange-600 text-white border-orange-700 shadow-2xs'
                              : 'bg-white text-stone-700 border-amber-200 hover:bg-amber-50'
                          }`}
                        >
                          {catLabel} ({count})
                        </button>
                      );
                    })}
                  </div>

                  <span className="px-3 py-1 rounded-xl bg-amber-100 text-amber-950 font-black text-[11px] border border-amber-300 shrink-0 self-start sm:self-auto">
                    {filteredExpenses.length} Verified Expenses
                  </span>
                </div>

                {/* Expenses Table with Sticky Header & Controlled Scroll Height */}
                {filteredExpenses.length === 0 ? (
                  <div className="p-10 text-center bg-white rounded-2xl border-2 border-dashed border-amber-300">
                    <p className="text-xs text-stone-500 font-semibold">No expenses recorded under this category.</p>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border-2 border-amber-200 shadow-xs overflow-hidden">
                    <div className="max-h-[460px] overflow-y-auto scrollbar-thin scrollbar-thumb-amber-300 scrollbar-track-amber-50">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-amber-100 border-b-2 border-amber-200 text-amber-950 font-black uppercase text-[10px] sticky top-0 z-10 shadow-2xs">
                          <tr>
                            <th className="py-3 px-4">Date</th>
                            <th className="py-3 px-4">Purpose / Item</th>
                            <th className="py-3 px-4">Category</th>
                            <th className="py-3 px-4">Paid To (Vendor)</th>
                            <th className="py-3 px-4 text-right">Amount (₹)</th>
                            <th className="py-3 px-4 text-center">Audit Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-amber-100 font-semibold text-stone-800">
                          {filteredExpenses.map((expense) => (
                            <tr key={expense.id} className="hover:bg-amber-50/60 transition-colors">
                              <td className="py-3 px-4 text-stone-500 font-medium whitespace-nowrap">
                                {formatDate(expense.expenseDate)}
                              </td>
                              <td className="py-3 px-4 font-black text-stone-900">
                                {expense.purpose}
                              </td>
                              <td className="py-3 px-4 whitespace-nowrap">
                                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold border border-amber-300">
                                  {EXPENSE_CATEGORY_LABELS[expense.category as ExpenseCategory] || expense.category}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-stone-600">
                                {expense.paidTo || 'Village Vendor'}
                              </td>
                              <td className="py-3 px-4 font-black text-stone-900 text-right text-xs sm:text-sm whitespace-nowrap">
                                {formatCurrency(expense.amount)}
                              </td>
                              <td className="py-3 px-4 text-center whitespace-nowrap">
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                  <span>Verified</span>
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: UTSAVS & MANDAP QUOTAS */}
            {activeTab === 'FESTIVALS' && (
              <div className="max-h-[480px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-amber-300 scrollbar-track-amber-50">
                {festivals.length === 0 ? (
                  <div className="p-10 text-center bg-white rounded-2xl border-2 border-dashed border-amber-300">
                    <p className="text-xs text-stone-500 font-semibold">No festivals scheduled at the moment.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {festivals.map((fest) => (
                      <div
                        key={fest.id}
                        className="bg-white rounded-2xl p-5 border-2 border-amber-300 shadow-xs hover:shadow-md transition-all space-y-3 relative overflow-hidden"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 text-white flex items-center justify-center text-xl shadow-xs border border-amber-200 shrink-0">
                              🪔
                            </div>
                            <div>
                              <h4 className="text-sm font-black text-stone-900">{fest.name}</h4>
                              <p className="text-[11px] text-stone-500 font-semibold flex items-center gap-1 mt-0.5">
                                <Calendar className="w-3 h-3 text-amber-700" />
                                <span>{formatDate(fest.date)}</span>
                              </p>
                            </div>
                          </div>

                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase border ${
                            fest.isActive 
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                              : 'bg-stone-100 text-stone-700 border-stone-300'
                          }`}>
                            {fest.isActive ? 'Active' : 'Past'}
                          </span>
                        </div>

                        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs space-y-1">
                          <div className="flex justify-between items-center font-bold text-[11px]">
                            <span className="text-stone-600">Assessed Quota / Target:</span>
                            <span className="text-stone-900 font-black text-xs">
                              {formatCurrency(fest.amountPerFamily)} / Parivar
                            </span>
                          </div>
                          {fest.description && (
                            <p className="text-[10px] text-stone-600 font-medium pt-1 border-t border-amber-200">
                              {fest.description}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center justify-between text-[11px] font-bold text-stone-600 pt-1">
                          <span>Status</span>
                          <span className="text-emerald-700 font-black flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>100% Khula Hisab</span>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        )}

        {/* 4. Bottom Gaon Ekta Guarantee Banner */}
        <div className="bg-gradient-to-r from-stone-900 via-stone-950 to-stone-900 text-white p-5 sm:p-6 rounded-3xl border-2 border-amber-400 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-stone-950 font-black text-[9px] uppercase tracking-wider">
              🌾 Gaon Ekta Sandesh
            </span>
            <h3 className="text-base sm:text-lg font-black text-white">
              &ldquo;Har ek rupaye ka hisab, pure gaon ke samne.&rdquo;
            </h3>
            <p className="text-[11px] text-stone-300 font-medium max-w-xl">
              Public residents can transparently inspect all collections and expenditures anytime. Financial records are audited and verified during official Gram Sabha meetings.
            </p>
          </div>

          <a 
            href="/auth/login"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-700 text-white font-black text-xs shadow-md flex items-center gap-1.5 border border-amber-200 shrink-0 transition-all hover:scale-102"
          >
            <span>Member &amp; Admin Login</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>
    </section>
  );
}
