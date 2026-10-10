// Link-preview cards (Open Graph images), one per page, rendered at build time
// by src/pages/og/[...key].png.ts. Satori lays out the card from the site's own
// fonts and Verdigris tokens; resvg turns the SVG into a PNG. No runtime service.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { published } from './content';
import { site } from '../site.config';

export interface OgCard {
  /** The page's path without slashes ('index' for the home page): /og/<key>.png */
  key: string;
  eyebrow: string;
  title: string;
  summary?: string;
}

export async function ogCards(): Promise<OgCard[]> {
  const [work, lab, notes] = await Promise.all([published('work'), published('lab'), published('notes')]);
  return [
    { key: 'index', eyebrow: 'Full-stack engineer', title: site.headline, summary: site.lede },
    { key: 'about', eyebrow: 'About', title: 'Sean Russell', summary: 'Full-stack engineer working remotely from upstate New York.' },
    { key: 'work', eyebrow: 'Work', title: 'Case studies', summary: 'The problem, the decisions, and what came of them.' },
    { key: 'lab', eyebrow: 'Lab', title: 'Experiments', summary: 'Some polished, some not, all labelled.' },
    ...work.map((e) => ({ key: `work/${e.id}`, eyebrow: `Work · ${e.data.area}`, title: e.data.title, summary: e.data.summary })),
    ...lab.map((e) => ({ key: `lab/${e.id}`, eyebrow: `Lab · ${e.data.status}`, title: e.data.title, summary: e.data.summary })),
    ...notes.map((e) => ({ key: `notes/${e.id}`, eyebrow: 'Notes', title: e.data.title, summary: e.data.summary })),
  ];
}

/** The card for a page path, falling back to the home page's. */
export async function ogKeyFor(pathname: string): Promise<string> {
  const key = pathname.replace(/^\/|\/$/g, '') || 'index';
  return (await ogCards()).some((c) => c.key === key) ? key : 'index';
}

// Light theme only: previews render on unknown backgrounds, and the light
// card reads everywhere. Values mirror global.css.
const c = { bg: '#eceeea', fg: '#152019', muted: '#5d6a64', line: '#d4dad5', accent: '#22695a' };

// Satori reads woff/ttf (not woff2) and static weights (not variable fonts),
// hence the static Fontsource packages here, dev-only.
const font = (pkg: string, file: string) => readFileSync(join(process.cwd(), 'node_modules/@fontsource', pkg, 'files', file));
let fonts: Parameters<typeof satori>[1]['fonts'] | undefined;
function loadFonts() {
  fonts ??= [
    { name: 'Sans', data: font('schibsted-grotesk', 'schibsted-grotesk-latin-500-normal.woff'), weight: 500 },
    { name: 'Sans', data: font('schibsted-grotesk', 'schibsted-grotesk-latin-700-normal.woff'), weight: 700 },
    { name: 'Mono', data: font('ibm-plex-mono', 'ibm-plex-mono-latin-400-normal.woff'), weight: 400 },
  ];
  return fonts;
}

// Satori takes a React-like element tree; plain objects avoid JSX in a .ts file.
type Node = { type: string; props: Record<string, unknown> };
const el = (type: string, style: Record<string, unknown>, ...children: (Node | string)[]): Node => ({
  type,
  props: { style: { display: 'flex', ...style }, children },
});

export async function renderOg(card: OgCard): Promise<Uint8Array<ArrayBuffer>> {
  const long = card.title.length > 48;
  const tree = el(
    'div',
    { width: 1200, height: 630, boxSizing: 'border-box', flexDirection: 'column', justifyContent: 'space-between', padding: 72, background: c.bg, color: c.fg, fontFamily: 'Sans' },
    el(
      'div',
      { justifyContent: 'space-between', fontFamily: 'Mono', fontSize: 22, letterSpacing: 2, textTransform: 'uppercase', color: c.muted },
      el('span', {}, 'seanrusselldev.com'),
      el('span', { color: c.accent }, card.eyebrow),
    ),
    el(
      'div',
      { flexDirection: 'column', gap: 24, maxWidth: 1000 },
      el('div', { fontSize: long ? 58 : 72, fontWeight: 500, letterSpacing: long ? -1.5 : -2.5, lineHeight: 1.08 }, card.title),
      ...(card.summary ? [el('div', { fontSize: 28, lineHeight: 1.4, color: c.muted }, card.summary)] : []),
    ),
    el(
      'div',
      { alignItems: 'center', gap: 20 },
      el('span', { fontSize: 26, fontWeight: 700, letterSpacing: -0.5 }, site.name),
      // The site's readout motif: a hairline ending in a live dot.
      el('div', { flexGrow: 1, height: 1, background: c.line }),
      el('div', { width: 12, height: 12, borderRadius: 6, background: c.accent }),
    ),
  );
  const svg = await satori(tree as never, { width: 1200, height: 630, fonts: loadFonts() });
  // Copied into a plain ArrayBuffer-backed array, which Response accepts as a body.
  return new Uint8Array(new Resvg(svg).render().asPng());
}
