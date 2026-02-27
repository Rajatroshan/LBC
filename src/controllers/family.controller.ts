import { familyService } from '../services/family.service';
import { Family, FamilyFilter } from '../models';
import { VALIDATION } from '@/constants';

export class FamilyController {
  /**
   * Create a new family
   */
  async createFamily(data: {
    headName: string;
    members: number;
    phone: string;
    address: string;
  }): Promise<Family> {
    // Validation
    if (!data.headName || !data.phone) {
      throw new Error('Head name and phone are required');
    }

    if (data.members < 1) {
      throw new Error('Members must be at least 1');
    }

    if (!VALIDATION.PHONE_REGEX.test(data.phone)) {
      throw new Error('Phone number must be 10-15 digits (numbers only)');
    }

    return await familyService.create({
      ...data,
      isActive: true,
    });
  }

  /**
   * Get family by ID
   */
  async getFamilyById(id: string): Promise<Family> {
    const family = await familyService.getById(id);
    
    if (!family) {
      throw new Error('Family not found');
    }

    return family;
  }

  /**
   * Get all families with optional filters
   */
  async getAllFamilies(filter?: FamilyFilter): Promise<Family[]> {
    return await familyService.getAll(filter);
  }

  /**
   * Update family
   */
  async updateFamily(id: string, data: Partial<Family>): Promise<void> {
    await familyService.update(id, data);
  }

  /**
   * Delete family
   */
  async deleteFamily(id: string): Promise<void> {
    await familyService.delete(id);
  }
}

// Export singleton instance
export const familyController = new FamilyController();
