import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { monitoringApi } from "@/features/dashboard/services/monitoringApi"
import { useToast } from "@/shared/hooks/use-toast"

interface LinkCreateModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess?: () => void
}

export function LinkCreateModal({ isOpen, onClose, onSuccess }: LinkCreateModalProps) {
    const [url, setUrl] = useState("")
    const [nome, setNome] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()

    const handleSubmit = async () => {
        if (!url.trim() || !nome.trim()) return
        try {
            new URL(url)
        } catch {
            toast({
                title: "URL inválida",
                description: "Por favor, insira uma URL válida (ex: https://exemplo.com)",
                variant: "destructive",
            })
            return
        }

        setIsLoading(true)
        try {
            await monitoringApi.createSite({ url: url.trim(), nome: nome.trim() })

            toast({
                title: "Site criado!",
                description: `${nome} foi adicionado ao monitoramento.`,
            })

            handleClose()
            onSuccess?.()
        } catch (error: any) {
            toast({
                title: "Erro ao criar site",
                description: error?.response?.data?.error || "Não foi possível criar o site. Tente novamente.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleClose = () => {
        if (isLoading) return
        setUrl("")
        setNome("")
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Criar Novo Monitoramento</DialogTitle>
                    <DialogDescription>
                        Adicione um site para monitorar sua disponibilidade
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="nome">Nome do Site</Label>
                        <Input
                            id="nome"
                            placeholder="Meu Site"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="url">URL do Site</Label>
                        <Input
                            id="url"
                            placeholder="https://"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            type="url"
                            disabled={isLoading}
                        />
                        <p className="text-xs text-muted-foreground">
                            O sistema verificará a disponibilidade deste site a cada 30 segundos
                        </p>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={handleClose} disabled={isLoading}>
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={!url.trim() || !nome.trim() || isLoading}
                    >
                        {isLoading ? "Criando..." : "Criar Monitoramento"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
