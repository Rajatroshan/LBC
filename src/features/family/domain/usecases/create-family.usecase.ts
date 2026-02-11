import { IUseCase } from '@/core/shared/interfaces';
import { Family } from '@/core/types';
import { IFamilyRepository } from '../repositories/family.repository.interface';

export interface CreateFamilyInput {
  headName: string;
  members: number;
  phone: string;
  address: string;
}

export class CreateFamilyUseCase implements IUseCase<CreateFamilyInput, Family> {
  constructor(private familyRepository: IFamilyRepository) {}

  async execute(input: CreateFamilyInput): Promise<Family> {
    return await this.familyRepository.create({
      ...input,
      isActive: true,
    });
  }
}
