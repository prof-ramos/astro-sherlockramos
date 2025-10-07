# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Astro blog starter template configured for deployment on Cloudflare Workers. Built with Astro 5.x, supports Markdown/MDX content, includes RSS feeds, sitemap generation, and built-in observability logging.

## Development Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start local dev server at `localhost:4321` |
| `npm run build` | Build production site to `./dist/` |
| `npm run preview` | Build and preview locally with Wrangler |
| `npm run check` | Run build, type checking, and dry-run deploy validation |
| `npm run deploy` | Deploy to Cloudflare Workers |
| `npm run cf-typegen` | Generate Cloudflare Worker types |
| `npx wrangler tail` | View real-time logs for deployed Workers |

## Architecture

### Component Structure

- **Layouts**: `BlogPost.astro` layout wraps blog content with Header/Footer and includes scoped styles for prose content (720px max-width)
- **BaseHead Component**: Centralizes all `<head>` metadata including SEO, Open Graph, Twitter cards, font preloads, and canonical URLs. Imports global styles from `src/styles/global.css`
- **Shared Components**: Header, Footer, HeaderLink, FormattedDate are reusable across pages

### Content System

- **Content Collections**: Defined in `src/content.config.ts` using Astro's content collections API with glob loader
- **Blog Collection**: Auto-loads all `.md` and `.mdx` files from `src/content/blog/`
- **Frontmatter Schema**: Zod-validated with required fields: `title`, `description`, `pubDate`, and optional `updatedDate`, `heroImage`
- **Dynamic Routes**: Blog posts use `src/pages/blog/[...slug].astro` catch-all route with `getStaticPaths()` + `getCollection('blog')` + `render()` for content rendering
- **Post IDs**: The `slug` parameter maps directly to `post.id` (the file path relative to `src/content/blog/`)

### Configuration

- **Site Constants**: Global variables (SITE_TITLE, SITE_DESCRIPTION) in `src/consts.ts`
- **Astro Config**: `astro.config.mjs` configures:
  - Cloudflare adapter with platform proxy enabled
  - MDX and sitemap integrations
  - Site URL (currently set to `https://example.com`)
- **Wrangler Config**: `wrangler.json` sets compatibility date, Node.js compatibility, observability, and source maps

### Routing

- File-based routing in `src/pages/`
- `/` - Home page (`index.astro`)
- `/about` - About page (`about.astro`)
- `/blog` - Blog index (`blog/index.astro`)
- `/blog/[slug]` - Individual blog posts (`blog/[...slug].astro`)

### TypeScript

- Uses Astro's strict TypeScript config (`astro/tsconfigs/strict`)
- `strictNullChecks` enabled
- Auto-generated types in `.astro/types.d.ts`
- Cloudflare Worker types in `worker-configuration.d.ts` (auto-generated via `npm run cf-typegen`)

## Styling

- **Global Styles**: `src/styles/global.css` contains CSS custom properties (variables) and base styles
- **Component Styles**: Most components use scoped `<style>` blocks within `.astro` files
- **Typography**: Custom Atkinson font loaded from `public/fonts/` with preload hints in BaseHead
- **Static Assets**: Images and fonts in `public/` directory are served as-is

## Deployment

This project deploys to Cloudflare Workers as a static site with server-side rendering capabilities. The build output goes to `dist/`, with the worker entry point at `dist/_worker.js/index.js`.

### Important Notes

- Update `site` URL in `astro.config.mjs` before deployment (currently set to `https://example.com`)
- Update site metadata in `src/consts.ts` (SITE_TITLE, SITE_DESCRIPTION)
- Observability logging is enabled in `wrangler.json` for production monitoring
