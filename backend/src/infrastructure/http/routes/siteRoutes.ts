import { Router } from 'express'
import type { ITokenService } from ' ../../../domain/services/ITokenService'
import { authMiddleware } from '../middlewares/authMiddleware'
import { SiteController } from '../controllers/SiteController'

export function createSiteRoutes(controller: SiteController, tokenService: ITokenService) {
    const router = Router()
    const authenticateToken = authMiddleware(tokenService)

    router.post('/', authenticateToken, controller.create)
    router.get('/', authenticateToken, controller.list)
    router.get('/:id', authenticateToken, controller.get)
    router.delete('/:id', authenticateToken, controller.delete)

    return router
}
