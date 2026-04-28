import type { PrismaClient } from '@prisma/client'
import type { IMonitorLogRepository, CreateMonitorLogData } from '../../domain/repositories/IMonitorLogRepository'
import type { MonitorLog } from '../../domain/entities/MonitorLog'

export class PrismaMonitorLogRepository implements IMonitorLogRepository {
    constructor(private readonly prisma: PrismaClient) { }

    async create(data: CreateMonitorLogData): Promise<MonitorLog> {
        return await this.prisma.monitorLog.create({
            data: {
                siteId: data.siteId,
                userId: data.userId,
                status: data.status,
                responseTimeMs: data.responseTimeMs,
            },
        })
    }

    async findBySiteId(siteId: number, limit: number = 100): Promise<MonitorLog[]> {
        return await this.prisma.monitorLog.findMany({
            where: {
                siteId,
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: limit,
        })
    }

    async findByUserId(userId: number, limit: number = 100): Promise<MonitorLog[]> {
        return await this.prisma.monitorLog.findMany({
            where: {
                userId,
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: limit,
        })
    }

    async getRecentLogs(siteId: number, minutesAgo: number): Promise<MonitorLog[]> {
        const timeThreshold = new Date(Date.now() - minutesAgo * 60 * 1000)

        return await this.prisma.monitorLog.findMany({
            where: {
                siteId,
                createdAt: {
                    gte: timeThreshold,
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        })
    }
}
