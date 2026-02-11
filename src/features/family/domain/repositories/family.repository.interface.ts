import { Family, FamilyFilter } from '@/core/types';

export interface IFamilyRepository {
  getById(id: string): Promise<Family | null>;
  getAll(): Promise<Family[]>;
  getFiltered(filter: FamilyFilter): Promise<Family[]>;
  create(data: Omit<Family, 'id' | 'createdAt' | 'updatedAt'>): Promise<Family>;
  update(id: string, data: Partial<Family>): Promise<Family>;
  delete(id: string): Promise<void>;
  countActive(): Promise<number>;
}
