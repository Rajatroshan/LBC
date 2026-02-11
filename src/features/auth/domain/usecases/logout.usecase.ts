import { IUseCase } from '@/core/shared/interfaces';
import { IAuthRepository } from '../repositories/auth.repository.interface';

export class LogoutUseCase implements IUseCase<void, void> {
  constructor(private authRepository: IAuthRepository) {}

  async execute(): Promise<void> {
    await this.authRepository.logout();
  }
}
