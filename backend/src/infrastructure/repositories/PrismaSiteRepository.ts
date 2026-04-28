import type { PrismaClient } from '@prisma/client'
import type { ISiteRepository, CreateSiteData } from '../../domain/repositories/ISiteRepository'
import type { MonitoredSite } from '../../domain/entities/MonitoredSite'

export class PrismaSiteRepository implements ISiteRepository {
    constructor(private readonly prisma: PrismaClient) { }

    async create(data: CreateSiteData): Promise<MonitoredSite> {
        return await this.prisma.monitoredSite.create({
            data: {
                url: data.url,
                nome: data.nome,
                userId: data.userId,
            },
        })
    }

    async findById(id: number, userId: number): Promise<MonitoredSite | null> {
        return await this.prisma.monitoredSite.findFirst({
            where: {
                id,
                userId,
            },
        })
    }

    async findByUserId(userId: number): Promise<MonitoredSite[]> {
        return await this.prisma.monitoredSite.findMany({
            where: {
                userId,
            },
            orderBy: {
                createdAt: 'desc',
            },
        })
    }

    async delete(id: number, userId: number): Promise<void> {
        await this.prisma.monitoredSite.delete({
            where: {
                id,
                userId,
            },
        })
    }
}
