import type { MonitoredSite } from '../entities/MonitoredSite'

export interface CreateSiteData {
    url: string
    nome: string
    userId: number
}

export interface ISiteRepository {
    create(data: CreateSiteData): Promise<MonitoredSite>
    findById(id: number, userId: number): Promise<MonitoredSite | null>
    findByUserId(userId: number): Promise<MonitoredSite[]>
    delete(id: number, userId: number): Promise<void>
}
