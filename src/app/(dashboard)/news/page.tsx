'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { newsController } from '@/controllers/news.controller';
import { NewsPost, NewsCategory } from '@/models';
import { NEWS_CATEGORY_LABELS, NEWS_CATEGORY_ICONS } from '@/constants';
import { formatDate } from '@/utils';
import { Loader } from '@/components/ui/Loader';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { 
  Plus, 
  Pin, 
  Trash2, 
  Edit3, 
  X
} from 'lucide-react';

export default function NewsManagementPage() {
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<NewsPost | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<NewsCategory>('PUJA_UPDATE');
  const [isPinned, setIsPinned] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [location, setLocation] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await newsController.getAllPosts();
      setPosts(data);
    } catch {
      toast.error('Failed to load announcements', 'Error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const openCreateModal = () => {
    setEditingPost(null);
    setTitle('');
    setContent('');
    setCategory('PUJA_UPDATE');
    setIsPinned(false);
    setIsActive(true);
    setLocation('');
    setEventDate('');
    setImageFile(null);
    setImagePreview(null);
    setModalOpen(true);
  };

  const openEditModal = (post: NewsPost) => {
    setEditingPost(post);
    setTitle(post.title);
    setContent(post.content);
    setCategory(post.category);
    setIsPinned(post.isPinned);
    setIsActive(post.isActive !== false);
    setLocation(post.location || '');
    setEventDate(post.eventDate ? post.eventDate.toISOString().split('T')[0] : '');
    setImageFile(null);
    setImagePreview(post.imageUrl || null);
    setModalOpen(true);
  };

  const handleToggleActive = async (postId: string, currentStatus: boolean) => {
    try {
      const newStatus = !currentStatus;
      await newsController.updatePost(postId, { isActive: newStatus });
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, isActive: newStatus } : p))
      );
      toast.success(
        newStatus
          ? 'Notice activated (will appear on homepage top bar)'
          : 'Notice deactivated (removed from homepage top bar)',
        'Status Updated'
      );
    } catch {
      toast.error('Failed to update status', 'Error');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.warning('Title and content are required', 'Validation');
      return;
    }

    setSubmitting(true);
    try {
      if (editingPost) {
        await newsController.updatePost(editingPost.id, {
          title: title.trim(),
          content: content.trim(),
          category,
          isPinned,
          isActive,
          location: location.trim() || undefined,
          eventDate: eventDate ? new Date(eventDate) : undefined,
          imageFile,
        });
        toast.success('Announcement updated successfully!', 'Updated');
      } else {
        await newsController.createPost({
          title: title.trim(),
          content: content.trim(),
          category,
          isPinned,
          isActive,
          location: location.trim() || undefined,
          eventDate: eventDate ? new Date(eventDate) : undefined,
          authorId: user?.id || 'admin',
          authorName: user?.name || user?.email || 'Committee Member',
          authorRole: user?.role || 'USER',
          authorEmail: user?.email,
          imageFile,
        });
        toast.success('Announcement published successfully!', 'Published');
      }

      setModalOpen(false);
      fetchPosts();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Operation failed';
      toast.error(msg, 'Failed to Save');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (postId: string, postTitle: string) => {
    if (!window.confirm(`Are you sure you want to delete "${postTitle}"?`)) return;

    try {
      await newsController.deletePost(postId);
      toast.success('Announcement deleted', 'Deleted');
      setPosts(prev => prev.filter(p => p.id !== postId));
    } catch {
      toast.error('Failed to delete announcement', 'Error');
    }
  };

  const totalReactions = posts.reduce((sum, p) => {
    return sum + (p.reactions?.namaste || 0) + (p.reactions?.diya || 0) + (p.reactions?.heart || 0) + (p.reactions?.celebration || 0);
  }, 0);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      
      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white rounded-3xl p-6 sm:p-8 shadow-lg border-2 border-amber-300 relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-white/20 text-white font-black text-xs uppercase tracking-wider backdrop-blur-xs">
              📰 Community Notice Board
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Gaon Samachar &amp; Utsav Patrika
          </h1>
          <p className="text-xs sm:text-sm text-amber-100 font-semibold max-w-xl">
            Publish official village announcements, puja schedules, meeting minutes, and development updates. Public can view and react on homepage.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="bg-white hover:bg-amber-50 text-stone-900 font-black rounded-2xl py-3 px-5 shadow-md flex items-center gap-2 shrink-0 border-2 border-amber-300 transition-all active:scale-95 cursor-pointer"
        >
          <span className="w-6 h-6 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm">
            <Plus className="w-4 h-4 stroke-[3]" />
          </span>
          <span className="text-stone-900 font-black text-sm">+ Publish New Notice</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 border-2 border-amber-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-stone-500">Total Published Notices</p>
            <p className="text-2xl font-black text-stone-900">{posts.length}</p>
          </div>
          <span className="w-10 h-10 rounded-xl bg-orange-100 text-orange-800 flex items-center justify-center font-bold text-lg">
            📰
          </span>
        </div>

        <div className="bg-white rounded-2xl p-4 border-2 border-amber-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-stone-500">Pinned Notices on Top</p>
            <p className="text-2xl font-black text-orange-600">{posts.filter(p => p.isPinned).length}</p>
          </div>
          <span className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-lg">
            📌
          </span>
        </div>

        <div className="bg-white rounded-2xl p-4 border-2 border-amber-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-stone-500">Total Public Reactions</p>
            <p className="text-2xl font-black text-emerald-600">{totalReactions}</p>
          </div>
          <span className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg">
            ❤️
          </span>
        </div>
      </div>

      {/* Posts List */}
      {loading ? (
        <div className="flex justify-center py-16 bg-white rounded-3xl border-2 border-amber-200">
          <Loader size="lg" />
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-amber-300 space-y-3">
          <p className="text-4xl">🪔</p>
          <h3 className="text-lg font-black text-stone-800">No Announcements Created Yet</h3>
          <p className="text-xs text-stone-500 font-medium max-w-md mx-auto">
            Click &ldquo;+ Publish New Notice&rdquo; to share festival dates, gram meetings, or community news.
          </p>
          <button
            type="button"
            onClick={openCreateModal}
            className="mt-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs shadow-md transition-all active:scale-95 cursor-pointer"
          >
            + Create First Notice
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => {
            const icon = NEWS_CATEGORY_ICONS[post.category] || '🌾';
            const label = NEWS_CATEGORY_LABELS[post.category] || post.category;
            const reactionSum = (post.reactions?.namaste || 0) + (post.reactions?.diya || 0) + (post.reactions?.heart || 0) + (post.reactions?.celebration || 0);

            return (
              <div
                key={post.id}
                className={`bg-white rounded-3xl p-5 sm:p-6 border-2 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs hover:shadow-md ${
                  post.isPinned ? 'border-amber-400 bg-amber-50/20' : 'border-amber-200'
                }`}
              >
                {/* Left info & image thumbnail */}
                <div className="flex items-start gap-4 min-w-0 flex-1">
                  {post.imageUrl ? (
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-amber-200 shrink-0 bg-stone-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-amber-100 border border-amber-300 text-2xl flex items-center justify-center shrink-0">
                      {icon}
                    </div>
                  )}

                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
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

                      <button
                        type="button"
                        onClick={() => handleToggleActive(post.id, post.isActive !== false)}
                        className={`px-2 py-0.5 rounded-full text-[9px] font-black border transition-all cursor-pointer ${
                          post.isActive !== false
                            ? 'bg-emerald-100 text-emerald-900 border-emerald-300 hover:bg-emerald-200'
                            : 'bg-stone-200 text-stone-700 border-stone-300 hover:bg-stone-300'
                        }`}
                        title="Click to toggle Homepage Notice Status"
                      >
                        {post.isActive !== false ? '🟢 Active on Homepage' : '⚪ Inactive (Removed)'}
                      </button>

                      <span className="text-[11px] text-stone-500 font-semibold">
                        {formatDate(post.createdAt)}
                      </span>
                    </div>

                    <h3 className="text-base font-black text-stone-900 truncate">
                      {post.title}
                    </h3>

                    <p className="text-xs text-stone-600 font-medium line-clamp-2">
                      {post.content}
                    </p>

                    <div className="flex items-center gap-3 pt-1 text-[11px] font-semibold text-stone-500">
                      <span>By: <strong className="text-stone-800">{post.authorName}</strong></span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-orange-700 font-black">
                        <span>Reactions:</span>
                        <span>🙏 {post.reactions?.namaste || 0}</span>
                        <span>🪔 {post.reactions?.diya || 0}</span>
                        <span>❤️ {post.reactions?.heart || 0}</span>
                        <span>🎉 {post.reactions?.celebration || 0}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
                  <button
                    type="button"
                    onClick={() => openEditModal(post)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border-2 border-amber-300 bg-white hover:bg-amber-50 text-stone-800 font-black text-xs transition-all shadow-2xs hover:scale-102 active:scale-95 whitespace-nowrap cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>Edit Notice</span>
                  </button>

                  {(isAdmin || post.authorId === user?.id) && (
                    <button
                      type="button"
                      onClick={() => handleDelete(post.id, post.title)}
                      className="p-2 rounded-xl border-2 border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 font-black text-xs transition-all shadow-2xs hover:scale-102 active:scale-95 cursor-pointer flex items-center justify-center"
                      title="Delete notice"
                    >
                      <Trash2 className="w-4 h-4 text-rose-600" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-[#FFFDF7] rounded-3xl border-2 border-amber-400 p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-5 relative my-8">
            
            <div className="flex items-center justify-between pb-3 border-b-2 border-amber-200">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-800 flex items-center justify-center text-xl font-bold">
                  📰
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-stone-900">
                    {editingPost ? 'Edit Notice' : 'Publish New Village Notice'}
                  </h2>
                  <p className="text-[11px] text-stone-600 font-semibold">
                    Will appear on the public homepage notice board
                  </p>
                </div>
              </div>

              <button 
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-amber-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Category Selector */}
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Notice Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as NewsCategory)}
                  className="w-full px-3.5 py-2.5 rounded-2xl border-2 border-amber-200 bg-white font-semibold text-xs text-stone-900 focus:outline-none focus:border-amber-400"
                  required
                >
                  {Object.entries(NEWS_CATEGORY_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>
                      {NEWS_CATEGORY_ICONS[k]} {v}
                    </option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Announcement Title *
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Durga Puja 2026 Mandap Pandal Setup Dates"
                  required
                  className="rounded-2xl border-2 border-amber-200 bg-white font-semibold text-xs"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Notice Details / Description *
                </label>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write complete notice information, timings, instructions for village parivars..."
                  rows={4}
                  required
                  className="rounded-2xl border-2 border-amber-200 bg-white font-semibold text-xs"
                />
              </div>

              {/* Event Date & Location (Optional) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Event Date (Optional)
                  </label>
                  <Input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="rounded-2xl border-2 border-amber-200 bg-white font-semibold text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Location / Venue (Optional)
                  </label>
                  <Input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Luhuren Mandap Grounds"
                    className="rounded-2xl border-2 border-amber-200 bg-white font-semibold text-xs"
                  />
                </div>
              </div>

              {/* Photo Upload with Free Auto-Compression */}
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Attach Photo (100% Free Auto-Compression)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full text-xs text-stone-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-amber-100 file:text-amber-950 hover:file:bg-amber-200 cursor-pointer"
                />
                <p className="text-[10px] text-emerald-700 font-bold mt-1">
                  ✨ Large camera photos are auto-compressed to ~120KB WebP for fast free storage.
                </p>

                {imagePreview && (
                  <div className="mt-2 relative w-32 h-24 rounded-2xl overflow-hidden border-2 border-amber-300 shadow-2xs">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => { setImageFile(null); setImagePreview(null); }}
                      className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 text-[10px]"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>

              {/* Active Status on Homepage Toggle */}
              <div className="p-3.5 rounded-2xl bg-amber-50/80 border-2 border-amber-300 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="text-xs font-black text-stone-900 flex items-center gap-1.5">
                    <span>{isActive ? '🟢' : '⚪'}</span>
                    <span>Homepage Notice Status: {isActive ? 'ACTIVE' : 'INACTIVE'}</span>
                  </span>
                  <p className="text-[10px] text-stone-600 font-medium">
                    {isActive 
                      ? 'Notice will display on homepage top bar (if urgent/sabha/pinned).' 
                      : 'Inactive notices are archived and removed from the homepage.'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsActive(!isActive)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black border transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-emerald-600 text-white border-emerald-700 shadow-2xs hover:bg-emerald-700'
                      : 'bg-stone-200 text-stone-700 border-stone-300 hover:bg-stone-300'
                  }`}
                >
                  {isActive ? 'Active (Live)' : 'Inactive (Turn Off)'}
                </button>
              </div>

              {/* Pin to Top Checkbox */}
              <div className="pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isPinned}
                    onChange={(e) => setIsPinned(e.target.checked)}
                    className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 border-amber-300"
                  />
                  <span className="text-xs font-black text-stone-800">
                    📌 Pin to Top (Highlighted at the top of the homepage)
                  </span>
                </label>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center gap-3 pt-3 border-t border-amber-200">
                <Button
                  type="submit"
                  isLoading={submitting}
                  disabled={submitting}
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white font-black text-xs shadow-md border border-amber-200"
                >
                  {editingPost ? 'Update Notice' : '🚀 Publish Notice Now'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setModalOpen(false)}
                  className="py-3 px-4 rounded-2xl border-2 border-amber-300 font-bold text-xs"
                >
                  Cancel
                </Button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
