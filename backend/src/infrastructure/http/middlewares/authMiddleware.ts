import type { Request, Response, NextFunction } from 'express';
import type { ITokenService } from '../../../domain/services/ITokenService';

export interface AuthRequest extends Request {
  userId?: number;
  userEmail?: string;
}

export function authMiddleware(tokenService: ITokenService) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({ message: 'Token não fornecido' });
      return;
    }

    const [, token] = authHeader.split(' ');

    if (!token) {
      res.status(401).json({ message: 'Token inválido' });
      return;
    }

    const payload = tokenService.verify(token);

    if (!payload) {
      res.status(401).json({ message: 'Token inválido ou expirado' });
      return;
    }

    req.userId = payload.userId;
    req.userEmail = payload.email;

    next();
  };
}

