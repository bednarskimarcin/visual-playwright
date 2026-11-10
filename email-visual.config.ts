import fs from 'node:fs';
import path from 'node:path';

export interface EmailVisualConfig {
  /** Root folder holding the screenshots. Relative paths are resolved from the project root. */
  screenshotsDir: string;
  /** Subfolder with the reference ("required state") screenshots. */
  expectedSubdir: string;
  /** Subfolder with the screenshots of the current application state. */
  currentSubdir: string;
  /** Image file extensions to pick up. */
  extensions: string[];
  /** Passed to Playwright's image comparison (toMatchSnapshot). */
  comparison: {
    threshold?: number;
    maxDiffPixels?: number;
    maxDiffPixelRatio?: number;
  };
}

const CONFIG_FILE = process.env.EMAIL_VISUAL_CONFIG
  ? path.resolve(process.env.EMAIL_VISUAL_CONFIG)
  : path.resolve(__dirname, 'email-visual.config.json');

function load(): EmailVisualConfig & { expectedDir: string; currentDir: string } {
  const raw = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8')) as EmailVisualConfig;

  // The screenshots folder can also be set from the command line:
  //   EMAIL_SCREENSHOTS_DIR=D:\qa\run-42 npx playwright test
  const root = path.resolve(
    path.dirname(CONFIG_FILE),
    process.env.EMAIL_SCREENSHOTS_DIR ?? raw.screenshotsDir,
  );

  return {
    ...raw,
    screenshotsDir: root,
    expectedDir: path.join(root, raw.expectedSubdir ?? 'expected'),
    currentDir: path.join(root, raw.currentSubdir ?? 'current'),
    extensions: (raw.extensions ?? ['.png']).map((e) => e.toLowerCase()),
    comparison: raw.comparison ?? {},
  };
}

export const emailVisualConfig = load();
