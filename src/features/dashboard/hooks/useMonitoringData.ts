import { useState, useEffect } from "react"
import { useNavigate } from "react-router"
import { monitoringApi, type MonitoredSite, type MonitorLog } from "@/features/dashboard/services/monitoringApi"
import { useToast } from "@/shared/hooks/use-toast"

export interface SiteStats {
    uptime: number
    avgResponseTime: number
    totalChecks: number
    downtimeCount: number
}

export function useMonitoringData(siteId: string | undefined) {
    const navigate = useNavigate()
    const { toast } = useToast()

    const [site, setSite] = useState<MonitoredSite | null>(null)
    const [logs, setLogs] = useState<MonitorLog[]>([])
    const [stats, setStats] = useState<SiteStats | null>(null)
    const [isMonitoring, setIsMonitoring] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [isActionLoading, setIsActionLoading] = useState(false)

    const calculateStats = (logsData: MonitorLog[]): SiteStats => {
        if (logsData.length === 0) {
            return {
                uptime: 0,
                avgResponseTime: 0,
                totalChecks: 0,
                downtimeCount: 0,
            }
        }

        const upCount = logsData.filter((log) => log.status === "UP").length
        const downCount = logsData.length - upCount
        const avgTime = logsData.reduce((sum, log) => sum + log.responseTimeMs, 0) / logsData.length

        return {
            uptime: (upCount / logsData.length) * 100,
            avgResponseTime: Math.round(avgTime),
            totalChecks: logsData.length,
            downtimeCount: downCount,
        }
    }

    const fetchData = async () => {
        if (!siteId) return

        try {
            setIsLoading(true)
            const [siteData, logsData, statusData] = await Promise.all([
                monitoringApi.getSite(Number(siteId)),
                monitoringApi.getMonitorLogs(Number(siteId), 100),
                monitoringApi.getMonitoringStatus(Number(siteId)),
            ])

            setSite(siteData)
            setLogs(logsData)
            setIsMonitoring(statusData.isMonitoring)
            setStats(calculateStats(logsData))
        } catch (error: any) {
            toast({
                title: "Erro ao carregar dados",
                description: error?.response?.data?.error || "Não foi possível carregar os dados do site.",
                variant: "destructive",
            })
            navigate("/dashboard/monitorar")
        } finally {
            setIsLoading(false)
        }
    }

    const handleStartMonitoring = async () => {
        if (!siteId) return
        setIsActionLoading(true)
        try {
            await monitoringApi.startMonitoring(Number(siteId))
            await fetchData()
            toast({
                title: "Monitoramento iniciado",
                description: "Teste de acessibilidade iniciado com sucesso.",
            })
        } catch (error: any) {
            toast({
                title: "Erro ao iniciar monitoramento",
                description: error?.response?.data?.error || "Não foi possível iniciar o monitoramento.",
                variant: "destructive",
            })
        } finally {
            setIsActionLoading(false)
        }
    }

    const handleStopMonitoring = async () => {
        if (!siteId) return
        setIsActionLoading(true)
        try {
            await monitoringApi.stopMonitoring(Number(siteId))
            await fetchData()
            toast({
                title: "Monitoramento parado",
                description: "O monitoramento foi interrompido.",
            })
        } catch (error: any) {
            toast({
                title: "Erro ao parar monitoramento",
                description: error?.response?.data?.error || "Não foi possível parar o monitoramento.",
                variant: "destructive",
            })
        } finally {
            setIsActionLoading(false)
        }
    }

    const handleDeleteSite = async () => {
        if (!siteId || !site) return

        if (!confirm(`Tem certeza que deseja excluir "${site.nome}"? Esta ação não pode ser desfeita.`)) {
            return
        }

        setIsActionLoading(true)
        try {
            await monitoringApi.deleteSite(Number(siteId))
            toast({
                title: "Site excluído",
                description: `${site.nome} foi removido do monitoramento.`,
            })
            navigate("/dashboard/monitorar")
        } catch (error: any) {
            toast({
                title: "Erro ao excluir site",
                description: error?.response?.data?.error || "Não foi possível excluir o site.",
                variant: "destructive",
            })
            setIsActionLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
        const interval = setInterval(fetchData, 30000)
        return () => clearInterval(interval)
    }, [siteId])

    return {
        site,
        logs,
        stats,
        isMonitoring,
        isLoading,
        isActionLoading,
        fetchData,
        handleStartMonitoring,
        handleStopMonitoring,
        handleDeleteSite,
    }
}
