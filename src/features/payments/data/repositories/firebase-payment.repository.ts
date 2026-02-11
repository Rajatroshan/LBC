import { DocumentData, where } from 'firebase/firestore';
import { BaseFirestoreRepository } from '@/core/shared/base-repository';
import { Payment, PaymentFilter } from '@/core/types';
import { COLLECTIONS } from '@/core/constants';
import { IPaymentRepository } from '../../domain/repositories/payment.repository.interface';

export class FirebasePaymentRepository
  extends BaseFirestoreRepository<Payment>
  implements IPaymentRepository
{
  constructor() {
    super(COLLECTIONS.PAYMENTS);
  }

  protected toEntity(doc: DocumentData): Payment {
    return {
      id: doc.id,
      familyId: doc.familyId,
      festivalId: doc.festivalId,
      amount: doc.amount,
      paidDate: doc.paidDate?.toDate() || new Date(),
      status: doc.status,
      receiptNumber: doc.receiptNumber,
      notes: doc.notes,
      createdAt: doc.createdAt?.toDate() || new Date(),
      updatedAt: doc.updatedAt?.toDate() || new Date(),
    };
  }

  async getFiltered(filter: PaymentFilter): Promise<Payment[]> {
    const constraints = [];

    if (filter.festivalId) {
      constraints.push(where('festivalId', '==', filter.festivalId));
    }

    if (filter.familyId) {
      constraints.push(where('familyId', '==', filter.familyId));
    }

    if (filter.status) {
      constraints.push(where('status', '==', filter.status));
    }

    let payments = await this.queryWithFilters(constraints);

    if (filter.startDate) {
      payments = payments.filter((p) => p.paidDate >= filter.startDate!);
    }

    if (filter.endDate) {
      payments = payments.filter((p) => p.paidDate <= filter.endDate!);
    }

    return payments.sort((a, b) => b.paidDate.getTime() - a.paidDate.getTime());
  }

  async getByFestival(festivalId: string): Promise<Payment[]> {
    return await this.queryWithFilters([where('festivalId', '==', festivalId)]);
  }

  async getByFamily(familyId: string): Promise<Payment[]> {
    return await this.queryWithFilters([where('familyId', '==', familyId)]);
  }
}
