import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import type { MonitoredSite } from "@/features/dashboard/services/monitoringApi"
import type { SiteStats } from "@/features/dashboard/hooks/useMonitoringData"
import type { TestType } from "@/features/dashboard/types/TestTypes"

interface SiteStatsCardProps {
    site: MonitoredSite
    stats: SiteStats | null
    isOnline: boolean
    isMonitoring: boolean
    testType?: TestType
}

export function SiteStatsCard({ site, stats, isOnline, isMonitoring, testType = 'access' }: SiteStatsCardProps) {
    const statsLabels = {
        access: {
            uptimeLabel: "Uptime",
            avgTimeLabel: "Tempo Médio",
            totalChecksLabel: "Total de Verificações",
            downtimeLabel: "Períodos Offline"
        },
        deposit: {
            uptimeLabel: "Taxa de Sucesso",
            avgTimeLabel: "Tempo Médio da API",
            totalChecksLabel: "Total de Testes",
            downtimeLabel: "Falhas"
        }
    }

    const labels = statsLabels[testType]

    const statusColor = isOnline
        ? "bg-green-500/10 text-green-500 border-green-500/20"
        : "bg-red-500/10 text-red-500 border-red-500/20"

    return (
        <Card>
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div>
                        <CardTitle className="text-2xl">{site.nome}</CardTitle>
                        <CardDescription className="mt-1">
                            <a href={site.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                {site.url}
                            </a>
                        </CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <Badge className={statusColor} variant="outline">
                            {isOnline ? "Online" : "Offline"}
                        </Badge>
                        <Badge variant="outline">
                            {isMonitoring ? "Monitorando" : "Pausado"}
                        </Badge>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4 md:grid-cols-4">
                    <div>
                        <p className="text-sm text-muted-foreground">{labels.uptimeLabel}</p>
                        <p className="text-2xl font-bold">{stats?.uptime.toFixed(1)}%</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">{labels.avgTimeLabel}</p>
                        <p className="text-2xl font-bold">{stats?.avgResponseTime}ms</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">{labels.totalChecksLabel}</p>
                        <p className="text-2xl font-bold">{stats?.totalChecks}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">{labels.downtimeLabel}</p>
                        <p className="text-2xl font-bold">{stats?.downtimeCount}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
