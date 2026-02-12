import { IUseCase } from '@/core/shared/interfaces';
import { Festival } from '@/core/types';
import { IFestivalRepository } from '../repositories/festival.repository.interface';

export class GetFestivalsUseCase implements IUseCase<void, Festival[]> {
  constructor(private festivalRepository: IFestivalRepository) {}

  async execute(): Promise<Festival[]> {
    return await this.festivalRepository.getAll();
  }
}
