// Export the résumé from src/content/resume/resume.yaml.
//
//   npm run resume:export                         every format
//   npm run resume:export -- --formats docx,md    some formats
//   npm run resume:export -- --no-build           PDF from the existing dist/
//
// Writes <Name>-Resume-<YYYY-MM-DD-HHmm>.{pdf,docx,md,txt} to exports/
// (git-ignored). The PDF is the /resume/ page printed by Chrome, so it matches
// the site; it builds the site first unless told not to. DOCX, Markdown and
// text come from src/lib/resume-export/, which P3's browser tool shares.
import { execSync } from 'node:child_process';
import { createServer } from 'node:http';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { parseArgs } from 'node:util';
import { parse } from 'yaml';
import { Packer } from 'docx';
import { Resume } from '../src/lib/resume.ts';
import { toMarkdown } from '../src/lib/resume-export/markdown.ts';
import { toText } from '../src/lib/resume-export/text.ts';
import { toDocx } from '../src/lib/resume-export/docx.ts';

const ALL = ['pdf', 'docx', 'md', 'txt'];
const { values } = parseArgs({
  options: {
    formats: { type: 'string', default: ALL.join(',') },
    out: { type: 'string', default: 'exports' },
    'no-build': { type: 'boolean', default: false },
  },
});
const formats = values.formats.split(',').map((f) => f.trim());
const unknown = formats.filter((f) => !ALL.includes(f));
if (unknown.length) {
  console.error(`Unknown format(s): ${unknown.join(', ')}. Choose from ${ALL.join(', ')}.`);
  process.exit(1);
}

const resume = Resume.parse(parse(readFileSync('src/content/resume/resume.yaml', 'utf8')));
const sha = (() => {
  try {
    return execSync('git rev-parse --short HEAD', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
  } catch {
    return 'unknown';
  }
})();
const dirty = (() => {
  try {
    return execSync('git status --porcelain -- src/content/resume/resume.yaml').toString().trim() !== '';
  } catch {
    return false;
  }
})();

// Local time, sortable: 2026-10-12-1405.
const now = new Date();
const p2 = (n: number) => String(n).padStart(2, '0');
const stamp = `${now.getFullYear()}-${p2(now.getMonth() + 1)}-${p2(now.getDate())}-${p2(now.getHours())}${p2(now.getMinutes())}`;
const stem = join(values.out, `${resume.name.replace(/\s+/g, '-')}-Resume-${stamp}`);
// Two exports in one minute get -2, -3…; an export never overwrites another.
let base = stem;
for (let n = 2; ALL.some((ext) => existsSync(`${base}.${ext}`)); n++) base = `${stem}-${n}`;
const source = `Generated from resume.yaml at ${sha}${dirty ? ' (with uncommitted edits)' : ''}, ${now.toISOString()}`;
mkdirSync(values.out, { recursive: true });

const written: string[] = [];
const write = (ext: string, data: string | Uint8Array) => {
  writeFileSync(`${base}.${ext}`, data);
  written.push(`${base}.${ext}`);
};

if (formats.includes('md')) write('md', toMarkdown(resume));
if (formats.includes('txt')) write('txt', toText(resume));
if (formats.includes('docx')) write('docx', await Packer.toBuffer(toDocx(resume, { description: source })));
if (formats.includes('pdf')) write('pdf', await printPdf());

console.log(`${source}\n${written.map((f) => `  ${f}`).join('\n')}`);

/** Print /resume/ from a fresh build, served locally, with the system's Chrome. */
async function printPdf(): Promise<Uint8Array> {
  if (resume.draft) {
    console.error('resume.yaml says draft: true, and a draft résumé is not built. Publish it, or skip pdf.');
    process.exit(1);
  }
  if (!values['no-build']) execSync('npm run build', { stdio: ['ignore', 'ignore', 'inherit'] });
  if (!existsSync('dist/resume/index.html')) {
    console.error('dist/resume/index.html is missing. Build first, or drop --no-build.');
    process.exit(1);
  }

  const types: Record<string, string> = {
    '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml',
    '.woff2': 'font/woff2', '.woff': 'font/woff', '.png': 'image/png', '.avif': 'image/avif', '.webp': 'image/webp',
  };
  const server = createServer((req, res) => {
    let path = normalize(decodeURIComponent((req.url ?? '/').split('?')[0])).replace(/^(\.\.[/\\])+/, '');
    if (path.endsWith('/')) path += 'index.html';
    const file = join('dist', path);
    if (!existsSync(file)) return void res.writeHead(404).end();
    res.writeHead(200, { 'Content-Type': types[extname(file)] ?? 'application/octet-stream' }).end(readFileSync(file));
  });
  await new Promise<void>((ok) => server.listen(0, '127.0.0.1', ok));
  const { port } = server.address() as { port: number };

  const { chromium } = await import('playwright-core');
  const browser = await chromium.launch({ channel: 'chrome' }).catch((e) => {
    console.error('Could not start Google Chrome (the PDF needs it installed):', e.message);
    process.exit(1);
  });
  try {
    const page = await browser.newPage();
    await page.goto(`http://127.0.0.1:${port}/resume/`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    // The print stylesheet sets Letter and the margins (@page in resume.astro).
    return await page.pdf({ preferCSSPageSize: true, printBackground: false });
  } finally {
    await browser.close();
    server.close();
  }
}
