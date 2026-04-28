import type { IUserRepository } from '../../domain/repositories/IUserRepository';
import type { IHashService } from '../../domain/services/IHashService';
import type { ITokenService } from '../../domain/services/ITokenService';

export interface LoginDTO {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export class LoginUseCase {
  constructor(
    private userRepository: IUserRepository,
    private hashService: IHashService,
    private tokenService: ITokenService
  ) {}

  async execute(data: LoginDTO): Promise<LoginResponse> {
    const user = await this.userRepository.findByEmail(data.email);

    if (!user) {
      throw new Error('Credenciais inválidas');
    }

    const isPasswordValid = await this.hashService.compare(
      data.password,
      user.passwordHash
    );

    if (!isPasswordValid) {
      throw new Error('Credenciais inválidas');
    }

    const token = this.tokenService.generate({
      userId: user.id,
      email: user.email,
    });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }
}

