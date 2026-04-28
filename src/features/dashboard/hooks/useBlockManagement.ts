import { useState, useCallback, useMemo } from "react"
import { useBlocksForm } from "../context/BlocksFormContext"

export type BlockType = "goto" | "click" | "type"

export type Block = {
    id: string
    type: BlockType
    label: string
}

export function useBlockManagement() {
    const [blocks, setBlocks] = useState<Block[]>([])
    const { getParams } = useBlocksForm()

    const addBlock = useCallback((type: BlockType) => {
        const defaults: Record<BlockType, string> = {
            goto: "Ir para",
            click: "Clicar em",
            type: "Digitar",
        }
        setBlocks((prev) => [
            ...prev,
            {
                id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
                type,
                label: defaults[type],
            },
        ])
    }, [])

    const removeBlock = useCallback((id: string) => {
        setBlocks((prev) => prev.filter((b) => b.id !== id))
    }, [])

    const moveBlock = useCallback((id: string, direction: "left" | "right") => {
        setBlocks((prev) => {
            const index = prev.findIndex((b) => b.id === id)
            if (index === -1) return prev
            const targetIndex = direction === "left" ? index - 1 : index + 1
            if (targetIndex < 0 || targetIndex >= prev.length) return prev
            const newBlocks = [...prev]
            const [moved] = newBlocks.splice(index, 1)
            newBlocks.splice(targetIndex, 0, moved)
            return newBlocks
        })
    }, [])

    const getPreviousClickBlocksForIndex = useCallback(
        (index: number): Array<{ selector: string }> => {
            const previousBlocks = blocks.slice(0, index)
            return previousBlocks
                .filter((b) => b.type === "click")
                .map((b) => {
                    const params = getParams<{ selector?: string }>(b.id)
                    return { selector: params.selector || "" }
                })
                .filter((b) => b.selector.trim() !== "")
        },
        [blocks, getParams],
    )

    const hasBlocks = useMemo(() => blocks.length > 0, [blocks])

    return {
        blocks,
        setBlocks,
        addBlock,
        removeBlock,
        moveBlock,
        getPreviousClickBlocksForIndex,
        hasBlocks,
    }
}
