import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import { CheckCircle2, XCircle, Clock } from "lucide-react"
import type { Test } from "../types"

interface TestsListProps {
    tests: Test[]
}

export function TestsList({ tests }: TestsListProps) {
    const statusConfig = {
        passing: {
            icon: CheckCircle2,
            label: "Passando",
            className: "bg-green-500/10 text-green-500 border-green-500/20",
        },
        failing: {
            icon: XCircle,
            label: "Falhando",
            className: "bg-red-500/10 text-red-500 border-red-500/20",
        },
        pending: {
            icon: Clock,
            label: "Pendente",
            className: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
        },
    }

    const formatTimestamp = (timestamp?: string) => {
        if (!timestamp) return "Nunca executado"
        const date = new Date(timestamp)
        const now = new Date()
        const diffMs = now.getTime() - date.getTime()
        const diffMins = Math.floor(diffMs / 60000)

        if (diffMins < 1) return "Agora mesmo"
        if (diffMins < 60) return `${diffMins}m atrás`

        const diffHours = Math.floor(diffMins / 60)
        if (diffHours < 24) return `${diffHours}h atrás`

        const diffDays = Math.floor(diffHours / 24)
        return `${diffDays}d atrás`
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Testes Disponíveis</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {tests.map((test) => {
                        const config = statusConfig[test.status]
                        const Icon = config.icon

                        return (
                            <div
                                key={test.id}
                                className="flex items-start gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-accent/50"
                            >
                                <Icon className={`h-5 w-5 mt-0.5 ${test.status === "passing" ? "text-green-500" : test.status === "failing" ? "text-red-500" : "text-yellow-500"}`} />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <p className="font-medium text-sm">{test.name}</p>
                                        <Badge className={config.className} variant="outline">
                                            {config.label}
                                        </Badge>
                                    </div>
                                    {test.description && (
                                        <p className="text-xs text-muted-foreground mb-1">{test.description}</p>
                                    )}
                                    <p className="text-xs text-muted-foreground">
                                        Última execução: {formatTimestamp(test.lastRun)}
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )
}
