import { Festival, FestivalFilter } from '@/core/types';

export interface IFestivalRepository {
  getById(id: string): Promise<Festival | null>;
  getAll(): Promise<Festival[]>;
  getFiltered(filter: FestivalFilter): Promise<Festival[]>;
  getUpcoming(limit?: number): Promise<Festival[]>;
  create(data: Omit<Festival, 'id' | 'createdAt' | 'updatedAt'>): Promise<Festival>;
  update(id: string, data: Partial<Festival>): Promise<Festival>;
  delete(id: string): Promise<void>;
}
