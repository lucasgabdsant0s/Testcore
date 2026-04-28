import type { ITestsRepository } from "../../../domain/repositories/ITestsRepository"
import type { Prisma } from "@prisma/client"

type Input = {
  userId: number
  name: string
  json: Prisma.JsonValue
}

export class CreateTestUseCase {
  constructor(private readonly repo: ITestsRepository) {}

  async execute(input: Input) {
    if (!input.name?.trim()) {
      throw new Error("Nome do teste é obrigatório")
    }
    return this.repo.create({ userId: input.userId, name: input.name.trim(), json: input.json })
  }
}


