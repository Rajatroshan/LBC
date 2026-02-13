import { festivalService } from '../services/festival.service';
import { Festival, FestivalFilter } from '../models';

export class FestivalController {
  async createFestival(data: {
    name: string;
    type: string;
    date: Date;
    amountPerFamily: number;
    description?: string;
  }): Promise<Festival> {
    // Validation
    if (!data.name || !data.type || !data.date || !data.amountPerFamily) {
      throw new Error('Name, type, date, and amount are required');
    }

    if (data.amountPerFamily < 0) {
      throw new Error('Amount must be positive');
    }

    return await festivalService.create({
      ...data,
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

  async deleteFestival(id: string): Promise<void> {
    await festivalService.delete(id);
  }
}

export const festivalController = new FestivalController();
