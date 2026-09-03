import { familyService } from '../services/family.service';
import { Family, FamilyFilter } from '../models';
import { VALIDATION } from '@/constants';

export class FamilyController {
  /**
   * Create a new family with unique mobile number validation
   */
  async createFamily(data: {
    headName: string;
    members: number;
    phone: string;
    address: string;
    createdByUserId?: string;
    createdByUserName?: string;
    createdByUserEmail?: string;
  }): Promise<Family> {
    // Validation
    if (!data.headName || !data.phone) {
      throw new Error('Head name and mobile number are required');
    }

    if (data.members < 1) {
      throw new Error('Members must be at least 1');
    }

    const cleanPhone = data.phone.replace(/[^0-9]/g, '');
    if (!VALIDATION.PHONE_REGEX.test(cleanPhone)) {
      throw new Error('Mobile number must be 10-15 digits (numbers only)');
    }

    // Check mobile number uniqueness across active village families
    const existingFamily = await familyService.getByPhone(cleanPhone);
    if (existingFamily) {
      throw new Error(
        `A family is already registered with mobile number ${cleanPhone} (Family Head: "${existingFamily.headName}"). Mobile number must be unique.`
      );
    }

    return await familyService.create({
      ...data,
      phone: cleanPhone,
      isActive: true,
      createdByUserId: data.createdByUserId,
      createdByUserName: data.createdByUserName,
      createdByUserEmail: data.createdByUserEmail,
    });
  }

  /**
   * Check if a mobile number is already registered
   */
  async checkPhoneAvailability(
    phone: string, 
    currentFamilyId?: string
  ): Promise<{ isAvailable: boolean; existingFamily?: Family }> {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (!VALIDATION.PHONE_REGEX.test(cleanPhone)) {
      return { isAvailable: true };
    }
    const existing = await familyService.getByPhone(cleanPhone);
    if (existing && (!currentFamilyId || existing.id !== currentFamilyId)) {
      return { isAvailable: false, existingFamily: existing };
    }
    return { isAvailable: true };
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
   * Update family with mobile number uniqueness check
   */
  async updateFamily(id: string, data: Partial<Family>): Promise<void> {
    if (data.phone) {
      const cleanPhone = data.phone.replace(/[^0-9]/g, '');
      if (!VALIDATION.PHONE_REGEX.test(cleanPhone)) {
        throw new Error('Mobile number must be 10-15 digits (numbers only)');
      }

      // Check if another active family already has this phone number
      const existingFamily = await familyService.getByPhone(cleanPhone);
      if (existingFamily && existingFamily.id !== id) {
        throw new Error(
          `Another family is already registered with mobile number ${cleanPhone} (Family Head: "${existingFamily.headName}"). Mobile number must be unique.`
        );
      }
      data.phone = cleanPhone;
    }

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
