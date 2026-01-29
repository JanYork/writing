# Repository Guidelines

## Project Structure & Module Organization
- `source/` — Markdown content. Posts in `source/_posts/` (kebab-case filenames), pages as `source/<page>/index.md`.
- `themes/` — Active theme set in `_config.yml` (e.g., `theme: A4`). Customize under `themes/<theme>/`.
- `public/` — Generated output; do not edit or commit.
- `scaffolds/` — Templates used by `hexo new` for posts/pages.
- Config — `_config.yml` (site + deploy), optional `_config.landscape.yml` (theme extras). Prefer local overrides not committed to VCS.
- Tooling — `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`. Cache file `db.json` should remain untracked.

## Build, Test, and Development Commands
- `pnpm install` — Install dependencies.
- `pnpm server` — Start local server at http://localhost:4000 with live reload.
- `pnpm build` — Generate the static site into `public/`.
- `pnpm clean` — Remove caches and `public/`.
- `pnpm deploy` — Deploy per `_config.yml` (requires authorized keys/targets). Use only from trusted environments.
  (If not using pnpm, replace with `npm run <script>`.)

## Coding Style & Naming Conventions
- Markdown with YAML front‑matter. Required: `title`, `date` (`YYYY-MM-DD HH:mm:ss`), `tags`, `categories`. Optional: `description`, `cover`, `keywords`.
- Filenames: kebab-case ASCII, e.g., `source/_posts/why-create-personal-blog-website.md`; no spaces.
- Front‑matter indentation 2 spaces. Keep prose lines readable (~100 chars). Use meaningful headings and alt text for images.
- Internal links should be relative; prefer `https` for external assets.

## Testing Guidelines
- No unit tests; success criteria are a clean build and pages rendering locally.
- Preview with `pnpm server`, verify changed pages plus archives, tags, and category listings.
- For drafts, run `pnpm server -- --draft` to include them in local preview.

## Commit & Pull Request Guidelines
- Use Conventional Commits when possible: `docs:`, `chore:`, `feat(theme):`, `fix:`, `refactor:`. Short, imperative subject (≤ 50 chars) with optional body.
- PRs should include: what/why, screenshots for visual/theme changes, links to affected pages, and a note if `_config.yml` was modified. Ensure `pnpm build` passes locally.

## Security & Configuration Tips
- Do not commit secrets, `public/`, or `db.json`. Never commit private keys.
- Avoid editing shared deploy credentials. For local overrides, create an untracked `_config.local.yml` and run with multiple configs, e.g.: `pnpm exec hexo g -c _config.yml,_config.local.yml` or `pnpm server -- -c _config.yml,_config.local.yml`.

