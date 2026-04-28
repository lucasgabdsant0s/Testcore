import type { Response } from 'express'
import type { AuthRequest } from '../middlewares/authMiddleware'
import { StartMonitoringUseCase } from '../../../application/use-cases/monitoring/StartMonitoringUseCase'
import { StopMonitoringUseCase } from '../../../application/use-cases/monitoring/StopMonitoringUseCase'
import { GetMonitorLogsUseCase } from '../../../application/use-cases/monitoring/GetMonitorLogsUseCase'
import type { IMonitoringService } from '../../../domain/services/IMonitoringService'

export class MonitorController {
    constructor(
        private readonly startMonitoring: StartMonitoringUseCase,
        private readonly stopMonitoring: StopMonitoringUseCase,
        private readonly getMonitorLogs: GetMonitorLogsUseCase,
        private readonly monitoringService: IMonitoringService,
    ) { }

    start = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.userId!
            const siteId = Number(req.params.siteId)
            const { testType } = req.body || {}

            // Atualizar testType do site se fornecido
            if (testType) {
                const { PrismaClient } = require('@prisma/client')
                const prisma = new PrismaClient()
                await prisma.monitoredSite.update({
                    where: { id: siteId },
                    data: { testType }
                })
                await prisma.$disconnect()
            }

            await this.startMonitoring.execute({ siteId, userId })

            res.json({ message: 'Monitoramento iniciado com sucesso' })
        } catch (e: any) {
            res.status(400).json({ error: e?.message ?? 'Erro ao iniciar monitoramento' })
        }
    }

    stop = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.userId!
            const siteId = Number(req.params.siteId)

            await this.stopMonitoring.execute({ siteId, userId })

            res.json({ message: 'Monitoramento parado com sucesso' })
        } catch (e: any) {
            res.status(400).json({ error: e?.message ?? 'Erro ao parar monitoramento' })
        }
    }

    getLogs = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.userId!
            const siteId = Number(req.params.siteId)
            const limit = req.query.limit ? Number(req.query.limit) : undefined

            const input = limit !== undefined
                ? { siteId, userId, limit }
                : { siteId, userId }

            const logs = await this.getMonitorLogs.execute(input)

            res.json(logs)
        } catch (e: any) {
            res.status(400).json({ error: e?.message ?? 'Erro ao buscar logs' })
        }
    }

    getStatus = async (req: AuthRequest, res: Response) => {
        try {
            const siteId = Number(req.params.siteId)
            const isMonitoring = this.monitoringService.isMonitoring(siteId)

            res.json({ isMonitoring })
        } catch (e: any) {
            res.status(400).json({ error: e?.message ?? 'Erro ao verificar status' })
        }
    }
}
