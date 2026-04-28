import type { Request, Response } from 'express';
import { LoginUseCase } from '../../../application/use-cases/LoginUseCase';
import { RegisterUseCase } from '../../../application/use-cases/RegisterUseCase';

export class AuthController {
  constructor(
    private loginUseCase: LoginUseCase,
    private registerUseCase: RegisterUseCase
  ) {}

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ message: 'Email e senha são obrigatórios' });
        return;
      }

      const result = await this.loginUseCase.execute({ email, password });

      res.status(200).json(result);
    } catch (error: any) {
      if (error.message === 'Credenciais inválidas') {
        res.status(401).json({ message: 'Credenciais inválidas' });
      } else {
        console.error('Erro no login:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
      }
    }
  }

  async register(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        res.status(400).json({ message: 'Nome, email e senha são obrigatórios' });
        return;
      }

      const user = await this.registerUseCase.execute({ name, email, password });

      res.status(201).json(user);
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'Erro ao registrar usuário' });
    }
  }
}

