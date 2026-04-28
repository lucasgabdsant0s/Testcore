import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Keyboard } from "lucide-react"
import { BlockCard } from "./BlockCard"
import { useBlocksForm } from "../../context/BlocksFormContext"
import { Button } from "@/shared/components/ui/button"
import { useElementPicker } from "../../context/ElementPickerContext"
import { useDashboardLinks } from "../../context/DashboardLinksContext"
import { apiClient } from "@/shared/lib/api-client"
import { useState, memo } from "react"

type TypeBlockProps = {
  blockId: string
  onRemove: (id: string) => void
  getPreviousClickBlocks?: () => Array<{ selector: string }>
  onMoveUp?: () => void
  onMoveDown?: () => void
  canMoveUp?: boolean
  canMoveDown?: boolean
}

export const TypeBlock = memo(function TypeBlock({ blockId, onRemove, getPreviousClickBlocks, onMoveUp, onMoveDown, canMoveUp, canMoveDown }: TypeBlockProps) {
  const { getParams, setParams } = useBlocksForm()
  const params = getParams<{ selector?: string; text?: string; phone?: string; password?: string }>(blockId)
  const selector = params.selector ?? ""
  const { startPicking, isPicking } = useElementPicker()
  const { activeLink } = useDashboardLinks()
  const [resolving, setResolving] = useState(false)

  return (
    <BlockCard
      title="Digitar"
      icon={<Keyboard className="size-4" />}
      onRemove={() => onRemove(blockId)}
      onMoveUp={onMoveUp}
      onMoveDown={onMoveDown}
      canMoveUp={canMoveUp}
      canMoveDown={canMoveDown}
    >
      <div className="space-y-4 flex-1">
        <div className="space-y-1">
          <Label htmlFor="type-selector">Alvo (id, classe, atributo)</Label>
          <Input
            id="type-selector"
            placeholder='#id, .classe ou input[type="password"]'
            value={selector}
            onChange={(e) => setParams(blockId, { selector: e.target.value })}
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Texto</Label>
          <div className="flex gap-2">
            <Input
              placeholder="Texto"
              value={params.text || ''}
              onChange={(e) => setParams(blockId, { text: e.target.value })}
            />
            <Button
              type="button"
              size="icon"
              variant="outline"
              className="shrink-0"
              onClick={() => {
                const ddd = ['11', '12', '13', '14', '15', '16', '17', '18', '19', '21', '22', '24', '27', '28', '31', '32', '33', '34', '35', '37', '38', '41', '42', '43', '44', '45', '46', '47', '48', '49', '51', '53', '54', '55', '61', '62', '63', '64', '65', '66', '67', '68', '69', '71', '73', '74', '75', '77', '79', '81', '82', '83', '84', '85', '86', '87', '88', '89', '91', '92', '93', '94', '95', '96', '97', '98', '99']
                const randomDDD = ddd[Math.floor(Math.random() * ddd.length)]
                const randomNumber = '9' + Array.from({ length: 8 }, () => Math.floor(Math.random() * 10)).join('')
                const formattedPhone = `(${randomDDD}) ${randomNumber.slice(0, 5)}-${randomNumber.slice(5)}`
                setParams(blockId, { phone: formattedPhone, text: formattedPhone })
              }}
              title="Gerar Telefone"
            >
              <span className="text-xs font-bold">#</span>
            </Button>
          </div>
        </div>


      </div>

      <div className="mt-4">
        <Button
          size="sm"
          variant={isPicking || resolving ? "secondary" : "outline"}
          className="w-full"
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