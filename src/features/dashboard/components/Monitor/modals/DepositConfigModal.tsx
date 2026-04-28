import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Loader2 } from "lucide-react"

interface DepositConfigModalProps {
    isOpen: boolean
    onClose: () => void
    onSave: (config: { endpoint: string; id: string; amount: number }) => Promise<void>
    initialConfig?: { endpoint: string; id: string; amount: number }
}

export function DepositConfigModal({ isOpen, onClose, onSave, initialConfig }: DepositConfigModalProps) {
    const [endpoint, setEndpoint] = useState(initialConfig?.endpoint || "https://slotbetpix.io/payment/deposit")
    const [id, setId] = useState(initialConfig?.id || "1")
    const [amount, setAmount] = useState(initialConfig?.amount || 10)
    const [isSaving, setIsSaving] = useState(false)
    const [errors, setErrors] = useState<{ endpoint?: string; id?: string; amount?: string }>({})

    const validateForm = () => {
        const newErrors: { endpoint?: string; id?: string; amount?: string } = {}

        if (!endpoint.trim()) {
            newErrors.endpoint = "Endpoint é obrigatório"
        } else if (!endpoint.startsWith("http://") && !endpoint.startsWith("https://")) {
            newErrors.endpoint = "Endpoint deve começar com http:// ou https://"
        }

        if (!id.trim()) {
            newErrors.id = "ID é obrigatório"
        }

        if (!amount || amount <= 0) {
            newErrors.amount = "Valor deve ser maior que 0"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSave = async () => {
        if (!validateForm()) return

        setIsSaving(true)
        try {
            await onSave({ endpoint, id, amount })
            onClose()
        } catch (error) {
            console.error("Erro ao salvar configuração:", error)
        } finally {
            setIsSaving(false)
        }
    }

    const handleClose = () => {
        if (!isSaving) {
            setErrors({})
            onClose()
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Configurar Teste de Depósito</DialogTitle>
                    <DialogDescription>
                        Configure o endpoint da API de depósito e os parâmetros do teste. Essas configurações serão salvas para este site.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="endpoint">Endpoint da API</Label>
                        <Input
                            id="endpoint"
                            placeholder="https://exemplo.com/payment/deposit"
                            value={endpoint}
                            onChange={(e) => setEndpoint(e.target.value)}
                            disabled={isSaving}
                        />
                        {errors.endpoint && (
                            <p className="text-sm text-destructive">{errors.endpoint}</p>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="id">ID</Label>
                        <Input
                            id="id"
                            placeholder="1"
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                            disabled={isSaving}
                        />
                        {errors.id && (
                            <p className="text-sm text-destructive">{errors.id}</p>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="amount">Valor do Depósito (para teste)</Label>
                        <Input
                            id="amount"
                            type="number"
                            min="1"
                            step="1"
                            placeholder="10"
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                            disabled={isSaving}
                        />
                        {errors.amount && (
                            <p className="text-sm text-destructive">{errors.amount}</p>
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={handleClose} disabled={isSaving}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Salvar e Iniciar Teste
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
