// @ts-check
import { readFileSync } from 'node:fs';
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import { parse } from 'yaml';

// Pages that build but shouldn't be indexed yet: the résumé while it's a
// draft, and Notes until it joins the nav (src/site.config.ts).
const resumeDraft = parse(readFileSync('src/content/resume/resume.yaml', 'utf8')).draft !== false;
const unlisted = ['/notes/', ...(resumeDraft ? ['/resume/'] : [])];

export default defineConfig({
  site: 'https://www.seanrusselldev.com',
  trailingSlash: 'always',
  // React is for islands only: interactive pieces opt in with client:*.
  // Everything else ships as HTML with no framework runtime.
  integrations: [
    mdx(),
    react(),
    sitemap({ filter: (page) => !unlisted.some((p) => new URL(page).pathname.startsWith(p)) }),
  ],
  // Small CSS, inlined: one less render-blocking request. Revisit if it grows.
  build: { inlineStylesheets: 'always' },
});
