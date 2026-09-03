'use client';

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import Navigation from '@/app/(landing)/components/Navigation';
import Footer from '@/app/(landing)/components/Footer';
import { newsController } from '@/controllers/news.controller';
import { NewsPost, NewsComment, NewsReactions } from '@/models';
import { NEWS_CATEGORY_LABELS, NEWS_CATEGORY_ICONS } from '@/constants';
import { formatDate } from '@/utils';
import { Loader } from '@/components/ui/Loader';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Pin, 
  MapPin, 
  Share2, 
  Check, 
  MessageCircle, 
  Send, 
  Calendar,
  Sparkles,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Plus
} from 'lucide-react';
import Link from 'next/link';

const REACTION_CONFIG: Array<{
  key: keyof NewsReactions;
  emoji: string;
  label: string;
  activeBg: string;
}> = [
  { key: 'heart', emoji: '❤️', label: 'Prem', activeBg: 'bg-rose-100 text-rose-900 border-rose-300' },
  { key: 'diya', emoji: '🪔', label: 'Shubh', activeBg: 'bg-orange-100 text-orange-900 border-orange-300' },
  { key: 'namaste', emoji: '🙏', label: 'Pranam', activeBg: 'bg-amber-100 text-amber-900 border-amber-300' },
  { key: 'celebration', emoji: '🎉', label: 'Badhai', activeBg: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
];

export default function SamacharFeedPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Interactions State
  const [userReactions, setUserReactions] = useState<Record<string, boolean>>({});
  const [copiedPostId, setCopiedPostId] = useState<string | null>(null);
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [postComments, setPostComments] = useState<Record<string, NewsComment[]>>({});
  const [loadingComments, setLoadingComments] = useState<Record<string, boolean>>({});
  const [expandedText, setExpandedText] = useState<Record<string, boolean>>({});
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Comment input form state per post
  const [commentName, setCommentName] = useState('');
  const [commentTexts, setCommentTexts] = useState<Record<string, string>>({});
  const [submittingComment, setSubmittingComment] = useState<Record<string, boolean>>({});

  // Double tap heart animation
  const [heartBurst, setHeartBurst] = useState<Record<string, boolean>>({});

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await newsController.getAllPosts();
      setPosts(data);
    } catch (err) {
      console.warn('[SamacharPage] Failed to fetch news:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();

    if (user?.name) {
      setCommentName(user.name);
    }

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
  }, [fetchPosts, user?.name, posts.length]);

  const handleReaction = async (postId: string, reactionType: keyof NewsReactions) => {
    const reactKey = `${postId}_${reactionType}`;
    if (userReactions[reactKey]) return;

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

  const handleDoubleTapPhoto = (postId: string) => {
    setHeartBurst((prev) => ({ ...prev, [postId]: true }));
    setTimeout(() => {
      setHeartBurst((prev) => ({ ...prev, [postId]: false }));
    }, 900);
    handleReaction(postId, 'heart');
  };

  const toggleComments = async (postId: string) => {
    const isOpen = expandedComments[postId];
    setExpandedComments((prev) => ({ ...prev, [postId]: !isOpen }));

    if (!isOpen && !postComments[postId]) {
      try {
        setLoadingComments((prev) => ({ ...prev, [postId]: true }));
        const comments = await newsController.getComments(postId);
        setPostComments((prev) => ({ ...prev, [postId]: comments }));
      } catch (err) {
        console.warn('Failed to load comments:', err);
      } finally {
        setLoadingComments((prev) => ({ ...prev, [postId]: false }));
      }
    }
  };

  const handleAddComment = async (e: React.FormEvent, postId: string) => {
    e.preventDefault();
    const text = commentTexts[postId]?.trim();
    if (!text) return;

    const author = commentName.trim() || user?.name || 'Village Resident';

    setSubmittingComment((prev) => ({ ...prev, [postId]: true }));
    try {
      const newComment = await newsController.addComment(postId, author, text);
      setPostComments((prev) => ({
        ...prev,
        [postId]: [...(prev[postId] || []), newComment],
      }));
      setCommentTexts((prev) => ({ ...prev, [postId]: '' }));

      // Update post comment count
      setPosts((prevPosts) =>
        prevPosts.map((p) =>
          p.id === postId ? { ...p, commentsCount: (p.commentsCount || 0) + 1 } : p
        )
      );
    } catch (err) {
      console.error('Failed to post comment:', err);
    } finally {
      setSubmittingComment((prev) => ({ ...prev, [postId]: false }));
    }
  };

  const handleShare = async (post: NewsPost) => {
    const shareText = `📰 *${post.title}*\n${post.content.slice(0, 160)}...\n\nRead & Discuss on LBC Gram Samachar: ${window.location.href}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: shareText,
          url: window.location.href,
        });
        return;
      } catch {
        // Fallback
      }
    }
    navigator.clipboard.writeText(shareText);
    setCopiedPostId(post.id);
    setTimeout(() => setCopiedPostId(null), 2500);
  };

  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      const matchesCategory = selectedCategory === 'ALL' || p.category === selectedCategory;
      const matchesSearch =
        !searchQuery.trim() ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.authorName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [posts, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-[#FFFDF7] flex flex-col justify-between">
      {/* Navigation Bar */}
      <Navigation />

      {/* Main Content Area */}
      <main className="pt-24 pb-16 px-4 sm:px-6 max-w-3xl mx-auto w-full space-y-6">
        
        {/* Top Page Banner */}
        <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white rounded-3xl p-6 sm:p-8 shadow-lg border-2 border-amber-300 relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white font-black text-xs uppercase tracking-wider backdrop-blur-xs">
              <span>🪔</span>
              <span>Gaon Samachar &amp; Social Feed</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Village Notice &amp; Photo Feed
            </h1>
            <p className="text-xs sm:text-sm text-amber-100 font-semibold max-w-md">
              Official puja announcements, sabha updates, photos, and community discussions in Instagram-style layout.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/news"
              className="px-4 py-2.5 rounded-2xl bg-white text-stone-900 font-black text-xs shadow-md hover:bg-amber-50 border-2 border-amber-200 flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4 text-orange-600" />
              <span>+ Publish Notice</span>
            </Link>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3.5 py-1.5 rounded-2xl text-xs font-black transition-all whitespace-nowrap border-2 shrink-0 ${
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
            return (
              <button
                key={catKey}
                onClick={() => setSelectedCategory(catKey)}
                className={`px-3.5 py-1.5 rounded-2xl text-xs font-black transition-all whitespace-nowrap flex items-center gap-1.5 border-2 shrink-0 ${
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

        {/* Feed Posts */}
        {loading ? (
          <div className="flex justify-center py-20 bg-white rounded-3xl border-2 border-amber-200">
            <Loader size="lg" />
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border-2 border-dashed border-amber-300 space-y-3">
            <p className="text-4xl">🪔</p>
            <h3 className="text-lg font-black text-stone-800">No Announcements Found</h3>
            <p className="text-xs text-stone-500 font-medium">
              Committee members can sign in to publish village notices and festival schedules.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredPosts.map((post) => {
              const icon = NEWS_CATEGORY_ICONS[post.category] || '🌾';
              const label = NEWS_CATEGORY_LABELS[post.category] || post.category;
              const isTextExpanded = expandedText[post.id];
              const isCommentsOpen = expandedComments[post.id];
              const commentsList = postComments[post.id] || [];
              const commentsTotal = post.commentsCount || commentsList.length || 0;
              const isHeartActive = heartBurst[post.id];

              const totalReactionsCount =
                (post.reactions.heart || 0) +
                (post.reactions.diya || 0) +
                (post.reactions.namaste || 0) +
                (post.reactions.celebration || 0);

              return (
                <article
                  key={post.id}
                  className={`bg-white rounded-3xl border-2 overflow-hidden transition-all shadow-sm hover:shadow-md ${
                    post.isPinned ? 'border-amber-400 bg-amber-50/10' : 'border-amber-200'
                  }`}
                >
                  {/* 1. Instagram Post Header */}
                  <div className="p-4 sm:p-5 flex items-center justify-between gap-3 border-b border-amber-100">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-200 to-orange-200 text-orange-950 font-black text-sm flex items-center justify-center border-2 border-amber-300 shrink-0">
                        {post.authorRole === 'ADMIN' ? '👑' : '👨🌾'}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-black text-stone-900 truncate">
                            {post.authorName}
                          </h4>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase border ${
                            post.authorRole === 'ADMIN' 
                              ? 'bg-orange-100 text-orange-900 border-orange-300' 
                              : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                          }`}>
                            {post.authorRole === 'ADMIN' ? 'Mandap Admin' : 'Parivar Member'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-[11px] text-stone-500 font-semibold mt-0.5">
                          {post.location ? (
                            <span className="flex items-center gap-0.5 text-amber-800">
                              <MapPin className="w-3 h-3 text-amber-700 shrink-0" />
                              <span>{post.location}</span>
                            </span>
                          ) : (
                            <span>Luhuren Village</span>
                          )}
                          <span>•</span>
                          <span>{formatDate(post.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {post.isPinned && (
                        <span className="px-2 py-0.5 rounded-full bg-orange-500 text-white text-[9px] font-black uppercase flex items-center gap-1 shadow-2xs">
                          <Pin className="w-2.5 h-2.5 fill-current" />
                          <span>Pinned</span>
                        </span>
                      )}
                      <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-950 text-[10px] font-black border border-amber-300 flex items-center gap-1">
                        <span>{icon}</span>
                        <span className="hidden sm:inline">{label}</span>
                      </span>
                    </div>
                  </div>

                  {/* 2. Instagram Photo / Media Container (with Double Tap Heart Animation) */}
                  {post.imageUrl && (
                    <div
                      onDoubleClick={() => handleDoubleTapPhoto(post.id)}
                      className="relative bg-stone-100 border-b border-amber-200 overflow-hidden cursor-pointer select-none group"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full max-h-[500px] object-cover"
                        loading="lazy"
                      />

                      {/* Double Tap Heart Burst Animation */}
                      {isHeartActive && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/10 animate-in zoom-in-50 duration-300 pointer-events-none">
                          <div className="w-24 h-24 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center shadow-2xl scale-125 transition-transform animate-bounce">
                            <span className="text-5xl">❤️</span>
                          </div>
                        </div>
                      )}

                      {/* Click to Zoom Overlay Icon */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setLightboxImage(post.imageUrl!);
                        }}
                        className="absolute bottom-3 right-3 px-2.5 py-1 rounded-xl bg-black/60 hover:bg-black/80 text-white text-[10px] font-black flex items-center gap-1 backdrop-blur-xs transition-opacity opacity-0 group-hover:opacity-100"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Full Size</span>
                      </button>
                    </div>
                  )}

                  {/* 3. Instagram Action Bar (Reactions, Comments, Share) */}
                  <div className="p-4 sm:p-5 space-y-3">
                    
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      
                      {/* Left: Emoji Reactions */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {REACTION_CONFIG.map((react) => {
                          const reactKey = `${post.id}_${react.key}`;
                          const isReacted = userReactions[reactKey];
                          const count = post.reactions[react.key] || 0;

                          return (
                            <button
                              key={react.key}
                              onClick={() => handleReaction(post.id, react.key)}
                              className={`px-3 py-1.5 rounded-2xl text-xs font-black transition-all flex items-center gap-1.5 border active:scale-90 ${
                                isReacted
                                  ? react.activeBg + ' scale-105 shadow-2xs'
                                  : 'bg-stone-50 hover:bg-amber-50 text-stone-700 border-amber-200 hover:border-amber-300'
                              }`}
                              title={`React with ${react.label}`}
                            >
                              <span className="text-base leading-none">{react.emoji}</span>
                              <span className="text-xs">{count}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Right: Comment & Share buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleComments(post.id)}
                          className="px-3 py-1.5 rounded-2xl bg-amber-50 hover:bg-amber-100 text-stone-800 text-xs font-black border border-amber-300 transition-all flex items-center gap-1.5"
                        >
                          <MessageCircle className="w-4 h-4 text-amber-800" />
                          <span>{commentsTotal}</span>
                        </button>

                        <button
                          onClick={() => handleShare(post)}
                          className="px-3 py-1.5 rounded-2xl bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs font-bold border border-amber-200 transition-all flex items-center gap-1"
                          title="Share post"
                        >
                          {copiedPostId === post.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-700 text-[11px]">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Share2 className="w-3.5 h-3.5 text-stone-500" />
                              <span className="text-[11px]">Share</span>
                            </>
                          )}
                        </button>
                      </div>

                    </div>

                    {/* Reaction Total Subtitle */}
                    {totalReactionsCount > 0 && (
                      <p className="text-xs font-bold text-stone-700 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        <span>Liked by <strong>{totalReactionsCount} village residents</strong></span>
                      </p>
                    )}

                    {/* 4. Post Content / Caption */}
                    <div className="space-y-1">
                      <h3 className="text-base font-black text-stone-900 leading-snug">
                        {post.title}
                      </h3>

                      {post.eventDate && (
                        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 bg-amber-100/70 px-2.5 py-1 rounded-xl border border-amber-300 my-1">
                          <Calendar className="w-3.5 h-3.5 text-amber-700" />
                          <span>Event Date: {formatDate(post.eventDate)}</span>
                        </div>
                      )}

                      <p className="text-xs sm:text-sm text-stone-700 font-medium leading-relaxed whitespace-pre-line">
                        {isTextExpanded || post.content.length <= 220
                          ? post.content
                          : `${post.content.slice(0, 220)}...`}
                      </p>

                      {post.content.length > 220 && (
                        <button
                          onClick={() => setExpandedText((prev) => ({ ...prev, [post.id]: !isTextExpanded }))}
                          className="text-xs font-black text-orange-600 hover:text-orange-700 flex items-center gap-0.5 mt-0.5"
                        >
                          <span>{isTextExpanded ? 'Show Less' : 'more'}</span>
                          {isTextExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>
                      )}
                    </div>

                    {/* 5. Comments Section / Drawer */}
                    <div className="pt-2 border-t border-amber-100 space-y-3">
                      
                      {/* Comments Toggle Prompt */}
                      <button
                        onClick={() => toggleComments(post.id)}
                        className="text-xs font-bold text-stone-500 hover:text-stone-800 flex items-center gap-1"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-amber-700" />
                        <span>
                          {isCommentsOpen
                            ? 'Hide discussion'
                            : commentsTotal > 0
                            ? `View all ${commentsTotal} comments`
                            : 'Be the first to comment'}
                        </span>
                      </button>

                      {/* Expandable Comments List */}
                      {isCommentsOpen && (
                        <div className="space-y-3 bg-amber-50/50 p-3.5 sm:p-4 rounded-2xl border border-amber-200 animate-in fade-in duration-200">
                          {loadingComments[post.id] ? (
                            <div className="py-4 flex justify-center">
                              <Loader size="sm" />
                            </div>
                          ) : commentsList.length === 0 ? (
                            <p className="text-xs text-stone-500 font-medium italic text-center py-2">
                              No comments yet. Write your thoughts or wishes below!
                            </p>
                          ) : (
                            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                              {commentsList.map((c) => (
                                <div key={c.id} className="bg-white p-2.5 rounded-xl border border-amber-200 text-xs space-y-0.5">
                                  <div className="flex items-center justify-between">
                                    <strong className="font-black text-stone-900">{c.authorName}</strong>
                                    <span className="text-[10px] text-stone-400">{formatDate(c.createdAt)}</span>
                                  </div>
                                  <p className="text-stone-700 font-medium whitespace-pre-line">{c.content}</p>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Add Comment Form */}
                          <form onSubmit={(e) => handleAddComment(e, post.id)} className="space-y-2 pt-2 border-t border-amber-200">
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                placeholder="Your Name"
                                value={commentName}
                                onChange={(e) => setCommentName(e.target.value)}
                                className="w-1/3 px-3 py-1.5 rounded-xl border border-amber-300 bg-white text-xs font-bold text-stone-900 focus:outline-none focus:border-amber-500 placeholder:text-stone-400"
                              />
                              <input
                                type="text"
                                placeholder="Add a village comment or wish..."
                                value={commentTexts[post.id] || ''}
                                onChange={(e) => setCommentTexts((prev) => ({ ...prev, [post.id]: e.target.value }))}
                                className="flex-1 px-3 py-1.5 rounded-xl border border-amber-300 bg-white text-xs font-medium text-stone-900 focus:outline-none focus:border-amber-500 placeholder:text-stone-400"
                                required
                              />
                              <button
                                type="submit"
                                disabled={submittingComment[post.id]}
                                className="px-3.5 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black text-xs shadow-xs flex items-center gap-1 transition-all disabled:opacity-50"
                              >
                                <Send className="w-3 h-3" />
                                <span className="hidden sm:inline">Post</span>
                              </button>
                            </div>
                          </form>

                        </div>
                      )}

                    </div>

                  </div>
                </article>
              );
            })}
          </div>
        )}

      </main>

      {/* Lightbox Image Modal */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="relative max-w-4xl max-h-[90vh] bg-white rounded-3xl p-2 border-2 border-amber-400 shadow-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={lightboxImage} alt="Expanded view" className="max-h-[80vh] w-auto rounded-2xl object-contain" />
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-4 right-4 bg-black/60 text-white rounded-full p-2 hover:bg-black text-xs font-bold"
            >
              ✕ Close
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
