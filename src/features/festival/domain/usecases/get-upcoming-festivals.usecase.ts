import { IUseCase } from '@/core/shared/interfaces';
import { Festival } from '@/core/types';
import { IFestivalRepository } from '../repositories/festival.repository.interface';

export class GetUpcomingFestivalsUseCase implements IUseCase<number | undefined, Festival[]> {
  constructor(private festivalRepository: IFestivalRepository) {}

  async execute(limit?: number): Promise<Festival[]> {
    return await this.festivalRepository.getUpcoming(limit);
  }
}
