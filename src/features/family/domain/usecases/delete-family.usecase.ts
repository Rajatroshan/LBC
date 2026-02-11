import { IUseCase } from '@/core/shared/interfaces';
import { IFamilyRepository } from '../repositories/family.repository.interface';

export class DeleteFamilyUseCase implements IUseCase<string, void> {
  constructor(private familyRepository: IFamilyRepository) {}

  async execute(id: string): Promise<void> {
    await this.familyRepository.delete(id);
  }
}
