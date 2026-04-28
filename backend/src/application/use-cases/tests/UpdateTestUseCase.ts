import type { ITestsRepository } from "../../../domain/repositories/ITestsRepository"
import type { Prisma } from "@prisma/client"

type Input = {
  id: number
  userId: number
  name: string
  json: Prisma.JsonValue
}

export class UpdateTestUseCase {
  constructor(private readonly repo: ITestsRepository) {}

  async execute(input: Input): Promise<void> {
    if (!input.name?.trim()) {
      throw new Error("Nome do teste é obrigatório")
    }
    await this.repo.update(input.id, input.userId, {
      name: input.name.trim(),
      json: input.json,
    })
  }
}


