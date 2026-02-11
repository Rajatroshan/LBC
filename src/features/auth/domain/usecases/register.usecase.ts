import { IUseCase } from '@/core/shared/interfaces';
import { User } from '@/core/types';
import { IAuthRepository } from '../repositories/auth.repository.interface';

export interface RegisterInput {
  email: string;
  password: string;
  name: string;
}

export class RegisterUseCase implements IUseCase<RegisterInput, User> {
  constructor(private authRepository: IAuthRepository) {}

  async execute(input: RegisterInput): Promise<User> {
    const { email, password, name } = input;
    return await this.authRepository.register(email, password, name);
  }
}
