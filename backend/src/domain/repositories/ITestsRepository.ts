import type { Prisma } from "@prisma/client"

export type CreateTestInput = {
  userId: number
  name: string
  json: unknown
}

export interface ITestsRepository {
  create(data: CreateTestInput): Promise<{ id: number }>
  listByUser(userId: number, siteUrl?: string): Promise<Array<{ id: number; name: string; createdAt: Date; updatedAt: Date }>>
  getById(id: number, userId: number): Promise<{ id: number; name: string; json: unknown } | null>
  update(id: number, userId: number, data: { name: string; json: unknown }): Promise<void>
}


