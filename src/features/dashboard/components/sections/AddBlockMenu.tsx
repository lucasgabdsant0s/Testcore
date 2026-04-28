import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu"
import { Button } from "@/shared/components/ui/button"
import { Plus, ArrowRight, MousePointerClick, Keyboard } from "lucide-react"
import type { BlockType } from "../../hooks/useBlockManagement"

interface AddBlockMenuProps {
    onAddBlock: (type: BlockType) => void
}

export function AddBlockMenu({ onAddBlock }: AddBlockMenuProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                    <Plus className="size-4" />
                    Adicionar
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" sideOffset={6} className="w-40">
                <DropdownMenuLabel>Novo bloco</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onAddBlock("goto")} className="gap-2 cursor-pointer">
                    <ArrowRight className="size-4" />
                    Ir para
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onAddBlock("click")} className="gap-2 cursor-pointer">
                    <MousePointerClick className="size-4" />
                    Clicar em
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onAddBlock("type")} className="gap-2 cursor-pointer">
                    <Keyboard className="size-4" />
                    Digitar
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
