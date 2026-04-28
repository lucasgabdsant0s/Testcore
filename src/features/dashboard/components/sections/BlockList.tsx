import { ScrollArea, ScrollBar } from "@/shared/components/ui/scroll-area"
import { ChevronsRight } from "lucide-react"
import { GotoBlock } from "../blocks/GotoBlock"
import { ClickBlock } from "../blocks/ClickBlock"
import { TypeBlock } from "../blocks/TypeBlock"
import type { Block } from "../../hooks/useBlockManagement"

interface BlockListProps {
    blocks: Block[]
    removeBlock: (id: string) => void
    moveBlock: (id: string, direction: "left" | "right") => void
    getPreviousClickBlocksForIndex: (index: number) => Array<{ selector: string }>
}

export function BlockList({
    blocks,
    removeBlock,
    moveBlock,
    getPreviousClickBlocksForIndex,
}: BlockListProps) {
    if (blocks.length === 0) {
        return (
            <ScrollArea className="w-full">
                <div className="inline-flex items-stretch gap-3 py-2 pr-4 whitespace-nowrap min-h-56">
                    <div className="flex h-56 w-[260px] shrink-0 items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
                        Nenhum bloco adicionado
                    </div>
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        )
    }

    return (
        <ScrollArea className="w-full">
            <div className="inline-flex items-stretch gap-3 py-2 pr-4 whitespace-nowrap min-h-56">
                {blocks.map((block, index) => {
                    const canMoveLeft = index > 0
                    const canMoveRight = index < blocks.length - 1
                    const getPreviousClickBlocks = () => getPreviousClickBlocksForIndex(index)

                    return (
                        <div key={block.id} className="inline-flex items-center gap-3">
                            {block.type === "goto" && (
                                <GotoBlock
                                    blockId={block.id}
                                    onRemove={removeBlock}
                                    onMoveUp={canMoveLeft ? () => moveBlock(block.id, "left") : undefined}
                                    onMoveDown={canMoveRight ? () => moveBlock(block.id, "right") : undefined}
                                    canMoveUp={canMoveLeft}
                                    canMoveDown={canMoveRight}
                                />
                            )}
                            {block.type === "click" && (
                                <ClickBlock
                                    blockId={block.id}
                                    onRemove={removeBlock}
                                    getPreviousClickBlocks={getPreviousClickBlocks}
                                    onMoveUp={canMoveLeft ? () => moveBlock(block.id, "left") : undefined}
                                    onMoveDown={canMoveRight ? () => moveBlock(block.id, "right") : undefined}
                                    canMoveUp={canMoveLeft}
                                    canMoveDown={canMoveRight}
                                />
                            )}
                            {block.type === "type" && (
                                <TypeBlock
                                    blockId={block.id}
                                    onRemove={removeBlock}
                                    getPreviousClickBlocks={getPreviousClickBlocks}
                                    onMoveUp={canMoveLeft ? () => moveBlock(block.id, "left") : undefined}
                                    onMoveDown={canMoveRight ? () => moveBlock(block.id, "right") : undefined}
                                    canMoveUp={canMoveLeft}
                                    canMoveDown={canMoveRight}
                                />
                            )}
                            {index < blocks.length - 1 && (
                                <div className="flex items-center justify-center shrink-0">
                                    <ChevronsRight className="size-6 text-muted-foreground" />
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
            <ScrollBar orientation="horizontal" />
        </ScrollArea>
    )
}
