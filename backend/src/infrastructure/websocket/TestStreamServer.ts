import { Server as SocketIOServer } from 'socket.io';
import type { Server as HTTPServer } from 'http';
import * as fs from 'fs';
import * as path from 'path';

export class TestStreamServer {
    private io: SocketIOServer;
    private screenshotDir: string;

    constructor(httpServer: HTTPServer) {
        this.io = new SocketIOServer(httpServer, {
            cors: {
                origin: '*',
                methods: ['GET', 'POST']
            }
        });

        this.screenshotDir = path.join(process.cwd(), 'public', 'fotos-teste');
        this.setupListeners();
    }

    private setupListeners() {
        this.io.on('connection', (socket) => {
            console.log(`[WebSocket] Cliente conectado: ${socket.id}`);

            socket.on('disconnect', () => {
                console.log(`[WebSocket] Cliente desconectado: ${socket.id}`);
            });

            socket.on('request:frames', (testId: string) => {
                this.sendExistingFrames(socket, testId);
            });

            socket.on('cleanup:screenshots', () => {
                this.cleanupScreenshots();
            });
        });
    }

    emitTestStart(testId: string, testName: string) {
        this.io.emit('test:start', { testId, testName, timestamp: Date.now() });
    }

    emitFrame(testId: string, framePath: string) {
        const relativePath = framePath.replace(/\\/g, '/').split('/public/')[1];
        const frame = {
            testId,
            path: `/${relativePath}`,
            timestamp: Date.now()
        };
        this.io.emit('test:frame', frame);
    }

    emitTestComplete(testId: string, generatedPhone?: string, generatedPassword?: string) {
        this.io.emit('test:complete', { testId, generatedPhone, generatedPassword, timestamp: Date.now() });
    }

    private sendExistingFrames(socket: any, testId: string) {
        try {
            if (!fs.existsSync(this.screenshotDir)) {
                return;
            }

            const files = fs.readdirSync(this.screenshotDir);
            const frames = files
                .filter(f => f.endsWith('.png'))
                .sort()
                .map(filename => ({
                    testId,
                    path: `/fotos-teste/${filename}`,
                    timestamp: parseInt(filename.match(/\d+/)?.[0] || '0')
                }));

            socket.emit('frames:list', { testId, frames });
        } catch (error) {
        }
    }

    cleanupScreenshots() {
        try {
            if (!fs.existsSync(this.screenshotDir)) {
                return;
            }

            const files = fs.readdirSync(this.screenshotDir);
            let deletedCount = 0;

            files.forEach(file => {
                if (file.endsWith('.png')) {
                    const filePath = path.join(this.screenshotDir, file);
                    fs.unlinkSync(filePath);
                    deletedCount++;
                }
            });

        } catch (error) {
        }
    }

    getIO() {
        return this.io;
    }
}
