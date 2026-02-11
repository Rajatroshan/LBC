import { FirebasePaymentRepository } from '../data/repositories/firebase-payment.repository';
import { RecordPaymentUseCase } from '../domain/usecases/record-payment.usecase';
import { GetPaymentsByFestivalUseCase } from '../domain/usecases/get-payments-by-festival.usecase';

class PaymentContainer {
  private _paymentRepository: FirebasePaymentRepository | null = null;

  paymentRepository(): FirebasePaymentRepository {
    if (!this._paymentRepository) {
      this._paymentRepository = new FirebasePaymentRepository();
    }
    return this._paymentRepository;
  }

  recordPaymentUseCase(): RecordPaymentUseCase {
    return new RecordPaymentUseCase(this.paymentRepository());
  }

  getPaymentsByFestivalUseCase(): GetPaymentsByFestivalUseCase {
    return new GetPaymentsByFestivalUseCase(this.paymentRepository());
  }
}

export const paymentContainer = new PaymentContainer();
