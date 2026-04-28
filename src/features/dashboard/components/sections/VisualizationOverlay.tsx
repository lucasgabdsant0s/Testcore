import { useRef } from "react"
import { useElementPicker } from "../../context/ElementPickerContext"

export function VisualizationOverlay() {
    const { isPicking, completePicking, cancelPicking } = useElementPicker()
    const containerRef = useRef<HTMLDivElement | null>(null)

    function handleClick(event: React.MouseEvent<HTMLDivElement>) {
        if (!isPicking || !containerRef.current) return
        const rect = containerRef.current.getBoundingClientRect()
        const x = Math.min(Math.max(event.clientX - rect.left, 0), rect.width)
        const y = Math.min(Math.max(event.clientY - rect.top, 0), rect.height)
        const xp = Math.round((x / rect.width) * 100)
        const yp = Math.round((y / rect.height) * 100)

        completePicking(`point(${xp}%,${yp}%)`)
    }

    if (!isPicking) {
        return <div ref={containerRef} className="relative h-full w-full" />
    }

    return (
        <div ref={containerRef} className="relative h-full w-full" onClick={handleClick}>
            <div className="pointer-events-auto absolute inset-0 z-20 cursor-crosshair bg-background/10 backdrop-blur-[1px]" />
            <div className="pointer-events-none absolute left-1/2 top-2 z-30 -translate-x-1/2 rounded-md bg-background/90 px-2 py-1 text-xs shadow">
                Modo seleção: clique em um ponto da página
                <span className="ml-2 text-muted-foreground">(Esc para cancelar)</span>
            </div>
            <div
                className="sr-only"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === "Escape") cancelPicking()
                }}
            />
        </div>
    )
}
