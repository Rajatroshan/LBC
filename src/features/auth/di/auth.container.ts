import { FirebaseAuthRepository } from '../data/repositories/firebase-auth.repository';
import { LoginUseCase } from '../domain/usecases/login.usecase';
import { RegisterUseCase } from '../domain/usecases/register.usecase';
import { LogoutUseCase } from '../domain/usecases/logout.usecase';
import { GetCurrentUserUseCase } from '../domain/usecases/get-current-user.usecase';

/**
 * Auth Dependency Injection Container
 */
class AuthContainer {
  private _authRepository: FirebaseAuthRepository | null = null;

  authRepository(): FirebaseAuthRepository {
    if (!this._authRepository) {
      this._authRepository = new FirebaseAuthRepository();
    }
    return this._authRepository;
  }

  loginUseCase(): LoginUseCase {
    return new LoginUseCase(this.authRepository());
  }

  registerUseCase(): RegisterUseCase {
    return new RegisterUseCase(this.authRepository());
  }

  logoutUseCase(): LogoutUseCase {
    return new LogoutUseCase(this.authRepository());
  }

  getCurrentUserUseCase(): GetCurrentUserUseCase {
    return new GetCurrentUserUseCase(this.authRepository());
  }
}

export const authContainer = new AuthContainer();
