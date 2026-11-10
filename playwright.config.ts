import { defineConfig } from '@playwright/test';
import path from 'node:path';
import { emailVisualConfig as cfg } from './email-visual.config';

// Expected screenshots belong to QA: refuse to overwrite them.
if (process.argv.some((a) => a === "-u" || a.startsWith("--update-snapshots"))) {
  throw new Error("--update-snapshots is disabled: expected screenshots are maintained manually by QA.");
}

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  // Expected images are maintained by QA by hand: never create or overwrite them.
  updateSnapshots: 'none',
  // toMatchSnapshot('welcome.png') reads <screenshotsDir>/<expectedSubdir>/welcome.png
  snapshotPathTemplate: path.join(cfg.expectedDir, '{arg}{ext}'),
  expect: {
    toMatchSnapshot: cfg.comparison,
  },
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: process.env.CI ? 'never' : 'always' }],
  ],
});
