import type { Page } from 'playwright';
import type { TestScenario, BlockAction, ExecutionContext } from './types';
import { getBlock } from './blocks';
import * as fs from 'fs';
import * as path from 'path';

const DEFAULT_POST_SCENARIO_DELAY = 3000;
const DEFAULT_SCREENSHOT_INTERVAL = 500;

async function startScreenshotInterval(
  page: Page,
  prefix: string,
  screenshotDir: string,
  intervalMs: number = 500,
  onFrame?: (framePath: string) => void
): Promise<{ stop: () => void; promise: Promise<void> }> {
  let counter = 0;
  let stopped = false;

  const promise = (async () => {
    while (!stopped) {
      try {
        const timestamp = Date.now();
        const framePath = path.join(screenshotDir, `${prefix}-frame-${String(counter).padStart(4, '0')}-${timestamp}.png`);
        await page.screenshot({ path: framePath });
        counter++;

        if (onFrame) {
          onFrame(framePath);
        }
      } catch (error) { }

      if (!stopped) {
        await new Promise(resolve => setTimeout(resolve, intervalMs));
      }
    }
  })();

  return { stop: () => { stopped = true; }, promise };
}

export class ScenarioExecutor {
  private screenshotDir: string;

  constructor(screenshotDir: string = path.join(process.cwd(), 'public', 'fotos-teste')) {
    this.screenshotDir = screenshotDir;
    this.ensureScreenshotDir();
  }

  private ensureScreenshotDir(): void {
    if (!fs.existsSync(this.screenshotDir)) {
      fs.mkdirSync(this.screenshotDir, { recursive: true });
    }
  }

  async execute(
    page: Page,
    scenario: TestScenario,
    onFrame?: (framePath: string) => void,
    preGeneratedPhone?: string,
    preGeneratedPassword?: string
  ): Promise<{ generatedPhone: string | undefined; generatedPassword: string | undefined }> {
    const screenshotEnabled = scenario.config?.screenshotEnabled ?? true;
    const screenshotInterval = scenario.config?.screenshotInterval ?? DEFAULT_SCREENSHOT_INTERVAL;
    const postScenarioDelay = scenario.config?.postScenarioDelay ?? DEFAULT_POST_SCENARIO_DELAY;

    let generatedPhone = preGeneratedPhone;
    let generatedPassword = preGeneratedPassword;

    const context: ExecutionContext = {
      page,
      screenshotDir: this.screenshotDir,
      generatedPhone,
      generatedPassword,
    };

    let capture: { stop: () => void; promise: Promise<void> } | undefined;

    try {
      if (screenshotEnabled) {
        capture = await startScreenshotInterval(
          page,
          `scenario-${scenario.name.replace(/\s+/g, '-')}`,
          this.screenshotDir,
          screenshotInterval,
          onFrame
        );
      }

      for (let i = 0; i < scenario.blocks.length; i++) {
        const block = scenario.blocks[i];
        if (!block) continue;
        await this.executeBlock(context, block);
      }

      if (postScenarioDelay > 0) {
        await new Promise(resolve => setTimeout(resolve, postScenarioDelay));
      }

      return { generatedPhone, generatedPassword };
    } catch (error) {
      throw error;
    } finally {
      if (capture) {
        capture.stop();
        await capture.promise;
      }
    }
  }

  private async executeBlock(context: ExecutionContext, block: BlockAction): Promise<void> {
    try {
      const executor = getBlock(block.type);
      const params = block.type === 'screenshot'
        ? { ...block.params, screenshotDir: context.screenshotDir }
        : block.params;

      await executor.execute(context.page, params, context);
    } catch (error) {
      throw new Error(`Falha no bloco ${block.id}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  static loadScenarioFromFile(filepath: string): TestScenario {
    const fileContent = fs.readFileSync(filepath, 'utf-8');
    return JSON.parse(fileContent) as TestScenario;
  }

  static saveScenarioToFile(scenario: TestScenario, filepath: string): void {
    const dir = path.dirname(filepath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filepath, JSON.stringify(scenario, null, 2), 'utf-8');
  }
}