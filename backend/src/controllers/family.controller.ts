import { FamilyRepository } from '../repositories/family.repository';
import { Family, FamilyFilter, ApiResponse } from '@shared/models';

export class FamilyController {
  private repository: FamilyRepository;

  constructor() {
    this.repository = new FamilyRepository();
  }

  /**
   * Create a new family
   */
  async createFamily(data: {
    headName: string;
    members: number;
    phone: string;
    address: string;
  }): Promise<ApiResponse<Family>> {
    try {
      // Validation
      if (!data.headName || !data.phone) {
        return {
          success: false,
          error: 'Head name and phone are required',
        };
      }

      const family = await this.repository.create({
        ...data,
        isActive: true,
      });

      return {
        success: true,
        data: family,
        message: 'Family created successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to create family',
      };
    }
  }

  /**
   * Get family by ID
   */
  async getFamilyById(id: string): Promise<ApiResponse<Family>> {
    try {
      const family = await this.repository.getById(id);
      
      if (!family) {
        return {
          success: false,
          error: 'Family not found',
        };
      }

      return {
        success: true,
        data: family,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to get family',
      };
    }
  }

  /**
   * Get all families with optional filters
   */
  async getAllFamilies(filter?: FamilyFilter): Promise<ApiResponse<Family[]>> {
    try {
      const families = await this.repository.getAll(filter);
      
      return {
        success: true,
        data: families,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to get families',
      };
    }
  }

  /**
   * Update family
   */
  async updateFamily(id: string, data: Partial<Family>): Promise<ApiResponse<Family>> {
    try {
      const family = await this.repository.update(id, data);
      
      return {
        success: true,
        data: family,
        message: 'Family updated successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to update family',
      };
    }
  }

  /**
   * Delete family
   */
  async deleteFamily(id: string): Promise<ApiResponse<void>> {
    try {
      await this.repository.delete(id);
      
      return {
        success: true,
        message: 'Family deleted successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to delete family',
      };
    }
  }

  /**
   * Get active families count
   */
  async getActiveFamiliesCount(): Promise<ApiResponse<number>> {
    try {
      const count = await this.repository.countActive();
      
      return {
        success: true,
        data: count,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to get families count',
      };
    }
  }
}
