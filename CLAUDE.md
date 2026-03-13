# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Obsidian AntV Infographic** - An Obsidian plugin for rendering AntV Infographic visualizations in markdown notes using custom code blocks.

## Development Commands

```bash
# Install dependencies
npm install

# Development (watch mode - auto-rebuilds on changes)
npm run dev

# Production build (type-check + bundle)
npm run build

# Lint code
npm run lint
```

## Architecture

- **Entry point**: `src/main.ts` → compiled to `main.js` and loaded by Obsidian
- **Source code**: `src/` directory with TypeScript
- **Release artifacts**: `main.js`, `manifest.json`, `styles.css` (at plugin root)
- **Bundler**: esbuild (configured in `esbuild.config.mjs`)
- **Dependencies**:
  - `obsidian` - Plugin API
  - `@antv/infographic` - Infographic rendering library

## How It Works

The plugin uses `registerMarkdownCodeBlockProcessor` to intercept `infographic` code blocks:
1. Parse the source content as AntV Infographic syntax
2. Create a container div and instantiate `new Infographic()`
3. Call `infographic.render(source)` to render
4. Clean up with `MarkdownRenderChild` on unload

## Key Patterns

- Use `this.registerMarkdownCodeBlockProcessor('infographic', callback)` for code block processing
- Use `MarkdownPostProcessorContext.addChild()` to register cleanup
- Use `this.registerDomEvent()`, `this.registerEvent()`, `this.registerInterval()` for cleanup
- Settings persist via `this.loadData()` / `this.saveData()`
- Bundle all dependencies into `main.js` (no unbundled runtime deps)

## Styling

- Charts are left-aligned by default (using `margin: 1em 0` in CSS)
- Modal view (on double-click) is centered for better viewing

## Testing

Manually install plugin to test:
```
<Vault>/.obsidian/plugins/obsidian-antv-infographic/
```

Copy `main.js`, `manifest.json`, `styles.css` to the plugin folder, then reload Obsidian.
