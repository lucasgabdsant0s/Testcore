import { ResolveSelectorFromPointUseCase } from "../../../application/use-cases/ResolveSelectorFromPointUseCase"

export class PickerController {
  constructor(private readonly resolveUseCase: ResolveSelectorFromPointUseCase) {}

  resolveFromPoint = async (req: any, res: any) => {
    try {
      const { url, xPercent, yPercent, viewport, waitUntil, timeoutMs, preActions } = req.body ?? {}
      const result = await this.resolveUseCase.execute({ 
        url, 
        xPercent, 
        yPercent, 
        viewport, 
        waitUntil, 
        timeoutMs,
        preActions,
      })
      res.json(result)
    } catch (error: any) {
      res.status(400).json({ error: error?.message ?? "Erro ao resolver seletor" })
    }
  }
}


