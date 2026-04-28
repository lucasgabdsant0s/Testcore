import type { Page } from 'playwright';

export interface BlockAction {
  id: string;
  type: 'goto' | 'click' | 'type' | 'wait' | 'screenshot';
  params: {
    url?: string;
    selector?: string;
    text?: string;
    timeout?: number;
    name?: string;
    waitUntil?: string;
    delay?: number;
  };
}

export interface TestScenario {
  name: string;
  blocks: BlockAction[];
  config?: {
    screenshotInterval?: number;
    screenshotEnabled?: boolean;
    postScenarioDelay?: number;
  };
}

export interface BlockExecutor {
  execute(page: Page, params: any, context?: ExecutionContext): Promise<void>;
}

export interface ExecutionContext {
  page: Page;
  screenshotDir: string;
  stopCapture?: () => void;
  generatedPhone?: string | undefined;
  generatedPassword?: string | undefined;
}
