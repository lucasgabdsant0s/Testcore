import type { ITestsRepository } from "../../../domain/repositories/ITestsRepository"

type Input = { id: number; userId: number }

export class GetTestByIdUseCase {
  constructor(private readonly repo: ITestsRepository) {}
  async execute(input: Input) {
    const test = await this.repo.getById(input.id, input.userId)
    if (!test) throw new Error("Teste não encontrado")
    return test
  }
}


