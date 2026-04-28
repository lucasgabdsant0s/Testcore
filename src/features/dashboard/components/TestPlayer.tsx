import React from "react"
import { FrameViewer } from "./player/FrameViewer"
import { PlayerControls } from "./player/PlayerControls"

interface TestPlayerProps {
    frames: string[]
    isOpen: boolean
    generatedPhone?: string
    generatedPassword?: string
    onClose: () => void
    onCleanup?: () => void
}

export function TestPlayer({ frames, isOpen, generatedPhone, generatedPassword, onClose, onCleanup }: TestPlayerProps) {
    const [currentFrame, setCurrentFrame] = React.useState(0)
    const [isPlaying, setIsPlaying] = React.useState(false)
    const intervalRef = React.useRef<NodeJS.Timeout | undefined>(undefined)

    React.useEffect(() => {
        if (isPlaying && frames.length > 0) {
            intervalRef.current = setInterval(() => {
                setCurrentFrame(prev => {
                    if (prev >= frames.length - 1) {
                        setIsPlaying(false)
                        return prev
                    }
                    return prev + 1
                })
            }, 500)
        } else {
            if (intervalRef.current) clearInterval(intervalRef.current)
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current)
        }
    }, [isPlaying, frames.length])

    React.useEffect(() => {
        if (isOpen) {
            setCurrentFrame(0)
            setIsPlaying(false)
        }
    }, [isOpen])

    if (!isOpen) return null

    const handlePlay = () => setIsPlaying(!isPlaying)
    const handleRestart = () => {
        setCurrentFrame(0)
        setIsPlaying(true)
    }

    const handleClose = async () => {
        console.log('[TestPlayer] Fechando modal e limpando screenshots via HTTP...')
        try {
            await fetch('http://localhost:3000/api/cleanup', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            console.log('[TestPlayer] Cleanup solicitado com sucesso')
        } catch (error) {
            console.error('[TestPlayer] Erro ao solicitar cleanup:', error)
        }

        if (onCleanup) {
            onCleanup()
        }
        onClose()
    }

    const handleDelete = () => {
        handleClose()
    }

    return (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[9999]">
            <div className="bg-[#1a1a1a] rounded-xl p-6 max-w-[90vw] max-h-[90vh] flex flex-col relative">
                <button
                    className="absolute top-3 right-3 bg-white/10 hover:bg-white/20 border-none text-white text-2xl w-10 h-10 rounded-full cursor-pointer transition-colors"
                    onClick={handleClose}
                >
                    ✕
                </button>

                <div className="flex-1 flex items-center justify-center mb-5 min-h-[400px]">
                    <FrameViewer frames={frames} currentFrame={currentFrame} />
                </div>

                {(generatedPhone || generatedPassword) && (
                    <div className="mb-6 p-4 bg-[#2a2a2a] rounded-xl border border-white/10 flex items-center gap-4 shadow-lg">
                        {generatedPhone && (
                            <div className="flex-1 flex items-center justify-between bg-black/20 p-3 rounded-lg border border-white/5">
                                <div>
                                    <div className="text-xs text-white/50 uppercase tracking-wider font-medium mb-1">Telefone</div>
                                    <div className="text-lg font-bold text-green-400 tracking-wide font-mono">{generatedPhone}</div>
                                </div>
                                <button
                                    onClick={() => navigator.clipboard.writeText(generatedPhone)}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/60 hover:text-white"
                                    title="Copiar telefone"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                    </svg>
                                </button>
                            </div>
                        )}

                        {generatedPassword && (
                            <div className="flex-1 flex items-center justify-between bg-black/20 p-3 rounded-lg border border-white/5">
                                <div>
                                    <div className="text-xs text-white/50 uppercase tracking-wider font-medium mb-1">Senha</div>
                                    <div className="text-lg font-bold text-blue-400 tracking-wide font-mono">{generatedPassword}</div>
                                </div>
                                <button
                                    onClick={() => navigator.clipboard.writeText(generatedPassword)}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/60 hover:text-white"
                                    title="Copiar senha"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>
                )}

                <PlayerControls
                    isPlaying={isPlaying}
                    currentFrame={currentFrame}
                    totalFrames={frames.length}
                    onPlay={handlePlay}
                    onRestart={handleRestart}
                    onDelete={handleDelete}
                    onFrameChange={setCurrentFrame}
                />
            </div>
        </div>
    )
}
