import type { ISiteRepository } from '../../../domain/repositories/ISiteRepository'
import type { MonitoredSite } from '../../../domain/entities/MonitoredSite'

interface GetSiteByIdInput {
    id: number
    userId: number
}

export class GetSiteByIdUseCase {
    constructor(private readonly siteRepository: ISiteRepository) { }

    async execute(input: GetSiteByIdInput): Promise<MonitoredSite> {
        const site = await this.siteRepository.findById(input.id, input.userId)

        if (!site) {
            throw new Error('Site não encontrado')
        }

        return site
    }
}
