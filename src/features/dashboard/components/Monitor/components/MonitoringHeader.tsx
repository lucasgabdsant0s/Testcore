import { ArrowLeft, Play, Square, Trash2, RefreshCw } from "lucide-react"
import { Button } from "@/shared/components/ui/button"


interface MonitoringHeaderProps {
    isLoading: boolean
    isMonitoring: boolean
    isActionLoading: boolean
    onDelete: () => void
}

export function MonitoringHeader({
    isLoading,
    isMonitoring,
    isActionLoading,
    onDelete,
}: MonitoringHeaderProps) {
    return (
        <div className="flex items-center justify-between gap-4">
            <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="gap-2"
            >
                <ArrowLeft className="h-4 w-4" />
                Voltar para Monitoramento
            </Button>


            <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={onRefresh} disabled={isLoading}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                    Atualizar
                </Button>
                {isMonitoring ? (
                    <Button variant="destructive" size="sm" onClick={onStop} disabled={isActionLoading}>
                        <Square className="h-4 w-4 mr-2" />
                        Parar
                    </Button>
                ) : (
                    <Button size="sm" onClick={onStart} disabled={isActionLoading}>
                        <Play className="h-4 w-4 mr-2" />
                        Iniciar
                    </Button>
                )}
                <Button variant="outline" size="sm" onClick={onDelete} disabled={isActionLoading}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir
                </Button>
            </div>
        </div>
    )
}
