import type { Response } from "express"
import type { AuthRequest } from "../middlewares/authMiddleware"
import { CreateTestUseCase } from "../../../application/use-cases/tests/CreateTestUseCase"
import { ListTestsUseCase } from "../../../application/use-cases/tests/ListTestsUseCase"
import { GetTestByIdUseCase } from "../../../application/use-cases/tests/GetTestByIdUseCase"
import { RunTestUseCase } from "../../../application/use-cases/tests/RunTestUseCase"
import { UpdateTestUseCase } from "../../../application/use-cases/tests/UpdateTestUseCase"

export class TestsController {
  constructor(
    private readonly createTest: CreateTestUseCase,
    private readonly listTests: ListTestsUseCase,
    private readonly getById: GetTestByIdUseCase,
    private readonly updateTest: UpdateTestUseCase,
    private readonly runTest: RunTestUseCase,
  ) {}

  create = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.userId!
      const { name, json } = req.body ?? {}
      const created = await this.createTest.execute({ userId, name, json })
      res.status(201).json({ id: created.id })
    } catch (e: any) {
      res.status(400).json({ error: e?.message ?? "Erro ao criar teste" })
    }
  }

  list = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.userId!
      const siteUrl = typeof req.query.siteUrl === "string" ? req.query.siteUrl : undefined
      const args = siteUrl ? { userId, siteUrl } : { userId }
      const items = await this.listTests.execute(args as any)
      res.json(items)
    } catch (e: any) {
      res.status(400).json({ error: e?.message ?? "Erro ao listar testes" })
    }
  }

  get = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.userId!
      const id = Number(req.params.id)
      const test = await this.getById.execute({ id, userId })
      res.json(test)
    } catch (e: any) {
      res.status(404).json({ error: e?.message ?? "Teste não encontrado" })
    }
  }

  update = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.userId!
      const id = Number(req.params.id)
      const { name, json } = req.body ?? {}
      await this.updateTest.execute({ id, userId, name, json })
      res.status(204).send()
    } catch (e: any) {
      res.status(400).json({ error: e?.message ?? "Erro ao atualizar teste" })
    }
  }

  run = async (req: AuthRequest, res: Response) => {
    try {
      const { json } = req.body ?? {}
      if (!json?.blocks) {
        return res.status(400).json({ error: "Cenário inválido para execução" })
      }
      await this.runTest.execute({ scenario: json })
      res.status(200).json({ ok: true })
    } catch (e: any) {
      // eslint-disable-next-line no-console
      console.error("Erro ao executar teste:", e)
      // Mantemos 200 e retornamos o erro no payload para diferenciar falha de teste de erro de integração
      res.status(200).json({ ok: false, error: e?.message ?? "Erro ao executar teste" })
    }
  }
}


