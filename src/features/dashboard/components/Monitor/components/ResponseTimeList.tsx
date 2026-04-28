import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import type { MonitorLog } from "@/features/dashboard/services/monitoringApi"
import type { TestType } from "@/features/dashboard/types/TestTypes"

interface ResponseTimeListProps {
    logs: MonitorLog[]
}

export function ResponseTimeList({ logs }: ResponseTimeListProps) {
    const labels = {
        title: "Logs de Verificação",
        description: "Histórico das últimas verificações",
        emptyMessage: "Nenhum dado disponível. Inicie o monitoramento para ver os logs.",
        statusColumn: "Status"
    }

    if (logs.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>{labels.title}</CardTitle>
                    <CardDescription>Nenhuma verificação registrada</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex h-[200px] items-center justify-center text-muted-foreground">
                        {labels.emptyMessage}
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>{labels.title}</CardTitle>
                <CardDescription>{labels.description} - Últimas {logs.length} verificações</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    {logs.slice(0, 10).map((log) => (
                        <div key={log.id} className="flex items-center justify-between text-sm border-b pb-2">
                            <div className="flex flex-col gap-1">
                                <span className="text-muted-foreground">
                                    {new Date(log.createdAt).toLocaleString("pt-BR")}
                                </span>
                                {log.phoneNumber && (
                                    <span className="text-xs text-muted-foreground">
                                        Telefone: {log.phoneNumber}
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant={log.status === "UP" ? "default" : "destructive"} className="text-xs">
                                    {log.status}
                                </Badge>
                                <span className="font-medium">{log.responseTimeMs}ms</span>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
