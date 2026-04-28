import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import { ExternalLink, Globe } from "lucide-react"
import type { MonitoringSite, MonitoringStats } from "../types"

interface SiteHeaderProps {
    site: MonitoringSite
    stats: MonitoringStats
}

export function SiteHeader({ site, stats }: SiteHeaderProps) {
    const statusColors = {
        online: "bg-green-500/10 text-green-500 border-green-500/20",
        offline: "bg-red-500/10 text-red-500 border-red-500/20",
        warning: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                            <Globe className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-2xl">{site.name}</CardTitle>
                            <a
                                href={site.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-1 flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
                            >
                                {site.url}
                                <ExternalLink className="h-3 w-3" />
                            </a>
                        </div>
                    </div>
                    <Badge className={statusColors[site.status]}>
                        {site.status === "online" ? "Online" : site.status === "offline" ? "Offline" : "Atenção"}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Uptime</p>
                        <p className="text-2xl font-bold">{stats.uptime.toFixed(1)}%</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Total de Testes</p>
                        <p className="text-2xl font-bold">{stats.totalTests}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Testes Passando</p>
                        <p className="text-2xl font-bold text-green-500">{stats.passingTests}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Total de Erros</p>
                        <p className="text-2xl font-bold text-red-500">{stats.totalErrors}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
