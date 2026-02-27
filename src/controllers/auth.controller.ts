import { authService } from '../services/auth.service';
import { User } from '../models';

export class AuthController {
  /**
   * Login user
   */
  async login(email: string, password: string): Promise<void> {
    // Validation
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    await authService.login(email, password);
  }

  /**
   * Register new user
   */
  async register(email: string, password: string, name: string): Promise<void> {
    // Validation
    if (!email || !password || !name) {
      throw new Error('Email, password, and name are required');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    await authService.register(email, password, name);
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    await authService.logout();
  }

  /**
   * Get current user
   */
  getCurrentUser() {
    return authService.getCurrentUser();
  }

  /**
   * Get user document
   */
  async getUserDocument(uid: string): Promise<User | null> {
    return await authService.getUserDocument(uid);
  }

  /**
   * Listen to auth state changes
   */
  onAuthStateChanged(callback: (user: import('firebase/auth').User | null) => void) {
    return authService.onAuthStateChanged(callback);
  }
}

// Export singleton instance
export const authController = new AuthController();
