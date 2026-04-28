import type { ISiteRepository } from '../../../domain/repositories/ISiteRepository'
import type { MonitoredSite } from '../../../domain/entities/MonitoredSite'

interface ListSitesInput {
    userId: number
}

export class ListSitesUseCase { 
    constructor(private readonly siteRepository: ISiteRepository) { }

    async execute(input: ListSitesInput): Promise<MonitoredSite[]> {
        return await this.siteRepository.findByUserId(input.userId)
    }
}
