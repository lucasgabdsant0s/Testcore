import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"

interface DeleteSiteModalProps {
    isOpen: boolean
    activeLink: { label: string } | null | undefined
    onClose: () => void
    onConfirm: () => void
}

export function DeleteSiteModal({ isOpen, activeLink, onClose, onConfirm }: DeleteSiteModalProps) {
    if (!isOpen || !activeLink) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4" onClick={onClose}>
            <div className="w-full max-w-md" onClick={(event) => event.stopPropagation()}>
                <Card className="w-full gap-0 p-2 sm:p-4">
                    <CardHeader className="px-6 pb-0 sm:px-8">
                        <CardTitle>Confirmar exclusão</CardTitle>
                    </CardHeader>
                    <CardContent className="px-6 sm:px-8">
                        <p className="text-sm text-muted-foreground">
                            Tem certeza que deseja deletar o site <span className="font-medium text-foreground">"{activeLink.label}"</span>?
                        </p>
                    </CardContent>
                    <CardFooter className="justify-end gap-3 px-6 pb-0 pt-1 sm:px-8 sm:pt-2">
                        <Button type="button" variant="outline" onClick={onClose} className="px-5">
                            Cancelar
                        </Button>
                        <Button type="button" variant="destructive" onClick={onConfirm} className="px-5">
                            Confirmar
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
