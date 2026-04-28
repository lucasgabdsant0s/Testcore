import { useState, useEffect } from 'react'
import { io, Socket } from 'socket.io-client'

interface TestFrame {
    testId: string
    path: string
    timestamp: number
}

export function useTestStream() {
    const [frames, setFrames] = useState<string[]>([])
    const [isStreaming, setIsStreaming] = useState(false)
    const [generatedPhone, setGeneratedPhone] = useState<string | undefined>(undefined)
    const [generatedPassword, setGeneratedPassword] = useState<string | undefined>(undefined)
    const [socket, setSocket] = useState<Socket | null>(null)

    useEffect(() => {
        const newSocket = io('http://localhost:3000')

        newSocket.on('connect', () => {
            console.log('[WebSocket] Conectado')
        })

        newSocket.on('test:start', (data: any) => {
            console.log('[WebSocket] Teste iniciado:', data)
            setFrames([])
            setGeneratedPhone(undefined)
            setGeneratedPassword(undefined)
            setIsStreaming(true)
        })

        newSocket.on('test:frame', (frame: TestFrame) => {
            console.log('[WebSocket] Novo frame:', frame.path)
            setFrames(prev => [...prev, frame.path])
        })

        newSocket.on('test:complete', (data: { testId: string; generatedPhone?: string; generatedPassword?: string; timestamp: number }) => {
            console.log('[WebSocket] Teste concluído', data)
            if (data.generatedPhone) {
                console.log('[WebSocket] Telefone gerado:', data.generatedPhone)
                setGeneratedPhone(data.generatedPhone)
            }
            if (data.generatedPassword) {
                console.log('[WebSocket] Senha gerada:', data.generatedPassword)
                setGeneratedPassword(data.generatedPassword)
            }
            setIsStreaming(false)
        })

        setSocket(newSocket)

        return () => {
            newSocket.close()
        }
    }, [])

    const cleanup = () => {
        console.log('[Frontend] cleanup() chamada')
        console.log('[Frontend] Socket:', socket)
        console.log('[Frontend] Socket conectado?', socket?.connected)

        if (socket && socket.connected) {
            console.log('[Frontend] Emitindo cleanup:screenshots')
            socket.emit('cleanup:screenshots')
            setFrames([])
            setGeneratedPhone(undefined)
        } else {
            console.error('[Frontend] Socket não está conectado!')
        }
    }

    return { frames, isStreaming, generatedPhone, generatedPassword, socket, cleanup }
}
