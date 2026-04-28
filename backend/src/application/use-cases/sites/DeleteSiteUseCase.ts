import type { ISiteRepository } from '../../../domain/repositories/ISiteRepository'

interface DeleteSiteInput {
    id: number
    userId: number
}

export class DeleteSiteUseCase {
    constructor(private readonly siteRepository: ISiteRepository) { }

    async execute(input: DeleteSiteInput): Promise<void> {
        const site = await this.siteRepository.findById(input.id, input.userId)

        if (!site) {
            throw new Error('Site não encontrado')
        }

        await this.siteRepository.delete(input.id, input.userId)
    }
}
