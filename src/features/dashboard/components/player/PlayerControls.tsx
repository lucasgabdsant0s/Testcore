interface PlayerControlsProps {
    isPlaying: boolean
    currentFrame: number
    totalFrames: number
    onPlay: () => void
    onRestart: () => void
    onDelete: () => void
    onFrameChange: (frame: number) => void
}

export function PlayerControls({
    isPlaying,
    currentFrame,
    totalFrames,
    onPlay,
    onRestart,
    onDelete,
    onFrameChange,
}: PlayerControlsProps) {
    return (
        <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg">
            <button
                onClick={onPlay}
                className="bg-green-600 hover:bg-green-700 text-white border-none px-5 py-2.5 rounded-md cursor-pointer text-base transition-colors"
            >
                {isPlaying ? 'Pausar' : 'Play'}
            </button>
            <button
                onClick={onRestart}
                className="bg-green-600 hover:bg-green-700 text-white border-none px-5 py-2.5 rounded-md cursor-pointer text-base transition-colors"
            >
                Reiniciar
            </button>
            <button
                onClick={onDelete}
                className="bg-red-600 hover:bg-red-700 text-white border-none px-5 py-2.5 rounded-md cursor-pointer text-base transition-colors"
            >
                Excluir
            </button>
            <div className="text-white text-sm ml-auto">
                Frame {currentFrame + 1} de {totalFrames}
            </div>
            <input
                type="range"
                min="0"
                max={totalFrames - 1}
                value={currentFrame}
                onChange={(e) => onFrameChange(parseInt(e.target.value))}
                className="flex-1 mx-3"
            />
        </div>
    )
}
