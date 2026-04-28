export interface SiteCheckResult {
    status: 'UP' | 'DOWN'
    responseTimeMs: number
    error?: string
}

export interface IMonitoringService {
    startMonitoring(
        siteId: number,
        url: string,
        userId: number,
    ): Promise<void>
    stopMonitoring(siteId: number): Promise<void>
    isMonitoring(siteId: number): boolean
    checkSiteAccessibility(url: string): Promise<SiteCheckResult>
}
