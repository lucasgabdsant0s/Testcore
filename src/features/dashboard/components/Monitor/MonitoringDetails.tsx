import { useParams, useNavigate } from "react-router"
import { RefreshCw } from "lucide-react"
import { MonitoringHeader } from "./components/MonitoringHeader"
import { SiteStatsCard } from "./components/SiteStatsCard"
import { ResponseTimeList } from "./components/ResponseTimeList"
import { AccessibilityChart } from "./charts/AccessibilityChart"

import { useMonitoringData } from "@/features/dashboard/hooks/useMonitoringData"

export default function MonitoringDetails() {
    const { siteId } = useParams<{ siteId: string }>()
    const navigate = useNavigate()

    const {
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
    } = useMonitoringData(siteId)

    if (!siteId) {
        navigate("/dashboard/monitorar")
        return null
    }

    if (isLoading) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    if (!site) {
        return null
    }

    const isOnline = logs.length > 0 && logs[0].status === "UP"

    return (
        <div className="space-y-6">
            <MonitoringHeader
                isLoading={isLoading}
                isMonitoring={isMonitoring}
                isActionLoading={isActionLoading}
                onBack={() => navigate("/dashboard/monitorar")}
                onRefresh={fetchData}
                onStart={handleStartMonitoring}
                onStop={handleStopMonitoring}
                onDelete={handleDeleteSite}
            />

            <SiteStatsCard
                site={site}
                stats={stats}
                isOnline={isOnline}
                isMonitoring={isMonitoring}
            />

            <div className="space-y-6">
                <AccessibilityChart data={logs} />
                <ResponseTimeList logs={logs} />
            </div>

        </div>
    )
}
