import { User } from '@/core/types';

/**
 * Auth Repository Interface (Domain Layer)
 */
export interface IAuthRepository {
  login(email: string, password: string): Promise<User>;
  register(email: string, password: string, name: string): Promise<User>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
  updateProfile(userId: string, data: Partial<User>): Promise<User>;
}
