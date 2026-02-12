import { IUseCase } from '@/core/shared/interfaces';
import { IFestivalRepository } from '../repositories/festival.repository.interface';

export class DeleteFestivalUseCase implements IUseCase<string, void> {
  constructor(private festivalRepository: IFestivalRepository) {}

  async execute(id: string): Promise<void> {
    await this.festivalRepository.delete(id);
  }
}
