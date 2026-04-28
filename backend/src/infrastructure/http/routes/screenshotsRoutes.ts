import { Router } from 'express';
import { ScreenshotsController } from '../controllers/ScreenshotsController';

export function createScreenshotsRoutes(controller: ScreenshotsController): Router {
    const router = Router();

    router.delete('/cleanup', (req, res) => controller.cleanup(req, res));

    return router;
}
