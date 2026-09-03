import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  Timestamp, 
  QueryConstraint,
  increment,
  DocumentSnapshot
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { NewsPost, NewsPostFilter, NewsReactions } from '../models';
import { COLLECTIONS } from '@/constants';

export class NewsService {
  private collectionRef = collection(db, COLLECTIONS.NEWS_POSTS);

  private toEntity(docSnap: DocumentSnapshot): NewsPost {
    const data = docSnap.data();
    if (!data) throw new Error('Document does not exist');

    return {
      id: docSnap.id,
      title: data.title || '',
      content: data.content || '',
      category: data.category || 'GENERAL',
      imageUrl: data.imageUrl || undefined,
      imageThumbnailUrl: data.imageThumbnailUrl || undefined,
      isPinned: data.isPinned || false,
      eventDate: data.eventDate ? (data.eventDate as Timestamp).toDate() : undefined,
      location: data.location || undefined,
      authorId: data.authorId || '',
      authorName: data.authorName || 'Village Member',
      authorRole: data.authorRole || 'USER',
      authorEmail: data.authorEmail || undefined,
      reactions: {
        namaste: data.reactions?.namaste || 0,
        diya: data.reactions?.diya || 0,
        heart: data.reactions?.heart || 0,
        celebration: data.reactions?.celebration || 0,
      },
      viewsCount: data.viewsCount || 0,
      createdAt: data.createdAt ? (data.createdAt as Timestamp).toDate() : new Date(),
      updatedAt: data.updatedAt ? (data.updatedAt as Timestamp).toDate() : new Date(),
    };
  }

  /**
   * Create a new village announcement / news post
   */
  async create(data: Omit<NewsPost, 'id' | 'createdAt' | 'updatedAt' | 'reactions' | 'viewsCount'>): Promise<NewsPost> {
    const now = Timestamp.now();
    const docData: Record<string, unknown> = {
      title: data.title,
      content: data.content,
      category: data.category,
      isPinned: data.isPinned || false,
      authorId: data.authorId,
      authorName: data.authorName,
      authorRole: data.authorRole,
      reactions: {
        namaste: 0,
        diya: 0,
        heart: 0,
        celebration: 0,
      },
      viewsCount: 0,
      createdAt: now,
      updatedAt: now,
    };

    if (data.imageUrl) docData.imageUrl = data.imageUrl;
    if (data.imageThumbnailUrl) docData.imageThumbnailUrl = data.imageThumbnailUrl;
    if (data.eventDate) docData.eventDate = Timestamp.fromDate(data.eventDate);
    if (data.location) docData.location = data.location;
    if (data.authorEmail) docData.authorEmail = data.authorEmail;

    const docRef = await addDoc(this.collectionRef, docData);
    const snap = await getDoc(docRef);
    return this.toEntity(snap);
  }

  /**
   * Get all news posts with optional filtering
   */
  async getAll(filter?: NewsPostFilter): Promise<NewsPost[]> {
    try {
      const constraints: QueryConstraint[] = [];

      if (filter?.category) {
        constraints.push(where('category', '==', filter.category));
      }

      if (filter?.isPinned !== undefined) {
        constraints.push(where('isPinned', '==', filter.isPinned));
      }

      if (filter?.authorId) {
        constraints.push(where('authorId', '==', filter.authorId));
      }

      // Try ordered query, fallback to unsorted if index in progress
      let snapshot;
      try {
        const q = query(this.collectionRef, ...constraints, orderBy('createdAt', 'desc'));
        snapshot = await getDocs(q);
      } catch {
        const q = query(this.collectionRef, ...constraints);
        snapshot = await getDocs(q);
      }

      let posts = snapshot.docs.map((d) => this.toEntity(d));

      // Sort pinned first, then newest first
      posts.sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return b.createdAt.getTime() - a.createdAt.getTime();
      });

      if (filter?.search) {
        const searchLower = filter.search.toLowerCase();
        posts = posts.filter(
          (p) =>
            p.title.toLowerCase().includes(searchLower) ||
            p.content.toLowerCase().includes(searchLower) ||
            p.authorName.toLowerCase().includes(searchLower)
        );
      }

      return posts;
    } catch (error) {
      console.warn('[NewsService] getAll failed:', error);
      return [];
    }
  }

  /**
   * Get single post by ID
   */
  async getById(id: string): Promise<NewsPost | null> {
    const docRef = doc(db, COLLECTIONS.NEWS_POSTS, id);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;
    return this.toEntity(snap);
  }

  /**
   * Update post
   */
  async update(id: string, data: Partial<NewsPost>): Promise<void> {
    const docRef = doc(db, COLLECTIONS.NEWS_POSTS, id);
    const updateData: Record<string, unknown> = {
      updatedAt: Timestamp.now(),
    };

    if (data.title !== undefined) updateData.title = data.title;
    if (data.content !== undefined) updateData.content = data.content;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl;
    if (data.isPinned !== undefined) updateData.isPinned = data.isPinned;
    if (data.location !== undefined) updateData.location = data.location;
    if (data.eventDate !== undefined) {
      updateData.eventDate = data.eventDate ? Timestamp.fromDate(data.eventDate) : null;
    }

    await updateDoc(docRef, updateData);
  }

  /**
   * Delete post
   */
  async delete(id: string): Promise<void> {
    const docRef = doc(db, COLLECTIONS.NEWS_POSTS, id);
    await deleteDoc(docRef);
  }

  /**
   * Add atomic public reaction (Namaste, Diya, Heart, Celebration)
   */
  async addReaction(id: string, reactionType: keyof NewsReactions): Promise<void> {
    const docRef = doc(db, COLLECTIONS.NEWS_POSTS, id);
    await updateDoc(docRef, {
      [`reactions.${reactionType}`]: increment(1),
    });
  }

  /**
   * Increment view counter atomically
   */
  async incrementViews(id: string): Promise<void> {
    const docRef = doc(db, COLLECTIONS.NEWS_POSTS, id);
    await updateDoc(docRef, {
      viewsCount: increment(1),
    }).catch(() => {});
  }
}

export const newsService = new NewsService();

