import type { FormEvent } from "react"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Input } from "@/shared/components/ui/input"

interface CreateLinkModalProps {
    isOpen: boolean
    label: string
    url: string
    onLabelChange: (value: string) => void
    onUrlChange: (value: string) => void
    onSubmit: (event: FormEvent<HTMLFormElement>) => void
    onClose: () => void
}

export function CreateLinkModal({
    isOpen,
    label,
    url,
    onLabelChange,
    onUrlChange,
    onSubmit,
    onClose,
}: CreateLinkModalProps) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4" onClick={onClose}>
            <form onSubmit={onSubmit} className="w-full max-w-md" onClick={(event) => event.stopPropagation()}>
                <Card className="w-full gap-0 p-2 sm:p-4">
                    <CardHeader className="px-6 pb-0 sm:px-8">
                        <CardTitle>Cadastrar link</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5 px-6 sm:px-8">
                        <div className="space-y-2">
                            <label htmlFor="create-link-label" className="text-sm font-medium leading-none">
                                Apelido
                            </label>
                            <Input
                                id="create-link-label"
                                value={label}
                                onChange={(event) => onLabelChange(event.target.value)}
                                placeholder="Ex: Site principal"
                                autoComplete="off"
                                required
                                autoFocus
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="create-link-url" className="text-sm font-medium leading-none">
                                Url
                            </label>
                            <Input
                                id="create-link-url"
                                value={url}
                                onChange={(event) => onUrlChange(event.target.value)}
                                placeholder="https://"
                                autoComplete="off"
                                required
                                type="text"
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="justify-end gap-3 px-6 pb-0 pt-1 sm:px-8 sm:pt-2">
                        <Button type="button" variant="outline" onClick={onClose} className="px-5">
                            Cancelar
                        </Button>
                        <Button type="submit" className="px-5">
                            Confirmar
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    )
}
