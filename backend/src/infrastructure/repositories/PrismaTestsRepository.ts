import { PrismaClient, Prisma } from "@prisma/client"
import type { CreateTestInput, ITestsRepository } from "../../domain/repositories/ITestsRepository"

export class PrismaTestsRepository implements ITestsRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: CreateTestInput): Promise<{ id: number }> {
    const created = await this.prisma.tests.create({
      data: {
        name: data.name,
        json: data.json as any,
        userId: data.userId,
      },
    })
    return { id: created.id }
  }

  async listByUser(userId: number, siteUrl?: string) {
    if (!siteUrl) {
      return this.prisma.tests.findMany({
        where: { userId },
        select: { id: true, name: true, createdAt: true, updatedAt: true },
        orderBy: { updatedAt: "desc" },
      })
    }

    const rows: Array<{ id: number; name: string; createdAt: Date; updatedAt: Date; json: unknown }> =
      await this.prisma.tests.findMany({
      where: { userId },
      select: { id: true, name: true, createdAt: true, updatedAt: true, json: true },
      orderBy: { updatedAt: "desc" },
    })

    return rows
      .filter((row) => {
        try {
          const metaSite = (row.json as any)?.meta?.siteUrl
          return typeof metaSite === "string" && metaSite === siteUrl
        } catch {
          return false
        }
      })
      .map((row) => ({
        id: row.id,
        name: row.name,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
      }))
  }

  async getById(id: number, userId: number) {
    return this.prisma.tests.findFirst({
      where: { id, userId },
      select: { id: true, name: true, json: true },
    }) as unknown as { id: number; name: string; json: unknown } | null
  }

  async update(id: number, userId: number, data: { name: string; json: unknown }) {
    await this.prisma.tests.update({
      where: { id, userId },
      data: {
        name: data.name,
        json: data.json as any,
      },
    })
  }
}


