import { useState, useEffect } from "react"
import { useNavigate } from "react-router"
import { Plus, ExternalLink, Globe, RefreshCw } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import { LinkCreateModal } from "./LinkCreate"
import { monitoringApi, type MonitoredSite } from "@/features/dashboard/services/monitoringApi"
import { useToast } from "@/shared/hooks/use-toast"

interface SiteWithStatus extends MonitoredSite {
  status: "online" | "offline" | "unknown"
  uptime: number
  lastChecked: string | null
}

export default function Monitoring() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [sites, setSites] = useState<SiteWithStatus[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  const { toast } = useToast()

  const statusColors = {
    online: "bg-green-500/10 text-green-500 border-green-500/20",
    offline: "bg-red-500/10 text-red-500 border-red-500/20",
    unknown: "bg-gray-500/10 text-gray-500 border-gray-500/20",
  }

  const fetchSites = async () => {
    try {
      setIsLoading(true)
      const sitesData = await monitoringApi.listSites()

      const sitesWithStatus = await Promise.all(
        sitesData.map(async (site) => {
          try {
            const logs = await monitoringApi.getMonitorLogs(site.id, 10)

            if (logs.length === 0) {
              return {
                ...site,
                status: "unknown" as const,
                uptime: 0,
                lastChecked: null,
              }
            }

            const upCount = logs.filter((log) => log.status === "UP").length
            const uptime = (upCount / logs.length) * 100

            return {
              ...site,
              status: logs[0].status === "UP" ? ("online" as const) : ("offline" as const),
              uptime,
              lastChecked: logs[0].createdAt,
            }
          } catch {
            return {
              ...site,
              status: "unknown" as const,
              uptime: 0,
              lastChecked: null,
            }
          }
        })
      )

      setSites(sitesWithStatus)
    } catch (error: any) {
      toast({
        title: "Erro ao carregar sites",
        description: error?.response?.data?.error || "Não foi possível carregar os sites.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSites()
  }, [])

  const handleSiteClick = (siteId: number) => {
    navigate(`/dashboard/monitorar/${siteId}`)
  }

  const handleSiteCreated = () => {
    fetchSites()
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-foreground">Monitoramento</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={fetchSites} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
          <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Novo Monitoramento
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <RefreshCw className="mx-auto h-12 w-12 text-muted-foreground mb-4 animate-spin" />
            <p className="text-sm text-muted-foreground">Carregando sites...</p>
          </div>
        </div>
      ) : sites.length === 0 ? (
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <Globe className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhum site monitorado</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Comece adicionando um site para monitorar
            </p>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Site
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sites.map((site) => (
            <Card
              key={site.id}
              className="cursor-pointer transition-all hover:shadow-md hover:border-primary/50"
              onClick={() => handleSiteClick(site.id)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Globe className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{site.nome}</CardTitle>
                      <a
                        href={site.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="mt-1 flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                      >
                        {new URL(site.url).hostname}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                  <Badge className={statusColors[site.status]} variant="outline">
                    {site.status === "online" ? "Online" : site.status === "offline" ? "Offline" : "Desconhecido"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Uptime</span>
                    <span className="font-medium">{site.uptime.toFixed(1)}%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Última verificação</span>
                    <span className="font-medium text-xs">
                      {site.lastChecked
                        ? new Date(site.lastChecked).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <LinkCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleSiteCreated}
      />
    </div>
  )
}
