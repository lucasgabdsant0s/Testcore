import { Router } from "express"
import { PickerController } from "../controllers/PickerController"

export function createPickerRoutes(controller: PickerController) {
  const router = Router()
  router.post("/resolve-from-point", controller.resolveFromPoint)
  return router
}


