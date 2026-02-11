import { IUseCase } from '@/core/shared/interfaces';
import { Family, FamilyFilter } from '@/core/types';
import { IFamilyRepository } from '../repositories/family.repository.interface';

export class GetFamiliesUseCase implements IUseCase<FamilyFilter | void, Family[]> {
  constructor(private familyRepository: IFamilyRepository) {}

  async execute(filter?: FamilyFilter): Promise<Family[]> {
    if (filter) {
      return await this.familyRepository.getFiltered(filter);
    }
    return await this.familyRepository.getAll();
  }
}
