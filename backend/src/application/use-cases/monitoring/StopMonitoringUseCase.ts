import type { IMonitoringService } from '../../../domain/services/IMonitoringService'
import type { ISiteRepository } from '../../../domain/repositories/ISiteRepository'

interface StopMonitoringInput {
    siteId: number
    userId: number
}

export class StopMonitoringUseCase {
    constructor(
        private readonly monitoringService: IMonitoringService,
        private readonly siteRepository: ISiteRepository,
    ) { }

    async execute(input: StopMonitoringInput): Promise<void> {
        const site = await this.siteRepository.findById(input.siteId, input.userId)

        if (!site) {
            throw new Error('Site não encontrado')
        }

        if (!this.monitoringService.isMonitoring(input.siteId)) {
            throw new Error('Site não está sendo monitorado')
        }

        await this.monitoringService.stopMonitoring(input.siteId)
    }
}
