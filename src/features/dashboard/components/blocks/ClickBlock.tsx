import { useState, memo } from "react"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu"
import { MousePointerClick, ChevronDown } from "lucide-react"
import { BlockCard } from "./BlockCard"
import { useElementPicker } from "../../context/ElementPickerContext"
import { useDashboardLinks } from "../../context/DashboardLinksContext"
import { apiClient } from "@/shared/lib/api-client"
import { useBlocksForm } from "../../context/BlocksFormContext"

type ClickBlockProps = {
  blockId: string
  onRemove: (id: string) => void
  getPreviousClickBlocks?: () => Array<{ selector: string }>
  onMoveUp?: () => void
  onMoveDown?: () => void
  canMoveUp?: boolean
  canMoveDown?: boolean
}

const CLICK_TYPES = ["Simples", "Duplo", "Direito"] as const
type ClickType = typeof CLICK_TYPES[number]

export const ClickBlock = memo(function ClickBlock({ blockId, onRemove, getPreviousClickBlocks, onMoveUp, onMoveDown, canMoveUp, canMoveDown }: ClickBlockProps) {
  const { getParams, setParams } = useBlocksForm()
  const params = getParams<{ selector?: string; clickType?: ClickType }>(blockId)
  const selector = params.selector ?? ""
  const clickType = params.clickType ?? "Simples"
  const { startPicking, isPicking } = useElementPicker()
  const { activeLink } = useDashboardLinks()
  const [resolving, setResolving] = useState(false)

  return (
    <BlockCard
      title="Clicar em"
      icon={<MousePointerClick className="size-4" />}
      onRemove={() => onRemove(blockId)}
      onMoveUp={onMoveUp}
      onMoveDown={onMoveDown}
      canMoveUp={canMoveUp}
      canMoveDown={canMoveDown}
    >
      <div className="space-y-1">
        <Label htmlFor="click-selector">Alvo (id, classe)</Label>
        <Input
          id="click-selector"
          placeholder="#id ou .classe"
          value={selector}
          onChange={(e) => setParams(blockId, { selector: e.target.value })}
        />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Tipo de clique:</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="outline" className="gap-2">
              {clickType}
              <ChevronDown className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={6}>
            <DropdownMenuLabel>Selecionar</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {CLICK_TYPES.map((type) => (
              <DropdownMenuItem key={type} onClick={() => setParams(blockId, { clickType: type })} className="cursor-pointer">
                {type}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="mt-auto flex justify-end">
        <Button
          size="sm"
          variant={isPicking || resolving ? "secondary" : "outline"}
          className="gap-2"
          onClick={() => {
            startPicking((picked) => {
              const cleaned = picked?.trim()
              const match = cleaned?.match(/^point\((\d+)%?,\s*(\d+)%?\)$/i)
              if (!match) {
                console.warn("Coordenadas inválidas recebidas do picker:", picked)
                return
              }
              if (!activeLink?.url) {
                console.warn("Nenhum site ativo para resolver seletor.")
                return
              }
              
              const [, xs, ys] = match
              const xPercent = Number(xs)
              const yPercent = Number(ys)
              
              const preActions = getPreviousClickBlocks?.().map((block) => ({
                type: "click" as const,
                selector: block.selector,
                timeout: 5000,
              })) || []
              
              setResolving(true)
              setParams(blockId, { selector: "" })
              
              apiClient
                .post("/picker/resolve-from-point", {
                  url: activeLink.url,
                  xPercent,
                  yPercent,
                  preActions: preActions.length > 0 ? preActions : undefined,
                })
                .then((resp) => {
                  const data = resp.data ?? {}
                  const css = typeof data.css === "string" ? data.css.trim() : ""
                  const xpath = typeof data.xpath === "string" ? data.xpath.trim() : ""
                  const elementInfo = data.elementInfo as { id?: string; className?: string; tagName?: string } | undefined
                  let resolved = css || xpath
                  if (!resolved && elementInfo?.id) {
                    resolved = `#${elementInfo.id}`
                  }
                  if (!resolved && elementInfo?.className) {
                    const classes = elementInfo.className
                      .split(" ")
                      .map((c) => c.trim())
                      .filter(Boolean)
                    if (classes.length > 0) {
                      const tag = elementInfo.tagName ? elementInfo.tagName.toLowerCase() : "div"
                      resolved = `${tag}.${classes.join(".")}`
                    }
                  }
                  if (resolved) {
                    setParams(blockId, { selector: resolved })
                  } else {
                    console.warn("Não foi possível resolver o seletor para o ponto informado.")
                  }
                })
                .catch((error) => {
                  console.error("Falha ao resolver seletor pelo backend:", error)
                })
                .finally(() => setResolving(false))
            })
          }}
        >
          {isPicking ? "Selecionando..." : resolving ? "Resolvendo..." : "Selecionar na página"}
        </Button>
      </div>
    </BlockCard>
  )
})


