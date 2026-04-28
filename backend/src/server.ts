require('dotenv').config();
import express = require('express');
import cors = require('cors');
import { PrismaClient } from '@prisma/client';
import { PrismaUserRepository } from './infrastructure/repositories/PrismaUserRepository';
import { BcryptHashService } from './infrastructure/services/BcryptHashService';
import { JwtTokenService } from './infrastructure/services/JwtTokenService';
import { LoginUseCase } from './application/use-cases/LoginUseCase';
import { RegisterUseCase } from './application/use-cases/RegisterUseCase';
import { AuthController } from './infrastructure/http/controllers/AuthController';
import { createAuthRoutes } from './infrastructure/http/routes/authRoutes';
import { PlaywrightElementSelectorService } from './infrastructure/services/PlaywrightElementSelectorService';
import { ResolveSelectorFromPointUseCase } from './application/use-cases/ResolveSelectorFromPointUseCase';
import { PickerController } from './infrastructure/http/controllers/PickerController';
import { createPickerRoutes } from './infrastructure/http/routes/pickerRoutes';
import { PrismaTestsRepository } from './infrastructure/repositories/PrismaTestsRepository';
import { CreateTestUseCase } from './application/use-cases/tests/CreateTestUseCase';
import { ListTestsUseCase } from './application/use-cases/tests/ListTestsUseCase';
import { GetTestByIdUseCase } from './application/use-cases/tests/GetTestByIdUseCase';
import { RunTestUseCase } from './application/use-cases/tests/RunTestUseCase';
import { UpdateTestUseCase } from './application/use-cases/tests/UpdateTestUseCase';
import { TestsController } from './infrastructure/http/controllers/TestsController';
import { createTestsRoutes } from './infrastructure/http/routes/testsRoutes';
import { createServer } from 'http';
import { TestStreamServer } from './infrastructure/websocket/TestStreamServer';
import { ScreenshotsController } from './infrastructure/http/controllers/ScreenshotsController';
import { createScreenshotsRoutes } from './infrastructure/http/routes/screenshotsRoutes';
import { PrismaSiteRepository } from './infrastructure/repositories/PrismaSiteRepository';
import { PrismaMonitorLogRepository } from './infrastructure/repositories/PrismaMonitorLogRepository';
import { PlaywrightMonitoringService } from './infrastructure/services/PlaywrightMonitoringService';
import { CreateSiteUseCase } from './application/use-cases/sites/CreateSiteUseCase';
import { ListSitesUseCase } from './application/use-cases/sites/ListSitesUseCase';
import { GetSiteByIdUseCase } from './application/use-cases/sites/GetSiteByIdUseCase';
import { DeleteSiteUseCase } from './application/use-cases/sites/DeleteSiteUseCase';
import { StartMonitoringUseCase } from './application/use-cases/monitoring/StartMonitoringUseCase';
import { StopMonitoringUseCase } from './application/use-cases/monitoring/StopMonitoringUseCase';
import { GetMonitorLogsUseCase } from './application/use-cases/monitoring/GetMonitorLogsUseCase';
import { SiteController } from './infrastructure/http/controllers/SiteController';
import { MonitorController } from './infrastructure/http/controllers/MonitorController';
import { createSiteRoutes } from './infrastructure/http/routes/siteRoutes';
import { createMonitorRoutes } from './infrastructure/http/routes/monitorRoutes';

const prisma = new PrismaClient();

const userRepository = new PrismaUserRepository(prisma);
const hashService = new BcryptHashService();
const tokenService = new JwtTokenService();

const loginUseCase = new LoginUseCase(userRepository, hashService, tokenService);
const registerUseCase = new RegisterUseCase(userRepository, hashService);

const authController = new AuthController(loginUseCase, registerUseCase);

const elementSelectorService = new PlaywrightElementSelectorService();
const resolveSelectorFromPointUseCase = new ResolveSelectorFromPointUseCase(elementSelectorService);
const pickerController = new PickerController(resolveSelectorFromPointUseCase);

const testsRepo = new PrismaTestsRepository(prisma);
const createTestUseCase = new CreateTestUseCase(testsRepo);
const listTestsUseCase = new ListTestsUseCase(testsRepo);
const getTestByIdUseCase = new GetTestByIdUseCase(testsRepo);
const runTestUseCase = new RunTestUseCase();
const updateTestUseCase = new UpdateTestUseCase(testsRepo);
const testsController = new TestsController(createTestUseCase, listTestsUseCase, getTestByIdUseCase, updateTestUseCase, runTestUseCase);

const siteRepository = new PrismaSiteRepository(prisma);
const monitorLogRepository = new PrismaMonitorLogRepository(prisma);
const monitoringService = new PlaywrightMonitoringService(monitorLogRepository);

const createSiteUseCase = new CreateSiteUseCase(siteRepository);
const listSitesUseCase = new ListSitesUseCase(siteRepository);
const getSiteByIdUseCase = new GetSiteByIdUseCase(siteRepository);
const deleteSiteUseCase = new DeleteSiteUseCase(siteRepository);

const startMonitoringUseCase = new StartMonitoringUseCase(monitoringService, siteRepository);
const stopMonitoringUseCase = new StopMonitoringUseCase(monitoringService, siteRepository);
const getMonitorLogsUseCase = new GetMonitorLogsUseCase(monitorLogRepository, siteRepository);

const siteController = new SiteController(createSiteUseCase, listSitesUseCase, getSiteByIdUseCase, deleteSiteUseCase);
const monitorController = new MonitorController(startMonitoringUseCase, stopMonitoringUseCase, getMonitorLogsUseCase, monitoringService);

const app = express();

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Não permitido por CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

app.use(express.static('public'));

app.get('/health', (_req: any, res: any) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/auth', createAuthRoutes(authController, tokenService));
app.use('/picker', createPickerRoutes(pickerController));
app.use('/tests', createTestsRoutes(testsController, tokenService));
app.use('/api', createScreenshotsRoutes(new ScreenshotsController()));
app.use('/sites', createSiteRoutes(siteController, tokenService));
app.use('/monitor', createMonitorRoutes(monitorController, tokenService));

const PORT = process.env.PORT || 3000;

const httpServer = createServer(app);
const testStreamServer = new TestStreamServer(httpServer);
(global as any).testStreamServer = testStreamServer;

httpServer.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`WebSocket disponível para streaming de testes`);
  console.log(`Sistema de monitoramento de sites ativo`);
});