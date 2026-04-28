import { Router } from 'express'
import type { ITokenService } from '../../../domain/services/ITokenService'
import { authMiddleware } from '../middlewares/authMiddleware'
import { MonitorController } from '../controllers/MonitorController'

export function createMonitorRoutes(controller: MonitorController, tokenService: ITokenService) {
    const router = Router()
    router.use(authMiddleware(tokenService))

    router.post('/start/:siteId', controller.start)
    router.post('/stop/:siteId', controller.stop)
    router.get('/logs/:siteId', controller.getLogs)
    router.get('/status/:siteId', controller.getStatus)

    return router
}
