'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { newsController } from '@/controllers/news.controller';
import { NewsPost } from '@/models';
import { NEWS_CATEGORY_LABELS, NEWS_CATEGORY_ICONS } from '@/constants';
import { formatDate } from '@/utils';
import { CartoonDiya } from './VillageIllustrations';
import { ArrowRight, Pin } from 'lucide-react';

export default function VillageNewsFeed() {
  const [recentPosts, setRecentPosts] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        setLoading(true);
        const posts = await newsController.getAllPosts();
        // Take top 3 most recent announcements
        setRecentPosts(posts.slice(0, 3));
      } catch (err) {
        console.warn('[VillageNewsFeed Teaser] Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLatest();
  }, []);

  return (
    <section id="gaon-samachar" className="py-10 bg-gradient-to-b from-[#FFFDF7] via-amber-50/50 to-[#FFFDF7] border-b-2 border-amber-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Sleek Compact Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white p-6 sm:p-7 rounded-3xl shadow-md border-2 border-amber-300">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white font-black text-xs uppercase tracking-wider backdrop-blur-xs">
              <CartoonDiya size={16} />
              <span>Gaon Samachar • Live Village Updates</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Latest Village Notices &amp; Puja Schedules
            </h2>
            <p className="text-xs text-amber-100 font-semibold max-w-xl">
              Stay connected with community notices, puja tithis, and developmental updates with live reactions &amp; comments.
            </p>
          </div>

          <Link
            href="/samachar"
            className="px-5 py-3 rounded-2xl bg-white hover:bg-amber-50 text-stone-900 font-black text-xs sm:text-sm shadow-md flex items-center gap-2 shrink-0 border-2 border-amber-200 transition-all hover:scale-102"
          >
            <span>📰 Open Social Feed</span>
            <ArrowRight className="w-4 h-4 text-orange-600" />
          </Link>
        </div>

        {/* 3 Quick Highlight Cards */}
        {!loading && recentPosts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentPosts.map((post) => {
              const icon = NEWS_CATEGORY_ICONS[post.category] || '🌾';
              const label = NEWS_CATEGORY_LABELS[post.category] || post.category;
              const totalReacts = (post.reactions?.heart || 0) + (post.reactions?.diya || 0) + (post.reactions?.namaste || 0) + (post.reactions?.celebration || 0);

              return (
                <Link
                  key={post.id}
                  href="/samachar"
                  className="bg-white rounded-3xl p-5 border-2 border-amber-200 hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between space-y-3 group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-950 text-[10px] font-black border border-amber-300 flex items-center gap-1">
                        <span>{icon}</span>
                        <span>{label}</span>
                      </span>

                      {post.isPinned && (
                        <span className="px-2 py-0.5 rounded-full bg-orange-500 text-white text-[9px] font-black uppercase flex items-center gap-1">
                          <Pin className="w-2.5 h-2.5 fill-current" />
                          <span>Pinned</span>
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-black text-stone-900 group-hover:text-orange-600 transition-colors line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-xs text-stone-600 font-medium line-clamp-2">
                      {post.content}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-bold text-stone-500 pt-2 border-t border-amber-100">
                    <span>{formatDate(post.createdAt)}</span>
                    <span className="text-orange-700 font-black flex items-center gap-1">
                      <span>❤️ {totalReacts}</span>
                      <span>•</span>
                      <span>💬 {post.commentsCount || 0}</span>
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}
