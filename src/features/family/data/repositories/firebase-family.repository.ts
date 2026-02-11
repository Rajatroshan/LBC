import { DocumentData, where } from 'firebase/firestore';
import { BaseFirestoreRepository } from '@/core/shared/base-repository';
import { Family, FamilyFilter } from '@/core/types';
import { COLLECTIONS } from '@/core/constants';
import { IFamilyRepository } from '../../domain/repositories/family.repository.interface';

export class FirebaseFamilyRepository
  extends BaseFirestoreRepository<Family>
  implements IFamilyRepository
{
  constructor() {
    super(COLLECTIONS.FAMILIES);
  }

  protected toEntity(doc: DocumentData): Family {
    return {
      id: doc.id,
      headName: doc.headName,
      members: doc.members,
      phone: doc.phone,
      address: doc.address,
      isActive: doc.isActive ?? true,
      createdAt: doc.createdAt?.toDate() || new Date(),
      updatedAt: doc.updatedAt?.toDate() || new Date(),
    };
  }

  async getFiltered(filter: FamilyFilter): Promise<Family[]> {
    const constraints = [];

    if (filter.isActive !== undefined) {
      constraints.push(where('isActive', '==', filter.isActive));
    }

    let families = await this.queryWithFilters(constraints);

    // Client-side search filter
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      families = families.filter(
        (family) =>
          family.headName.toLowerCase().includes(searchLower) ||
          family.phone.includes(searchLower)
      );
    }

    return families;
  }

  async countActive(): Promise<number> {
    const families = await this.queryWithFilters([where('isActive', '==', true)]);
    return families.length;
  }
}
