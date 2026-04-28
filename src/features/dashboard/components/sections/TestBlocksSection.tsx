import { AddBlockMenu } from "./AddBlockMenu"
import { BlockList } from "./BlockList"
import type { Block, BlockType } from "../../hooks/useBlockManagement"

interface TestBlocksSectionProps {
    blocks: Block[]
    onAddBlock: (type: BlockType) => void
    removeBlock: (id: string) => void
    moveBlock: (id: string, direction: "left" | "right") => void
    getPreviousClickBlocksForIndex: (index: number) => Array<{ selector: string }>
}

export function TestBlocksSection({
    blocks,
    onAddBlock,
    removeBlock,
    moveBlock,
    getPreviousClickBlocksForIndex,
}: TestBlocksSectionProps) {
    return (
        <section className="rounded-lg border bg-card">
            <div className="border-b px-4 py-3">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    Blocos de teste
                </h2>
            </div>
            <div className="px-4 py-4 space-y-4">
                <div className="flex items-center justify-between">
                    <AddBlockMenu onAddBlock={onAddBlock} />
                    <div className="text-xs text-muted-foreground">
                        Monte sua rotina adicionando blocos
                    </div>
                </div>

                <BlockList
                    blocks={blocks}
                    removeBlock={removeBlock}
                    moveBlock={moveBlock}
                    getPreviousClickBlocksForIndex={getPreviousClickBlocksForIndex}
                />
            </div>
        </section>
    )
}
