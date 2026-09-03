'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { newsController } from '@/controllers/news.controller';
import { NewsPost } from '@/models';
import { NEWS_CATEGORY_ICONS } from '@/constants';
import { ArrowRight, X } from 'lucide-react';

export default function TopImportantNoticeBar() {
  const [importantNotice, setImportantNotice] = useState<NewsPost | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const loadImportantNotice = async () => {
      try {
        const posts = await newsController.getAllPosts();
        
        // ONLY match if explicitly Pinned, Emergency/Urgent Alert, or Gram Sabha Notice
        const important = posts.find(
          (p) => p.isPinned || p.category === 'EMERGENCY' || p.category === 'SABHA_NOTICE'
        );

        if (important) {
          setImportantNotice(important);
        } else {
          setImportantNotice(null);
        }
      } catch (err) {
        console.warn('[TopImportantNoticeBar] Notice fetch:', err);
      }
    };

    loadImportantNotice();
  }, []);

  // If no emergency, sabha notice, or pinned announcement exists, do NOT render anything
  if (!importantNotice || dismissed) return null;

  const icon = NEWS_CATEGORY_ICONS[importantNotice.category] || '📢';
  
  // Custom badge label based on category
  const badgeLabel = 
    importantNotice.category === 'EMERGENCY' 
      ? '🚨 Urgent Alert' 
      : importantNotice.category === 'SABHA_NOTICE'
      ? '📢 Gram Sabha Notice'
      : '📌 Mukhya Suchana';

  const isEmergency = importantNotice.category === 'EMERGENCY';

  return (
    <div className={`relative z-40 text-white border-b-2 shadow-md transition-all ${
      isEmergency 
        ? 'bg-gradient-to-r from-red-600 via-rose-600 to-red-600 border-red-300' 
        : 'bg-gradient-to-r from-orange-600 via-amber-600 to-orange-600 border-amber-300'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between gap-3 text-xs">
        
        {/* Left: Badge & Notice Title */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <span className="px-2.5 py-0.5 rounded-full bg-white/25 text-white font-black text-[10px] uppercase tracking-wider shrink-0 flex items-center gap-1 shadow-2xs backdrop-blur-2xs animate-pulse">
            <span>{icon}</span>
            <span>{badgeLabel}</span>
          </span>

          <p className="font-bold text-white truncate text-xs sm:text-sm">
            <span className="font-black">{importantNotice.title}:</span>{' '}
            <span className="text-amber-100 font-medium">{importantNotice.content}</span>
          </p>
        </div>

        {/* Right: Read More Link & Dismiss */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/samachar"
            className="px-3 py-1 rounded-xl bg-white hover:bg-amber-50 text-stone-900 font-black text-[11px] sm:text-xs shadow-xs flex items-center gap-1 transition-all hover:scale-103"
          >
            <span>Read on Samachar</span>
            <ArrowRight className="w-3 h-3 text-orange-600" />
          </Link>

          <button
            onClick={() => setDismissed(true)}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
            aria-label="Dismiss banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
}
