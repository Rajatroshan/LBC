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
   * Unified single-platform login or auto-register
   */
  async loginOrRegister(
    email: string, 
    password: string, 
    name?: string
  ): Promise<{ isNewUser: boolean }> {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    const result = await authService.loginOrRegister(email, password, name);
    return { isNewUser: result.isNewUser };
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
   * Login with Google OAuth
   */
  async loginWithGoogle(): Promise<void> {
    await authService.loginWithGoogle();
  }

  /**
   * Login with GitHub OAuth
   */
  async loginWithGithub(): Promise<void> {
    await authService.loginWithGithub();
  }

  /**
   * Sync OAuth user with Firestore document
   */
  async syncOAuthUserDocument(user: import('firebase/auth').User): Promise<void> {
    await authService.syncOAuthUserDocument(user);
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
