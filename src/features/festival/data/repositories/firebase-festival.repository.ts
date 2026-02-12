import { DocumentData, where, Timestamp } from 'firebase/firestore';
import { BaseFirestoreRepository } from '@/core/shared/base-repository';
import { Festival, FestivalFilter } from '@/core/types';
import { COLLECTIONS } from '@/core/constants';
import { IFestivalRepository } from '../../domain/repositories/festival.repository.interface';

export class FirebaseFestivalRepository
  extends BaseFirestoreRepository<Festival>
  implements IFestivalRepository
{
  constructor() {
    super(COLLECTIONS.FESTIVALS);
  }

  protected toEntity(doc: DocumentData): Festival {
    return {
      id: doc.id,
      name: doc.name,
      type: doc.type,
      date: doc.date?.toDate() || new Date(),
      amountPerFamily: doc.amountPerFamily,
      description: doc.description,
      isActive: doc.isActive ?? true,
      createdAt: doc.createdAt?.toDate() || new Date(),
      updatedAt: doc.updatedAt?.toDate() || new Date(),
    };
  }

  async getFiltered(filter: FestivalFilter): Promise<Festival[]> {
    const constraints = [];

    if (filter.isActive !== undefined) {
      constraints.push(where('isActive', '==', filter.isActive));
    }

    if (filter.type) {
      constraints.push(where('type', '==', filter.type));
    }

    let festivals = await this.queryWithFilters(constraints);

    if (filter.year) {
      festivals = festivals.filter(
        (festival) => festival.date.getFullYear() === filter.year
      );
    }

    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      festivals = festivals.filter((festival) =>
        festival.name.toLowerCase().includes(searchLower)
      );
    }

    return festivals.sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  async getUpcoming(limit: number = 10): Promise<Festival[]> {
    const now = new Date();
    const nowTimestamp = Timestamp.fromDate(now);
    const festivals = await this.queryWithFilters([
      where('isActive', '==', true),
      where('date', '>=', nowTimestamp),
    ]);

    return festivals
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, limit);
  }
}
