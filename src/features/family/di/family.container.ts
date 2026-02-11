import { FirebaseFamilyRepository } from '../data/repositories/firebase-family.repository';
import { CreateFamilyUseCase } from '../domain/usecases/create-family.usecase';
import { GetFamiliesUseCase } from '../domain/usecases/get-families.usecase';
import { UpdateFamilyUseCase } from '../domain/usecases/update-family.usecase';
import { DeleteFamilyUseCase } from '../domain/usecases/delete-family.usecase';

class FamilyContainer {
  private _familyRepository: FirebaseFamilyRepository | null = null;

  familyRepository(): FirebaseFamilyRepository {
    if (!this._familyRepository) {
      this._familyRepository = new FirebaseFamilyRepository();
    }
    return this._familyRepository;
  }

  createFamilyUseCase(): CreateFamilyUseCase {
    return new CreateFamilyUseCase(this.familyRepository());
  }

  getFamiliesUseCase(): GetFamiliesUseCase {
    return new GetFamiliesUseCase(this.familyRepository());
  }

  updateFamilyUseCase(): UpdateFamilyUseCase {
    return new UpdateFamilyUseCase(this.familyRepository());
  }

  deleteFamilyUseCase(): DeleteFamilyUseCase {
    return new DeleteFamilyUseCase(this.familyRepository());
  }
}

export const familyContainer = new FamilyContainer();
