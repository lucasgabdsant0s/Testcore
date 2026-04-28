import type { ISiteRepository } from '../../../domain/repositories/ISiteRepository'
import type { MonitoredSite } from '../../../domain/entities/MonitoredSite'

interface CreateSiteInput {
    url: string
    nome: string
    userId: number
}

export class CreateSiteUseCase {
    constructor(private readonly siteRepository: ISiteRepository) { }

    async execute(input: CreateSiteInput): Promise<MonitoredSite> {
        try {
            new URL(input.url)
        } catch {
            throw new Error('URL inválida')
        }

        if (!input.nome || input.nome.trim().length === 0) {
            throw new Error('Nome do site é obrigatório')
        }

        return await this.siteRepository.create({
            url: input.url,
            nome: input.nome,
            userId: input.userId,
        })
    }
}
