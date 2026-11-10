import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { emailVisualConfig as cfg } from '../email-visual.config';

/** Lists image files (recursively) as paths relative to `dir`, using forward slashes. */
function listImages(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return (fs.readdirSync(dir, { recursive: true }) as string[])
    .map((f) => f.split(path.sep).join('/'))
    .filter((f) => cfg.extensions.includes(path.extname(f).toLowerCase()))
    .filter((f) => fs.statSync(path.join(dir, f)).isFile());
}

const expectedFiles = listImages(cfg.expectedDir);
const currentFiles = listImages(cfg.currentDir);
const templates = [...new Set([...expectedFiles, ...currentFiles])].sort();

test.describe('Email templates: expected vs. current', () => {
  test('screenshots folder contains templates to compare', () => {
    expect(
      templates.length,
      `No screenshots found.\n  expected: ${cfg.expectedDir}\n  current:  ${cfg.currentDir}`,
    ).toBeGreaterThan(0);
  });

  for (const file of templates) {
    test(file, async () => {
      const expectedPath = path.join(cfg.expectedDir, file);
      const currentPath = path.join(cfg.currentDir, file);

      expect(fs.existsSync(expectedPath), `Missing expected screenshot: ${expectedPath}`).toBe(true);
      expect(fs.existsSync(currentPath), `Missing current screenshot: ${currentPath}`).toBe(true);

      // Playwright's image comparison: on failure the HTML report shows
      // Expected / Actual / Diff images with side-by-side and slider views.
      expect(fs.readFileSync(currentPath)).toMatchSnapshot(file.split('/')); // segments keep subfolders intact
    });
  }
});
