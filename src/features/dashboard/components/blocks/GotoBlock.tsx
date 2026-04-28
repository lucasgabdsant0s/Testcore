import { memo } from "react"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Button } from "@/shared/components/ui/button"
import { ArrowRight } from "lucide-react"
import { BlockCard } from "./BlockCard"
import { useBlocksForm } from "../../context/BlocksFormContext"

type GotoBlockProps = {
  blockId: string
  onRemove: (id: string) => void
  onMoveUp?: () => void
  onMoveDown?: () => void
  canMoveUp?: boolean
  canMoveDown?: boolean
}

export const GotoBlock = memo(function GotoBlock({ blockId, onRemove, onMoveUp, onMoveDown, canMoveUp, canMoveDown }: GotoBlockProps) {
  const { getParams, setParams } = useBlocksForm()
  const params = getParams<{ url?: string }>(blockId)
  const url = params.url ?? ""

  return (
    <BlockCard
      title="Ir para"
      icon={<ArrowRight className="size-4" />}
      onRemove={() => onRemove(blockId)}
      onMoveUp={onMoveUp}
      onMoveDown={onMoveDown}
      canMoveUp={canMoveUp}
      canMoveDown={canMoveDown}
    >
      <div className="space-y-1">
        <Label htmlFor="goto-url">URL/rota</Label>
        <Input
          id="goto-url"
          placeholder="https://exemplo.com/pagina"
          value={url}
          onChange={(e) => setParams(blockId, { url: e.target.value })}
        />
      </div>
      <div className="mt-auto flex justify-end">
        <Button size="sm" variant="outline">Testar</Button>
      </div>
    </BlockCard>
  )
})


