import { IUseCase } from '@/core/shared/interfaces';
import { Family } from '@/core/types';
import { IFamilyRepository } from '../repositories/family.repository.interface';
import { NotFoundError } from '@/core/error';

export interface UpdateFamilyInput {
  id: string;
  data: Partial<Omit<Family, 'id' | 'createdAt' | 'updatedAt'>>;
}

export class UpdateFamilyUseCase implements IUseCase<UpdateFamilyInput, Family> {
  constructor(private familyRepository: IFamilyRepository) {}

  async execute(input: UpdateFamilyInput): Promise<Family> {
    const existing = await this.familyRepository.getById(input.id);
    if (!existing) {
      throw new NotFoundError('Family');
    }
    return await this.familyRepository.update(input.id, input.data);
  }
}
