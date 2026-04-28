import { Router } from "express"
import type { ITokenService } from "../../../domain/services/ITokenService"
import { authMiddleware } from "../middlewares/authMiddleware"
import { TestsController } from "../controllers/TestsController"

export function createTestsRoutes(controller: TestsController, tokenService: ITokenService) {
  const router = Router()
  router.use(authMiddleware(tokenService))
  router.post("/", controller.create)
  router.get("/", controller.list)
  router.get("/:id", controller.get)
  router.put("/:id", controller.update)
  router.post("/run", controller.run)
  return router
}


