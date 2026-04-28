import type { Page } from 'playwright';
import type { BlockExecutor } from './types';
import * as path from 'path';

export class GotoBlock implements BlockExecutor {
  async execute(page: Page, params: { url: string; waitUntil?: string }): Promise<void> {
    const { url, waitUntil = 'domcontentloaded' } = params;

    if (!url) {
      throw new Error('GotoBlock: URL é obrigatória');
    }
    await page.goto(url, {
      waitUntil: waitUntil as any
    });
  }
}

export class ClickBlock implements BlockExecutor {
  async execute(page: Page, params: { selector: string; timeout?: number }): Promise<void> {
    const { selector, timeout = 5000 } = params;

    if (!selector) {
      throw new Error('ClickBlock: Seletor é obrigatório');
    }

    console.log(`[ClickBlock] Procurando elemento: ${selector}`);
    const element = page.locator(selector).first();

    await element.waitFor({ state: 'visible', timeout });
    console.log(`[ClickBlock] Clicando no elemento: ${selector}`);
    await element.click();
    console.log(`[ClickBlock] Clique concluído`);
  }
}

export class TypeBlock implements BlockExecutor {
  async execute(page: Page, params: { selector: string; text: string; timeout?: number; delay?: number }, context?: any): Promise<void> {
    const { selector, text, timeout = 5000, delay = 0 } = params;

    if (!selector) {
      throw new Error('TypeBlock: Seletor é obrigatório');
    }

    if (text === undefined || text === null) {
      throw new Error('TypeBlock: Texto é obrigatório');
    }

    console.log(`[TypeBlock] Procurando campo: ${selector}`);
    const element = page.locator(selector).first();

    await element.waitFor({ state: 'visible', timeout });
    console.log(`[TypeBlock] Digitando no campo: ${selector}`);

    let textToType = text;

    const isPhoneField = this.isPhoneField(selector);
    if (isPhoneField && context?.generatedPhone) {
      textToType = context.generatedPhone;
      console.log(`[TypeBlock] Usando telefone gerado: ${textToType}`);
    }

    if (delay > 0) {
      await element.type(textToType, { delay });
    } else {
      await element.fill(textToType);
    }

    console.log(`[TypeBlock] Texto digitado: ${textToType.substring(0, 20)}${textToType.length > 20 ? '...' : ''}`);
  }

  private isPhoneField(selector: string): boolean {
    const phoneKeywords = ['phone', 'telefone', 'celular', 'tel', 'mobile', 'whatsapp'];
    const lowerSelector = selector.toLowerCase();
    return phoneKeywords.some(keyword => lowerSelector.includes(keyword));
  }
}

export class WaitBlock implements BlockExecutor {
  async execute(page: Page, params: { timeout: number }): Promise<void> {
    const { timeout = 1000 } = params;

    console.log(`[WaitBlock] Aguardando ${timeout}ms`);
    await page.waitForTimeout(timeout);
    console.log(`[WaitBlock] Espera concluída`);
  }
}

export class EvaluateBlock implements BlockExecutor {
  async execute(page: Page, params: { script: string; timeout?: number }): Promise<void> {
    const { script, timeout = 5000 } = params;

    if (!script) {
      throw new Error('EvaluateBlock: O script é obrigatório');
    }

    console.log(`[EvaluateBlock] Executando script: ${script}`);
    await page.evaluate(script);
    console.log(`[EvaluateBlock] Script executado com sucesso`);
  }
}

export class ScreenshotBlock implements BlockExecutor {
  async execute(page: Page, params: { name: string; screenshotDir: string }): Promise<void> {
    const { name, screenshotDir } = params;

    if (!name) {
      throw new Error('ScreenshotBlock: Nome é obrigatório');
    }

    const timestamp = Date.now();
    const filename = `${name}-${timestamp}.png`;
    const filepath = path.join(screenshotDir, filename);

    console.log(`[ScreenshotBlock] Capturando tela: ${filename}`);
    await page.screenshot({ path: filepath });
    console.log(`[ScreenshotBlock] Screenshot salvo em: ${filepath}`);
  }
}

export const blockRegistry: Record<string, BlockExecutor> = {
  goto: new GotoBlock(),
  click: new ClickBlock(),
  type: new TypeBlock(),
  wait: new WaitBlock(),
  screenshot: new ScreenshotBlock(),
  evaluate: new EvaluateBlock(),
};

export function getBlock(type: string): BlockExecutor {
  const block = blockRegistry[type];

  if (!block) {
    throw new Error(`Bloco não encontrado: ${type}. Blocos disponíveis: ${Object.keys(blockRegistry).join(', ')}`);
  }

  return block;
}