import type { MonitorLog } from '../entities/MonitorLog'

export interface CreateMonitorLogData {
    siteId: number
    userId: number
    status: 'UP' | 'DOWN'
    responseTimeMs: number
    error?: string
    testId?: number
}

export interface IMonitorLogRepository {
    create(data: CreateMonitorLogData): Promise<MonitorLog>
    findBySiteId(siteId: number, limit?: number): Promise<MonitorLog[]>
    findByUserId(userId: number, limit?: number): Promise<MonitorLog[]>
    getRecentLogs(siteId: number, minutesAgo: number): Promise<MonitorLog[]>
}
