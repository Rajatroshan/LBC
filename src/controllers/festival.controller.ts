import { festivalService } from '../services/festival.service';
import { Festival, FestivalFilter } from '../models';

export class FestivalController {
  async createFestival(data: {
    name: string;
    type?: string;
    date: Date;
    endDate?: Date;
    isMultiDay?: boolean;
    amountPerFamily: number;
    description?: string;
  }): Promise<Festival> {
    // Validation
    if (!data.name || !data.date || !data.amountPerFamily) {
      throw new Error('Name, date, and contribution amount are required');
    }

    if (data.amountPerFamily < 0) {
      throw new Error('Amount must be positive');
    }

    return await festivalService.create({
      ...data,
      type: data.type || '',
      isActive: true,
    });
  }

  async getFestivalById(id: string): Promise<Festival> {
    const festival = await festivalService.getById(id);
    
    if (!festival) {
      throw new Error('Festival not found');
    }

    return festival;
  }

  async getAllFestivals(filter?: FestivalFilter): Promise<Festival[]> {
    return await festivalService.getAll(filter);
  }

  async getUpcomingFestivals(limit: number = 5): Promise<Festival[]> {
    return await festivalService.getUpcoming(limit);
  }

  async updateFestival(id: string, data: Partial<Festival>): Promise<void> {
    await festivalService.update(id, data);
  }

  async toggleFestivalStatus(id: string, isActive: boolean): Promise<void> {
    await festivalService.toggleStatus(id, isActive);
  }

  isDatePassed(date: Date, endDate?: Date): boolean {
    return festivalService.isDatePassed(date, endDate);
  }

  async deleteFestival(id: string): Promise<void> {
    await festivalService.delete(id);
  }
}

export const festivalController = new FestivalController();
