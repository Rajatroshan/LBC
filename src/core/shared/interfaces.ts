/**
 * Base Repository Interface
 * All repositories should implement this interface
 */
export interface IRepository<T> {
  getById(id: string): Promise<T | null>;
  getAll(): Promise<T[]>;
  create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T>;
  delete(id: string): Promise<void>;
}

/**
 * Base Use Case Interface
 */
export interface IUseCase<TInput, TOutput> {
  execute(input: TInput): Promise<TOutput>;
}
