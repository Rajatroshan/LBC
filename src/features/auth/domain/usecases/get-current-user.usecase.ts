import { IUseCase } from '@/core/shared/interfaces';
import { User } from '@/core/types';
import { IAuthRepository } from '../repositories/auth.repository.interface';

export class GetCurrentUserUseCase implements IUseCase<void, User | null> {
  constructor(private authRepository: IAuthRepository) {}

  async execute(): Promise<User | null> {
    return await this.authRepository.getCurrentUser();
  }
}
