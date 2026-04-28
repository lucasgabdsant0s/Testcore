import { chromium } from "playwright"
import { ScenarioExecutor } from "../../../../tests/executor"
import type { TestScenario } from "../../../../tests/types"

type Input = {
  scenario: TestScenario
}

export class RunTestUseCase {
  async execute(input: Input): Promise<void> {
    const testId = `test-${Date.now()}`;
    const testStreamServer = (global as any).testStreamServer;

    const browser = await chromium.launch({ headless: true })
    const context = await browser.newContext()
    const page = await context.newPage()

    try {
      const scenario = input.scenario
      if (!scenario?.blocks || scenario.blocks.length === 0) {
        throw new Error("Cenário inválido: sem blocos para executar")
      }

      if (testStreamServer) {
        testStreamServer.emitTestStart(testId, scenario.name || 'Teste');
      }

      const metaSiteUrl = (scenario as any)?.meta?.siteUrl as string | undefined
      const hasGotoBlock = scenario.blocks.some((b) => b.type === "goto")
      if (metaSiteUrl && !hasGotoBlock) {
        await page.goto(metaSiteUrl, { waitUntil: "domcontentloaded" })
      }

      let preGeneratedPhone: string | undefined;
      let preGeneratedPassword: string | undefined;

      console.log(`[RunTestUseCase] Iniciando busca por telefone e senha nos blocos...`);
      for (const block of scenario.blocks) {
        if (block.type === 'type') {
          const params = block.params as any;

          if (params.phone) {
            preGeneratedPhone = params.phone;
            console.log(`[RunTestUseCase] Telefone detectado nos params: ${preGeneratedPhone}`);

            try {
              const { PrismaClient } = require('@prisma/client');
              const prisma = new PrismaClient();
              await prisma.generatedPhone.create({
                data: {
                  phoneNumber: preGeneratedPhone!,
                  testId: parseInt(testId.replace(/\D/g, '') || '0'),
                  userId: 1,
                }
              });
            } catch (e) {
              console.error('[RunTestUseCase] Erro ao salvar telefone gerado:', e);
            }
          }

          if (params.password) {
            preGeneratedPassword = params.password;
            console.log(`[RunTestUseCase] Senha detectada nos params: ${preGeneratedPassword}`);
          }

          if (!preGeneratedPhone && params.text) {
            const text = params.text.trim();
            const selector = params.selector || '';
            const phoneRegex = /^\s*\(\d{2}\)\s*\d{5}-\d{4}\s*$/;

            if (phoneRegex.test(text)) {
              const isPhoneField = ['phone', 'telefone', 'celular', 'tel', 'mobile', 'whatsapp'].some(k =>
                selector.toLowerCase().includes(k)
              );
              if (isPhoneField) {
                preGeneratedPhone = text;
                console.log(`[RunTestUseCase] Telefone detectado por regex: ${preGeneratedPhone}`);
              }
            }
          }

          if (!preGeneratedPassword && params.text) {
            const text = params.text.trim();
            const selector = params.selector || '';
            const isPasswordField = ['password', 'senha', 'pass', 'clave'].some(k =>
              selector.toLowerCase().includes(k)
            );

            if (isPasswordField) {
              preGeneratedPassword = text;
              console.log(`[RunTestUseCase] Senha detectada por regex: ${preGeneratedPassword}`);
            }
          }
        }
      }

      if (!preGeneratedPhone) console.log(`[RunTestUseCase] Nenhum telefone encontrado.`);
      if (!preGeneratedPassword) console.log(`[RunTestUseCase] Nenhuma senha encontrada.`);

      const executor = new ScenarioExecutor()
      const result = await executor.execute(page, scenario, (framePath) => {
        if (testStreamServer) {
          testStreamServer.emitFrame(testId, framePath);
        }
      }, preGeneratedPhone, preGeneratedPassword)


      if (testStreamServer) {
        testStreamServer.emitTestComplete(testId, result?.generatedPhone, result?.generatedPassword);
      }
    } finally {
      await page.close()
      await context.close()
      await browser.close()
    }
  }
}
