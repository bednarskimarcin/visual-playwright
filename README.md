# Email template visual tests (Playwright)

Compares the screenshot of each email template in its **expected** (required) state with its **current** state,
and shows the result in the Playwright HTML report.

## Folder layout

```
<screenshotsDir>/
  expected/            <- reference screenshots (QA keeps these up to date)
    welcome.png
    password-reset.png
    pl/welcome.png     <- subfolders are allowed (e.g. per language)
  current/             <- screenshots of the current application
    welcome.png
    password-reset.png
    pl/welcome.png
```

A pair is matched by its **relative path and file name**. Each pair becomes one test.
If a file is present in only one of the two folders, that test fails with "Missing … screenshot".

## Configuration – `email-visual.config.json`

| key | meaning |
|---|---|
| `screenshotsDir` | root folder (relative to this file, or absolute) |
| `expectedSubdir` / `currentSubdir` | names of the two subfolders |
| `extensions` | image types to pick up (`.png`, `.jpg`, `.jpeg`) |
| `comparison.threshold` | per-pixel colour tolerance, 0–1 (default 0.1) |
| `comparison.maxDiffPixels` / `maxDiffPixelRatio` | how many differing pixels are still accepted (0 = exact) |

Overrides without editing the file:
- `EMAIL_SCREENSHOTS_DIR=D:\qa\run-42` – a different screenshots folder
- `EMAIL_VISUAL_CONFIG=other.config.json` – a different config file

## Run

```
npm install          # once
npm test             # runs the comparison and opens the HTML report
npm run report       # reopen the last report
```

PowerShell with another folder: `$env:EMAIL_SCREENSHOTS_DIR="D:\qa\run-42"; npm test`

In the report every failed template shows **Expected / Actual / Diff** images, with *Side by side* and *Slider* views.
No browser is needed – the tests only compare image files.

The expected screenshots are never written by the tests (`updateSnapshots: 'none'`),
and running with `--update-snapshots` / `-u` stops with an error, so the QA reference images are never overwritten.
