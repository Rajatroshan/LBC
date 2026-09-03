import { newsService } from '../services/news.service';
import { NewsPost, NewsPostFilter, NewsReactions, NewsCategory } from '../models';
import { uploadNewsImage } from '../utils/imageCompressor';

export class NewsController {
  /**
   * Create a new announcement with optional compressed image upload
   */
  async createPost(data: {
    title: string;
    content: string;
    category: NewsCategory;
    isPinned?: boolean;
    eventDate?: Date;
    location?: string;
    authorId: string;
    authorName: string;
    authorRole: 'ADMIN' | 'USER';
    authorEmail?: string;
    imageFile?: File | null;
  }): Promise<NewsPost> {
    if (!data.title.trim()) {
      throw new Error('Announcement title is required');
    }

    if (!data.content.trim()) {
      throw new Error('Notice details / content cannot be empty');
    }

    let imageUrl: string | undefined = undefined;

    // Compress & upload image if provided
    if (data.imageFile) {
      imageUrl = await uploadNewsImage(data.imageFile, `news_${Date.now()}`);
    }

    return await newsService.create({
      title: data.title.trim(),
      content: data.content.trim(),
      category: data.category,
      isPinned: data.isPinned || false,
      eventDate: data.eventDate,
      location: data.location?.trim(),
      authorId: data.authorId,
      authorName: data.authorName,
      authorRole: data.authorRole,
      authorEmail: data.authorEmail,
      imageUrl,
    });
  }

  /**
   * Get all news posts
   */
  async getAllPosts(filter?: NewsPostFilter): Promise<NewsPost[]> {
    return await newsService.getAll(filter);
  }

  /**
   * Get single post by ID
   */
  async getPostById(id: string): Promise<NewsPost | null> {
    return await newsService.getById(id);
  }

  /**
   * Update news post
   */
  async updatePost(
    id: string,
    data: Partial<NewsPost> & { imageFile?: File | null }
  ): Promise<void> {
    let imageUrl = data.imageUrl;

    if (data.imageFile) {
      imageUrl = await uploadNewsImage(data.imageFile, id);
    }

    await newsService.update(id, {
      ...data,
      imageUrl,
    });
  }

  /**
   * Delete news post
   */
  async deletePost(id: string): Promise<void> {
    await newsService.delete(id);
  }

  /**
   * React to post with localStorage debounce protection
   */
  async reactToPost(
    postId: string,
    reactionType: keyof NewsReactions
  ): Promise<{ success: boolean; alreadyReacted: boolean }> {
    if (typeof window !== 'undefined') {
      const storageKey = `lbc_react_${postId}_${reactionType}`;
      if (localStorage.getItem(storageKey)) {
        return { success: false, alreadyReacted: true };
      }
      localStorage.setItem(storageKey, 'true');
    }

    await newsService.addReaction(postId, reactionType);
    return { success: true, alreadyReacted: false };
  }
}

export const newsController = new NewsController();

