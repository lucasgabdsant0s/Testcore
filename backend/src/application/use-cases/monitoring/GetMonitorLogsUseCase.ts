import type { IMonitorLogRepository } from '../../../domain/repositories/IMonitorLogRepository'
import type { ISiteRepository } from '../../../domain/repositories/ISiteRepository'
import type { MonitorLog } from '../../../domain/entities/MonitorLog'

interface GetMonitorLogsInput {
    siteId: number
    userId: number
    limit?: number
}

export class GetMonitorLogsUseCase {
    constructor(
        private readonly monitorLogRepository: IMonitorLogRepository,
        private readonly siteRepository: ISiteRepository,
    ) { }

    async execute(input: GetMonitorLogsInput): Promise<MonitorLog[]> {
        const site = await this.siteRepository.findById(input.siteId, input.userId)

        if (!site) {
            throw new Error('Site não encontrado')
        }

        return await this.monitorLogRepository.findBySiteId(
            input.siteId,
            input.limit || 100,
        )
    }
}
