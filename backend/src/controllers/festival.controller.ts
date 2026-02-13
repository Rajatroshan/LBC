import { FestivalRepository } from '../repositories/festival.repository';
import { Festival, FestivalFilter, ApiResponse } from '@shared/models';

export class FestivalController {
  private repository: FestivalRepository;

  constructor() {
    this.repository = new FestivalRepository();
  }

  async createFestival(data: {
    name: string;
    type: string;
    date: Date;
    amountPerFamily: number;
    description?: string;
  }): Promise<ApiResponse<Festival>> {
    try {
      if (!data.name || !data.type || !data.date || !data.amountPerFamily) {
        return {
          success: false,
          error: 'Name, type, date, and amount are required',
        };
      }

      const festival = await this.repository.create({
        ...data,
        isActive: true,
      });

      return {
        success: true,
        data: festival,
        message: 'Festival created successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to create festival',
      };
    }
  }

  async getFestivalById(id: string): Promise<ApiResponse<Festival>> {
    try {
      const festival = await this.repository.getById(id);
      
      if (!festival) {
        return {
          success: false,
          error: 'Festival not found',
        };
      }

      return {
        success: true,
        data: festival,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to get festival',
      };
    }
  }

  async getAllFestivals(filter?: FestivalFilter): Promise<ApiResponse<Festival[]>> {
    try {
      const festivals = await this.repository.getAll(filter);
      
      return {
        success: true,
        data: festivals,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to get festivals',
      };
    }
  }

  async getUpcomingFestivals(limit: number = 5): Promise<ApiResponse<Festival[]>> {
    try {
      const festivals = await this.repository.getUpcoming(limit);
      
      return {
        success: true,
        data: festivals,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to get upcoming festivals',
      };
    }
  }

  async updateFestival(id: string, data: Partial<Festival>): Promise<ApiResponse<Festival>> {
    try {
      const festival = await this.repository.update(id, data);
      
      return {
        success: true,
        data: festival,
        message: 'Festival updated successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to update festival',
      };
    }
  }

  async deleteFestival(id: string): Promise<ApiResponse<void>> {
    try {
      await this.repository.delete(id);
      
      return {
        success: true,
        message: 'Festival deleted successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to delete festival',
      };
    }
  }
}
