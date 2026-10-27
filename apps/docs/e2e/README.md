# Browser checks

Run `pnpm build` and `pnpm test:e2e` from the docs app. Playwright starts a static
file server, checks desktop and mobile Chromium with one worker, and stops the
server when done. Keep port 3000 free. Tests cover reading, navigation, browser
search, generated LLM content, Open Graph images, and missing pages.
