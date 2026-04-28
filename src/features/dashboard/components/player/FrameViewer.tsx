interface FrameViewerProps {
    frames: string[]
    currentFrame: number
}

export function FrameViewer({ frames, currentFrame }: FrameViewerProps) {
    if (frames.length === 0) {
        return (
            <div className="text-gray-500 text-lg">Nenhum frame capturado</div>
        )
    }

    return (
        <img
            src={`http://localhost:3000${frames[currentFrame]}`}
            alt={`Frame ${currentFrame + 1}`}
            className="max-w-full max-h-[70vh] object-contain rounded-lg"
        />
    )
}
