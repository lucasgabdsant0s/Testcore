export type TestType = 'access' | 'deposit'

export interface DepositConfig {
    endpoint: string
    id: string
    amount: number
}

export interface DepositTestResult {
    success: boolean
    responseTimeMs: number
    error?: string
}
