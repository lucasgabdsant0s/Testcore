import type { ITestsRepository } from "../../../domain/repositories/ITestsRepository"

type Input = { userId: number; siteUrl?: string }

export class ListTestsUseCase {
  constructor(private readonly repo: ITestsRepository) {}
  async execute(input: Input) {
    return this.repo.listByUser(input.userId, input.siteUrl)
  }
}


