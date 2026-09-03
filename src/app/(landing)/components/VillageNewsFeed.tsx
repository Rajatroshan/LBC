'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { newsController } from '@/controllers/news.controller';
import { NewsPost, NewsReactions } from '@/models';
import { NEWS_CATEGORY_LABELS, NEWS_CATEGORY_ICONS } from '@/constants';
import { formatDate } from '@/utils';
import { Loader } from '@/components/ui/Loader';
import { CartoonDiya } from './VillageIllustrations';
import { 
  Pin, 
  Calendar, 
  MapPin, 
  User, 
  Share2, 
  Check, 
  ExternalLink
} from 'lucide-react';

const REACTION_CONFIG: Array<{
  key: keyof NewsReactions;
  emoji: string;
  label: string;
  activeBg: string;
}> = [
  { key: 'namaste', emoji: '🙏', label: 'Pranam', activeBg: 'bg-amber-100 text-amber-900 border-amber-300' },
  { key: 'diya', emoji: '🪔', label: 'Shubh', activeBg: 'bg-orange-100 text-orange-900 border-orange-300' },
  { key: 'heart', emoji: '❤️', label: 'Dhanyawad', activeBg: 'bg-rose-100 text-rose-900 border-rose-300' },
  { key: 'celebration', emoji: '🎉', label: 'Badhai', activeBg: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
];

export default function VillageNewsFeed() {
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const [copiedPostId, setCopiedPostId] = useState<string | null>(null);
  const [userReactions, setUserReactions] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const data = await newsController.getAllPosts();
        setPosts(data);
      } catch (err) {
        console.warn('[VillageNewsFeed] Failed to fetch news:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();

    // Load saved reactions from localStorage
    if (typeof window !== 'undefined') {
      const saved: Record<string, boolean> = {};
      posts.forEach((p) => {
        REACTION_CONFIG.forEach((r) => {
          if (localStorage.getItem(`lbc_react_${p.id}_${r.key}`)) {
            saved[`${p.id}_${r.key}`] = true;
          }
        });
      });
      setUserReactions(saved);
    }
  }, []);

  const handleReaction = async (postId: string, reactionType: keyof NewsReactions) => {
    const reactKey = `${postId}_${reactionType}`;
    if (userReactions[reactKey]) return; // Already reacted

    // Optimistic UI update
    setUserReactions((prev) => ({ ...prev, [reactKey]: true }));
    setPosts((prevPosts) =>
      prevPosts.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            reactions: {
              ...p.reactions,
              [reactionType]: (p.reactions[reactionType] || 0) + 1,
            },
          };
        }
        return p;
      })
    );

    try {
      await newsController.reactToPost(postId, reactionType);
    } catch (err) {
      console.error('Failed to register reaction:', err);
    }
  };

  const handleShare = async (post: NewsPost) => {
    const shareText = `📰 *${post.title}*\n${post.content.slice(0, 150)}...\n\nRead more on LBC Mandap: ${window.location.origin}/#gaon-samachar`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: shareText,
          url: `${window.location.origin}/#gaon-samachar`,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }
    navigator.clipboard.writeText(shareText);
    setCopiedPostId(post.id);
    setTimeout(() => setCopiedPostId(null), 2500);
  };

  const filteredPosts = useMemo(() => {
    if (selectedCategory === 'ALL') return posts;
    return posts.filter((p) => p.category === selectedCategory);
  }, [posts, selectedCategory]);

  return (
    <section id="gaon-samachar" className="py-14 sm:py-20 bg-gradient-to-b from-[#FFFDF7] via-amber-50/40 to-[#FFFDF7] relative overflow-hidden border-b-2 border-amber-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative space-y-8">
        
        {/* Section Header */}
        <div className="text-center space-y-2.5 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 border border-orange-300 shadow-2xs">
            <CartoonDiya size={18} />
            <span className="text-xs sm:text-sm font-black text-orange-950 uppercase tracking-wide">
              📰 Gaon Samachar • Village Notice Board
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-stone-900 tracking-tight">
            Utsav Announcements &amp; Sabha Suchana
          </h2>
          
          <p className="text-xs sm:text-sm text-stone-600 font-semibold leading-relaxed">
            Stay updated with official Gram Sabha notices, upcoming puja tithi, development projects, and cultural programs. Free open notices for all village residents.
          </p>
        </div>

        {/* Category Filter Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3.5 py-1.5 rounded-2xl text-xs font-black transition-all border-2 ${
              selectedCategory === 'ALL'
                ? 'bg-stone-900 text-white border-stone-900 shadow-xs scale-102'
                : 'bg-white text-stone-700 border-amber-200 hover:bg-amber-50'
            }`}
          >
            All Notices ({posts.length})
          </button>

          {Object.entries(NEWS_CATEGORY_LABELS).map(([catKey, catLabel]) => {
            const count = posts.filter((p) => p.category === catKey).length;
            const icon = NEWS_CATEGORY_ICONS[catKey] || '🌾';
            if (count === 0 && posts.length > 0) return null;
            return (
              <button
                key={catKey}
                onClick={() => setSelectedCategory(catKey)}
                className={`px-3.5 py-1.5 rounded-2xl text-xs font-black transition-all flex items-center gap-1.5 border-2 ${
                  selectedCategory === catKey
                    ? 'bg-orange-600 text-white border-orange-700 shadow-xs scale-102'
                    : 'bg-white text-stone-700 border-amber-200 hover:bg-amber-50'
                }`}
              >
                <span>{icon}</span>
                <span>{catLabel} {count > 0 ? `(${count})` : ''}</span>
              </button>
            );
          })}
        </div>

        {/* News Feed Content Area */}
        {loading ? (
          <div className="flex justify-center py-16 bg-white rounded-3xl border-2 border-amber-200 shadow-sm">
            <Loader size="lg" />
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border-2 border-dashed border-amber-300 space-y-2 max-w-xl mx-auto">
            <p className="text-3xl">🪔</p>
            <h4 className="text-base font-bold text-stone-800">No Announcements Published Yet</h4>
            <p className="text-xs text-stone-500 font-medium">
              Committee members and admins can sign in to publish village notices and festival schedules.
            </p>
          </div>
        ) : (
          <div className="max-h-[640px] overflow-y-auto pr-2 space-y-5 scrollbar-thin scrollbar-thumb-amber-300 scrollbar-track-amber-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredPosts.map((post) => {
                const categoryIcon = NEWS_CATEGORY_ICONS[post.category] || '🌾';
                const categoryLabel = NEWS_CATEGORY_LABELS[post.category] || post.category;

                return (
                  <article
                    key={post.id}
                    className={`bg-white rounded-3xl p-5 sm:p-6 border-2 transition-all flex flex-col justify-between space-y-4 relative overflow-hidden ${
                      post.isPinned
                        ? 'border-amber-400 bg-gradient-to-b from-amber-50/50 via-white to-white shadow-md'
                        : 'border-amber-200 hover:border-amber-300 shadow-xs hover:shadow-md'
                    }`}
                  >
                    {/* Top Badges */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-950 text-[11px] font-black border border-amber-300 flex items-center gap-1 shadow-2xs">
                            <span>{categoryIcon}</span>
                            <span>{categoryLabel}</span>
                          </span>

                          {post.isPinned && (
                            <span className="px-2.5 py-0.5 rounded-full bg-orange-500 text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-2xs">
                              <Pin className="w-3 h-3 fill-current" />
                              <span>Pinned</span>
                            </span>
                          )}
                        </div>

                        <span className="text-[11px] text-stone-500 font-semibold flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-stone-400" />
                          <span>{formatDate(post.createdAt)}</span>
                        </span>
                      </div>

                      {/* Post Title */}
                      <h3 className="text-base sm:text-lg font-black text-stone-900 leading-snug">
                        {post.title}
                      </h3>

                      {/* Optional Event Metadata (Location, Date) */}
                      {(post.location || post.eventDate) && (
                        <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-amber-900 bg-amber-50/80 p-2.5 rounded-2xl border border-amber-200">
                          {post.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                              <span>{post.location}</span>
                            </span>
                          )}
                          {post.eventDate && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                              <span>Event Date: {formatDate(post.eventDate)}</span>
                            </span>
                          )}
                        </div>
                      )}

                      {/* Post Content */}
                      <p className="text-xs sm:text-sm text-stone-700 font-medium leading-relaxed whitespace-pre-line">
                        {post.content}
                      </p>

                      {/* Attached Compressed Image Preview */}
                      {post.imageUrl && (
                        <div 
                          onClick={() => setExpandedImage(post.imageUrl!)}
                          className="rounded-2xl overflow-hidden border-2 border-amber-200 max-h-64 cursor-pointer group relative bg-stone-100 shadow-2xs"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={post.imageUrl}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-black gap-1.5 backdrop-blur-2xs">
                            <ExternalLink className="w-4 h-4" />
                            <span>Click to Zoom</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Bottom Reaction & Author Bar */}
                    <div className="pt-3 border-t border-amber-100 space-y-3">
                      
                      {/* Author Line */}
                      <div className="flex items-center justify-between text-[11px] font-semibold text-stone-500">
                        <span className="flex items-center gap-1.5 truncate">
                          <User className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                          <span className="truncate">
                            Posted by <strong className="text-stone-800">{post.authorName}</strong> ({post.authorRole === 'ADMIN' ? 'Mandap Admin' : 'Member'})
                          </span>
                        </span>

                        <button
                          onClick={() => handleShare(post)}
                          className="px-2.5 py-1 rounded-xl bg-amber-50 hover:bg-amber-100 text-stone-700 text-xs font-bold border border-amber-200 transition-all flex items-center gap-1 shrink-0"
                          title="Share notice"
                        >
                          {copiedPostId === post.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-700 text-[10px]">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Share2 className="w-3 h-3 text-stone-500" />
                              <span className="text-[10px]">Share</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Interactive Public Emoji Reactions */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {REACTION_CONFIG.map((react) => {
                          const reactKey = `${post.id}_${react.key}`;
                          const isReacted = userReactions[reactKey];
                          const count = post.reactions[react.key] || 0;

                          return (
                            <button
                              key={react.key}
                              onClick={() => handleReaction(post.id, react.key)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 border ${
                                isReacted
                                  ? react.activeBg + ' scale-105 shadow-2xs'
                                  : 'bg-stone-50 hover:bg-amber-50 text-stone-700 border-amber-200 hover:border-amber-300'
                              }`}
                              title={`React with ${react.label}`}
                            >
                              <span className="text-sm leading-none">{react.emoji}</span>
                              <span className="text-[11px]">{count}</span>
                            </button>
                          );
                        })}
                      </div>

                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* Image Lightbox Modal */}
      {expandedImage && (
        <div 
          onClick={() => setExpandedImage(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div className="relative max-w-4xl max-h-[90vh] bg-white rounded-3xl p-2 border-2 border-amber-400 overflow-hidden shadow-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={expandedImage} 
              alt="Expanded announcement view" 
              className="max-h-[80vh] w-auto rounded-2xl object-contain"
            />
            <button
              onClick={() => setExpandedImage(null)}
              className="absolute top-4 right-4 bg-black/60 text-white rounded-full p-2 hover:bg-black text-xs font-bold"
            >
              ✕ Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
