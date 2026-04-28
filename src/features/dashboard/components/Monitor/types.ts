export type ChartType = "area" | "line" | "bar" | "pie"

export interface ChartDataPoint {
    date: string
    value: number
    label?: string
}

export interface MonitoringSite {
    id: string
    name: string
    url: string
    status: "online" | "offline" | "warning"
    uptime: number
    lastChecked: string
}

export interface Test {
    id: string
    name: string
    status: "passing" | "failing" | "pending"
    lastRun?: string
    description?: string
}

export interface MonitoringStats {
    totalTests: number
    passingTests: number
    failingTests: number
    uptime: number
    avgResponseTime: number
    totalErrors: number
}

export interface AccessibilityData {
    timestamp: string
    uptime: number
}

export interface LoginData {
    timestamp: string
    successRate: number
    successful: number
    failed: number
}

export interface ErrorData {
    timestamp: string
    count: number
    severity?: "low" | "medium" | "high"
}
