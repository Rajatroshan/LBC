import { AuthRepository } from '../repositories/auth.repository';
import { User, ApiResponse } from '@shared/models';
import { auth } from '../config/firebase.config';

export class AuthController {
  private repository: AuthRepository;

  constructor() {
    this.repository = new AuthRepository();
  }

  async register(data: {
    email: string;
    password: string;
    name: string;
    role?: 'ADMIN' | 'USER';
  }): Promise<ApiResponse<User>> {
    try {
      if (!data.email || !data.password || !data.name) {
        return {
          success: false,
          error: 'Email, password, and name are required',
        };
      }

      // Create Firebase Auth user
      const userRecord = await auth.createUser({
        email: data.email,
        password: data.password,
        displayName: data.name,
      });

      // Set custom claims for role
      await auth.setCustomUserClaims(userRecord.uid, {
        role: data.role || 'USER',
      });

      // Create user document in Firestore
      const user = await this.repository.createUser(
        userRecord.uid,
        data.email,
        data.name,
        data.role || 'USER'
      );

      return {
        success: true,
        data: user,
        message: 'User registered successfully',
      };
    } catch (error: unknown) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to register user',
      };
    }
  }

  async getUserById(uid: string): Promise<ApiResponse<User>> {
    try {
      const user = await this.repository.getUserById(uid);
      
      if (!user) {
        return {
          success: false,
          error: 'User not found',
        };
      }

      return {
        success: true,
        data: user,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to get user',
      };
    }
  }

  async updateUser(uid: string, data: Partial<User>): Promise<ApiResponse<User>> {
    try {
      const user = await this.repository.updateUser(uid, data);
      
      return {
        success: true,
        data: user,
        message: 'User updated successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to update user',
      };
    }
  }

  async deleteUser(uid: string): Promise<ApiResponse<void>> {
    try {
      await this.repository.deleteUser(uid);
      
      return {
        success: true,
        message: 'User deleted successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to delete user',
      };
    }
  }
}
