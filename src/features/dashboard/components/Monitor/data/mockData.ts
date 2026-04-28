import type { MonitoringSite, Test, AccessibilityData, LoginData, ErrorData, MonitoringStats } from "../types"

// Gera dados testes
function generateTimeSeriesData<T>(
    generator: (date: Date, index: number) => T,
    hours: number = 24
): T[] {
    const data: T[] = []
    const now = new Date()

    for (let i = hours; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 60 * 60 * 1000)
        data.push(generator(date, hours - i))
    }

    return data
}

/**
 * Busca dados de acesso(fazer chamada api)
 */
export function getAccessibilityData(_siteId: string): AccessibilityData[] {
    return generateTimeSeriesData((date, index) => {
        const isDown = index === 8 || index === 15
        const uptime = isDown ? Math.random() * 30 : 95 + Math.random() * 5

        return {
            timestamp: date.toISOString(),
            uptime: Math.round(uptime * 100) / 100,
        }
    })
}

/**
 * Busca dados de login(fazer chamada api)
 */
export function getLoginStatusData(_siteId: string): LoginData[] {
    return generateTimeSeriesData((date, index) => {
        const baseSuccessRate = 90
        const variation = Math.sin(index / 3) * 10
        const successRate = Math.max(70, Math.min(100, baseSuccessRate + variation))

        const totalAttempts = 100 + Math.floor(Math.random() * 50)
        const successful = Math.floor(totalAttempts * (successRate / 100))
        const failed = totalAttempts - successful

        return {
            timestamp: date.toISOString(),
            successRate: Math.round(successRate * 100) / 100,
            successful,
            failed,
        }
    })
}

/**
 * Busca dados de erros(fazer chamada api)
 */
export function getErrorsData(_siteId: string): ErrorData[] {
    return generateTimeSeriesData((date, index) => {
        const isSpike = index === 10 || index === 18
        const baseErrors = 2 + Math.random() * 3
        const count = isSpike ? 20 + Math.random() * 15 : baseErrors

        return {
            timestamp: date.toISOString(),
            count: Math.floor(count),
            severity: count > 15 ? "high" : count > 8 ? "medium" : "low",
        }
    })
}

/**
 * Busca dados de site variavel(puxar do banco e fazer chamada api)
 */
export function getSiteInfo(siteId: string): MonitoringSite {
    const sites: Record<string, MonitoringSite> = {
        "Teste Login": {
            id: "Teste Login",
            name: "loginTest",
            url: "https://practicetestautomation.com/practice-test-login/",
            status: "online",
            uptime: 99.2,
            lastChecked: new Date().toISOString(),
        },
    }

    return sites[siteId] || {
        id: siteId,
        name: siteId,
        url: `https://${siteId}.com`,
        status: "online",
        uptime: 99.5,
        lastChecked: new Date().toISOString(),
    }
}

/**
 * Busca dados de testes(fazer chamada api)
 */
export function getTests(_siteId: string): Test[] {
    return [
        {
            id: "test-login",
            name: "Teste de Login",
            status: "passing",
            lastRun: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
            description: "Verifica se o login está funcionando corretamente",
        },
        {
            id: "test-access",
            name: "Teste de Acesso",
            status: "passing",
            lastRun: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
            description: "Verifica se o site está acessível",
        },
        {
            id: "test-deposit",
            name: "Teste de Depósito",
            status: "passing",
            lastRun: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
            description: "Verifica funcionalidade de depósito",
        },
        {
            id: "test-withdrawal",
            name: "Teste de Saque",
            status: "failing",
            lastRun: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
            description: "Verifica funcionalidade de saque",
        },
    ]
}

/**
 * Busca dados de estatísticas de monitoramento
 */
export function getMonitoringStats(siteId: string): MonitoringStats {
    const tests = getTests(siteId)
    const passingTests = tests.filter(t => t.status === "passing").length
    const failingTests = tests.filter(t => t.status === "failing").length

    return {
        totalTests: tests.length,
        passingTests,
        failingTests,
        uptime: 99.2,
        avgResponseTime: 245, // ms
        totalErrors: 12,
    }
}

/**
 * Busca dados de todos os sites monitorados
 */
export function getAllMonitoredSites(): MonitoringSite[] {
    return [
        getSiteInfo("youtube"),
    ]
}
