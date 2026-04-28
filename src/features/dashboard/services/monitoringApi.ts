import { apiClient } from '@/shared/lib/api-client'

export interface MonitoredSite {
    id: number
    url: string
    nome: string
    userId: number
    createdAt: string
    updatedAt: string
}

export interface MonitorLog {
    id: number
    siteId: number
    userId: number
    status: 'UP' | 'DOWN'
    responseTimeMs: number
    phoneNumber?: string
    createdAt: string
}

export interface CreateSiteRequest {
    url: string
    nome: string
}

export interface MonitoringStatus {
    isMonitoring: boolean
}



export const monitoringApi = {
    async createSite(data: CreateSiteRequest): Promise<MonitoredSite> {
        const response = await apiClient.post<MonitoredSite>('/sites', data)
        return response.data
    },

    async listSites(): Promise<MonitoredSite[]> {
        const response = await apiClient.get<MonitoredSite[]>('/sites')
        return response.data
    },

    async getSite(id: number): Promise<MonitoredSite> {
        const response = await apiClient.get<MonitoredSite>(`/sites/${id}`)
        return response.data
    },

    async deleteSite(id: number): Promise<void> {
        await apiClient.delete(`/sites/${id}`)
    },

    async startMonitoring(siteId: number): Promise<{ message: string }> {
        const response = await apiClient.post<{ message: string }>(`/monitor/start/${siteId}`)
        return response.data
    },

    async stopMonitoring(siteId: number): Promise<{ message: string }> {
        const response = await apiClient.post<{ message: string }>(`/monitor/stop/${siteId}`)
        return response.data
    },

    async getMonitoringStatus(siteId: number): Promise<MonitoringStatus> {
        const response = await apiClient.get<MonitoringStatus>(`/monitor/status/${siteId}`)
        return response.data
    },

    async getMonitorLogs(siteId: number, limit = 100): Promise<MonitorLog[]> {
        const response = await apiClient.get<MonitorLog[]>(`/monitor/logs/${siteId}`, {
            params: { limit },
        })
        return response.data
    },

}
