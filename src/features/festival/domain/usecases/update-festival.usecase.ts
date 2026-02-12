import { IUseCase } from '@/core/shared/interfaces';
import { Festival } from '@/core/types';
import { IFestivalRepository } from '../repositories/festival.repository.interface';
import { NotFoundError } from '@/core/error';

export interface UpdateFestivalInput {
  id: string;
  data: Partial<Omit<Festival, 'id' | 'createdAt' | 'updatedAt'>>;
}

export class UpdateFestivalUseCase implements IUseCase<UpdateFestivalInput, Festival> {
  constructor(private festivalRepository: IFestivalRepository) {}

  async execute(input: UpdateFestivalInput): Promise<Festival> {
    const existing = await this.festivalRepository.getById(input.id);
    if (!existing) {
      throw new NotFoundError('Festival');
    }
    return await this.festivalRepository.update(input.id, input.data);
  }
}
