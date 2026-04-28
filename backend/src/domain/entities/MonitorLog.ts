export interface MonitorLog {
    id: number
    siteId: number
    userId: number
    status: 'UP' | 'DOWN'
    responseTimeMs: number
    phoneNumber?: string
    createdAt: Date
}
