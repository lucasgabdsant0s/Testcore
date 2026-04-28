import { IElementSelectorService, ResolveSelectorInput, ResolveSelectorOutput } from "../../domain/services/IElementSelectorService"

export class ResolveSelectorFromPointUseCase {
  constructor(private readonly selectorService: IElementSelectorService) { }

  async execute(input: ResolveSelectorInput): Promise<ResolveSelectorOutput> {
    if (!input.url) {
      throw new Error("URL é obrigatória")
    }
    if (input.xPercent < 0 || input.xPercent > 100 || input.yPercent < 0 || input.yPercent > 100) {
      throw new Error("Coordenadas devem estar entre 0 e 100")
    }
    return this.selectorService.resolveFromPoint({
      ...input,
      waitUntil: input.waitUntil ?? "networkidle",
      timeoutMs: input.timeoutMs ?? 800000,
      viewport: input.viewport ?? { width: 1280, height: 800 },
    })
  }
}


