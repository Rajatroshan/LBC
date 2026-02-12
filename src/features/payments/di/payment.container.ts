import { FirebasePaymentRepository } from '../data/repositories/firebase-payment.repository';
import { RecordPaymentUseCase } from '../domain/usecases/record-payment.usecase';
import { UpdatePaymentUseCase } from '../domain/usecases/update-payment.usecase';
import { DeletePaymentUseCase } from '../domain/usecases/delete-payment.usecase';
import { GetPaymentsByFestivalUseCase } from '../domain/usecases/get-payments-by-festival.usecase';
import { GetAllPaymentsUseCase } from '../domain/usecases/get-all-payments.usecase';

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

  updatePaymentUseCase(): UpdatePaymentUseCase {
    return new UpdatePaymentUseCase(this.paymentRepository());
  }

  deletePaymentUseCase(): DeletePaymentUseCase {
    return new DeletePaymentUseCase(this.paymentRepository());
  }

  getPaymentsByFestivalUseCase(): GetPaymentsByFestivalUseCase {
    return new GetPaymentsByFestivalUseCase(this.paymentRepository());
  }

  getAllPaymentsUseCase(): GetAllPaymentsUseCase {
    return new GetAllPaymentsUseCase(this.paymentRepository());
  }
}

export const paymentContainer = new PaymentContainer();
