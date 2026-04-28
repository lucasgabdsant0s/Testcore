import type { ReactNode } from "react"
import { Card } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { X, ChevronLeft, ChevronRight } from "lucide-react"

type BlockCardProps = {
  title: string
  icon: ReactNode
  onRemove: () => void
  children?: ReactNode
  onMoveUp?: () => void
  onMoveDown?: () => void
  canMoveUp?: boolean
  canMoveDown?: boolean
}

export function BlockCard({ title, icon, onRemove, children, onMoveUp, onMoveDown, canMoveUp, canMoveDown }: BlockCardProps) {
  return (
    <Card className="relative flex h-auto min-h-[14rem] w-[320px] shrink-0 flex-col rounded-md border bg-muted/30 p-3 overflow-hidden">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium">
          <span className="text-muted-foreground">{icon}</span>
          <span>{title}</span>
        </div>
        <div className="flex items-center gap-1">
          {onMoveUp && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 p-0"
              onClick={onMoveUp}
              aria-label="Mover bloco para a esquerda"
              disabled={!canMoveUp}
            >
              <ChevronLeft className="size-4" />
            </Button>
          )}
          {onMoveDown && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 p-0"
              onClick={onMoveDown}
              aria-label="Mover bloco para a direita"
              disabled={!canMoveDown}
            >
              <ChevronRight className="size-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 p-0"
            onClick={onRemove}
            aria-label="Remover bloco"
          >
            <X className="size-4" />
          </Button>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2">
        {children}
      </div>
    </Card>
  )
}

