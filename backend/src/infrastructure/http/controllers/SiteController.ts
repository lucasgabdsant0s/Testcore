import type { Response } from 'express'
import type { AuthRequest } from '../middlewares/authMiddleware'
import { CreateSiteUseCase } from '../../../application/use-cases/sites/CreateSiteUseCase'
import { ListSitesUseCase } from '../../../application/use-cases/sites/ListSitesUseCase'
import { GetSiteByIdUseCase } from '../../../application/use-cases/sites/GetSiteByIdUseCase'
import { DeleteSiteUseCase } from '../../../application/use-cases/sites/DeleteSiteUseCase'

export class SiteController {
    constructor(
        private readonly createSite: CreateSiteUseCase,
        private readonly listSites: ListSitesUseCase,
        private readonly getById: GetSiteByIdUseCase,
        private readonly deleteSite: DeleteSiteUseCase,
    ) { }

    create = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.userId!
            const { url, nome } = req.body ?? {}

            const site = await this.createSite.execute({ url, nome, userId })

            res.status(201).json(site)
        } catch (e: any) {
            res.status(400).json({ error: e?.message ?? 'Erro ao criar site' })
        }
    }

    list = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.userId!
            const sites = await this.listSites.execute({ userId })
            res.json(sites)
        } catch (e: any) {
            res.status(400).json({ error: e?.message ?? 'Erro ao listar sites' })
        }
    }

    get = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.userId!
            const id = Number(req.params.id)
            const site = await this.getById.execute({ id, userId })
            res.json(site)
        } catch (e: any) {
            res.status(404).json({ error: e?.message ?? 'Site não encontrado' })
        }
    }

    delete = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.userId!
            const id = Number(req.params.id)
            await this.deleteSite.execute({ id, userId })
            res.status(204).send()
        } catch (e: any) {
            res.status(400).json({ error: e?.message ?? 'Erro ao deletar site' })
        }
    }

}
