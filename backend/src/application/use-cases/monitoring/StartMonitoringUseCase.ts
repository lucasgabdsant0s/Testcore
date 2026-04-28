import type { IMonitoringService } from '../../../domain/services/IMonitoringService'
import type { ISiteRepository } from '../../../domain/repositories/ISiteRepository'

interface StartMonitoringInput {
    siteId: number
    userId: number
}

export class StartMonitoringUseCase {
    constructor(
        private readonly monitoringService: IMonitoringService,
        private readonly siteRepository: ISiteRepository,
    ) { }

    async execute(input: StartMonitoringInput): Promise<void> {
        const site = await this.siteRepository.findById(input.siteId, input.userId)

        if (!site) {
            throw new Error('Site não encontrado')
        }

        if (this.monitoringService.isMonitoring(input.siteId)) {
            throw new Error('Site já está sendo monitorado')
        }

        await this.monitoringService.startMonitoring(
            input.siteId,
            site.url,
            input.userId,
            undefined // testId (não usado mais)
        )
    }
}
