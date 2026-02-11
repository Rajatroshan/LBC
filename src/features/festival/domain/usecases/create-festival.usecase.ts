import { IUseCase } from '@/core/shared/interfaces';
import { Festival } from '@/core/types';
import { IFestivalRepository } from '../repositories/festival.repository.interface';

export interface CreateFestivalInput {
  name: string;
  type: string;
  date: Date;
  amountPerFamily: number;
  description?: string;
}

export class CreateFestivalUseCase implements IUseCase<CreateFestivalInput, Festival> {
  constructor(private festivalRepository: IFestivalRepository) {}

  async execute(input: CreateFestivalInput): Promise<Festival> {
    return await this.festivalRepository.create({
      ...input,
      isActive: true,
    });
  }
}
