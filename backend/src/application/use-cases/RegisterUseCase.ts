import type { IUserRepository } from '../../domain/repositories/IUserRepository';
import type { IHashService } from '../../domain/services/IHashService';
import { User } from '../../domain/entities/User';

export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  id: number;
  name: string;
  email: string;
}

export class RegisterUseCase {
  constructor(
    private userRepository: IUserRepository,
    private hashService: IHashService
  ) {}

  async execute(data: RegisterDTO): Promise<RegisterResponse> {
    const existingUser = await this.userRepository.findByEmail(data.email);

    if (existingUser) {
      throw new Error('Email já cadastrado');
    }

    const passwordHash = await this.hashService.hash(data.password);

    const user = User.create(data.name, data.email, passwordHash);

    const createdUser = await this.userRepository.create(user);

    return {
      id: createdUser.id,
      name: createdUser.name,
      email: createdUser.email,
    };
  }
}

