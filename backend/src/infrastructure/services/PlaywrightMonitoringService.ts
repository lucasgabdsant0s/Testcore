import { chromium, type Browser, type Page } from 'playwright'
import type { IMonitoringService, SiteCheckResult } from '../../domain/services/IMonitoringService'
import type { IMonitorLogRepository } from '../../domain/repositories/IMonitorLogRepository'
import { PrismaClient } from '@prisma/client'

interface MonitoringJob {
    siteId: number
    url: string
    userId: number
    testId: number | undefined
    intervalId: NodeJS.Timeout
}

export class PlaywrightMonitoringService implements IMonitoringService {
    private monitors: Map<number, MonitoringJob> = new Map()
    private readonly CHECK_INTERVAL_MS = 30 * 1000
    private prisma: PrismaClient

    constructor(private readonly monitorLogRepository: IMonitorLogRepository) {
        this.prisma = new PrismaClient()
    }

    async startMonitoring(
        siteId: number,
        url: string,
        userId: number,
        testId?: number
    ): Promise<void> {
        if (this.monitors.has(siteId)) {
            throw new Error('Monitoring already active for this site')
        }

        await this.performCheck(siteId, url, userId, testId)

        const intervalId = setInterval(async () => {
            await this.performCheck(siteId, url, userId, testId)
        }, this.CHECK_INTERVAL_MS)

        this.monitors.set(siteId, {
            siteId,
            url,
            userId,
            testId,
            intervalId,
        })

        console.log(`Started monitoring site ${siteId} (${url}) ${testId ? `with test ${testId}` : ''} - checking every 30s`)
    }

    async stopMonitoring(siteId: number): Promise<void> {
        const job = this.monitors.get(siteId)

        if (!job) {
            throw new Error('Monitoring not active for this site')
        }

        clearInterval(job.intervalId)
        this.monitors.delete(siteId)

        console.log(`Stopped monitoring site ${siteId}`)
    }

    isMonitoring(siteId: number): boolean {
        return this.monitors.has(siteId)
    }

    async checkSiteAccessibility(url: string): Promise<SiteCheckResult> {
        return this.runTest(url)
    }

    private async runTest(url: string, testId?: number): Promise<SiteCheckResult & { generatedPhone?: string }> {
        let browser: Browser | null = null
        const startTime = Date.now()
        let generatedPhone: string | undefined

        try {
            let testScenario: any = null
            let testName = 'Verificação Simples'

            if (testId) {
                const test = await this.prisma.tests.findUnique({ where: { id: testId } })
                if (test && test.json) {
                    testScenario = test.json as any
                    testName = test.name
                    console.log(`EXECUTANDO TESTE: "${testName}" (ID: ${testId})`)
                    console.log(`Total de passos: ${testScenario.blocks?.length || 0}`)
                }
            } else {
                console.log(`Executando verificação simples (sem teste específico)`)
            }

            browser = await chromium.launch({ headless: true })
            const context = await browser.newContext({ ignoreHTTPSErrors: true })
            const page = await context.newPage()

            if (testScenario && testScenario.blocks && testScenario.blocks.length > 0) {
                const { ScenarioExecutor } = await import('../../../../tests/executor')
                const executor = new ScenarioExecutor()

                if (!testScenario.meta) {
                    testScenario.meta = {}
                }
                testScenario.meta.siteUrl = url

                const result = await executor.execute(page, testScenario)
                generatedPhone = result.generatedPhone

                if (generatedPhone) {
                    console.log(`Telefone gerado para este teste: ${generatedPhone}`)
                }

                console.log(`Teste "${testName}" executado com SUCESSO!`)
            } else {
                const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 })
                if (!response || response.status() >= 500) {
                    throw new Error(response ? `Server error: ${response.status()}` : 'No response')
                }
            }

            const responseTimeMs = Date.now() - startTime
            await browser.close()

            return { status: 'UP', responseTimeMs, generatedPhone }

        } catch (error: any) {
            const responseTimeMs = Date.now() - startTime
            if (browser) await browser.close().catch(() => { })

            console.log(`FALHA no teste: ${error?.message}`)
            return {
                status: 'DOWN',
                responseTimeMs,
                error: error?.message || 'Unknown error',
                generatedPhone
            }
        }
    }

    private async executeStep(page: Page, step: any, baseUrl: string) {
        switch (step.type) {
            case 'goto':
                const targetUrl = step.params.url || baseUrl
                console.log(`    Acessando: ${targetUrl}`)
                await page.goto(targetUrl, {
                    waitUntil: step.params.waitUntil || 'domcontentloaded',
                    timeout: 15000
                })
                break
            case 'click':
                if (step.params.selector) {
                    console.log(`    Clicando em: ${step.params.selector}`)
                    await page.click(step.params.selector, { timeout: step.params.timeout || 5000 })
                }
                break
            case 'screenshot':
                console.log(`    Capturando screenshot: ${step.params.name || 'screenshot'}`)
                break
            case 'wait':
                if (step.params.ms) {
                    console.log(`    Aguardando ${step.params.ms}ms`)
                    await page.waitForTimeout(step.params.ms)
                }
                break
            default:
                console.log(`    Tipo de passo desconhecido: ${step.type}`)
        }
    }

    private async performCheck(
        siteId: number,
        url: string,
        userId: number,
        testId?: number
    ): Promise<void> {
        try {
            console.log(`\n${'='.repeat(60)}`)
            console.log(`Checking site ${siteId} (${url})`)
            if (testId) {
                console.log(`Usando teste ID: ${testId}`)
            }

            let result: SiteCheckResult & { generatedPhone?: string }

            result = await this.runTest(url, testId)

            const logData: any = {
                siteId,
                userId,
                status: result.status,
                responseTimeMs: result.responseTimeMs,
            }

            if (result.error) {
                logData.error = result.error
            }

            if (result.generatedPhone) {
                logData.phoneNumber = result.generatedPhone
                console.log(`Salvando telefone gerado no log: ${result.generatedPhone}`)
            }

            if (testId) {
                logData.testId = testId
            }

            await this.monitorLogRepository.create(logData)

            console.log(`Site ${siteId} check complete: ${result.status} (${result.responseTimeMs}ms)`)
            console.log(`${'='.repeat(60)}\n`)
        } catch (error: any) {
            console.error(`Error checking site ${siteId}:`, error?.message)
        }
    }
}
