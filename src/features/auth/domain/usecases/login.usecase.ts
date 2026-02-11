import { IUseCase } from '@/core/shared/interfaces';
import { User } from '@/core/types';
import { IAuthRepository } from '../repositories/auth.repository.interface';

export interface LoginInput {
  email: string;
  password: string;
}

export class LoginUseCase implements IUseCase<LoginInput, User> {
  constructor(private authRepository: IAuthRepository) {}

  async execute(input: LoginInput): Promise<User> {
    const { email, password } = input;
    return await this.authRepository.login(email, password);
  }
}
