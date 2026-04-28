import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog"
import { Label } from "@/shared/components/ui/label"
import { Input } from "@/shared/components/ui/input"
import { Button } from "@/shared/components/ui/button"

interface SaveTestModalProps {
    isOpen: boolean
    testName: string
    isSaving: boolean
    onClose: () => void
    onSave: () => void
    onTestNameChange: (name: string) => void
}

export function SaveTestModal({
    isOpen,
    testName,
    isSaving,
    onClose,
    onSave,
    onTestNameChange,
}: SaveTestModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Salvar Teste</DialogTitle>
                    <DialogDescription>
                        Dê um nome para o seu teste
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="test-name">Nome do teste</Label>
                        <Input
                            id="test-name"
                            placeholder="Ex: Fluxo Completo de Registro"
                            value={testName}
                            onChange={(e) => onTestNameChange(e.target.value)}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button onClick={onSave} disabled={!testName.trim() || isSaving}>
                        {isSaving ? "Salvando..." : "Salvar"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
