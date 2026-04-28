const express = require('express');
import { AuthController } from '../controllers/AuthController';
import type { ITokenService } from '../../../domain/services/ITokenService';
import { authMiddleware } from '../middlewares/authMiddleware';

export function createAuthRoutes(
  authController: AuthController,
  tokenService: ITokenService
) {
  const router = express.Router();

  router.post('/login', (req: any, res: any) => authController.login(req, res));
  router.post('/register', authMiddleware(tokenService), (req: any, res: any) => 
    authController.register(req, res)
  );

  return router;
}

