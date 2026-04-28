import { test, expect } from '@playwright/test';
import { ScenarioExecutor } from './executor';
import type { TestScenario } from './types';

test('executa a partir de JSON', async ({ page }) => {
  const scenarioPath = 'tests/scenarios/exemplo-cenario.json';
  const loadedScenario = ScenarioExecutor.loadScenarioFromFile(scenarioPath);
  const executor = new ScenarioExecutor();
  await executor.execute(page, loadedScenario);
});