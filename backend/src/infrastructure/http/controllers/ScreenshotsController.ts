import { Request, Response } from 'express';

export class ScreenshotsController {
    async cleanup(_req: Request, res: Response): Promise<void> {
        try {
            const testStreamServer = (global as any).testStreamServer;

            if (testStreamServer) {
                testStreamServer.cleanupScreenshots();
                res.status(200).json({ success: true, message: 'Screenshots deletados com sucesso' });
            } else {
                res.status(500).json({ success: false, message: 'TestStreamServer não encontrado' });
            }
        } catch (error) {
            res.status(500).json({ success: false, message: 'Erro ao deletar screenshots' });
        }
    }
}
