// Turn a résumé .docx into src/content/resume/resume.yaml.
//
//   npm run import-resume -- <file.docx>            write the YAML (refuses to overwrite)
//   npm run import-resume -- <file.docx> --force    overwrite
//   npm run import-resume -- <file.docx> --text     print the extracted text only (no API call)
//
// A one-way bootstrap, not a sync: after import, the YAML is the source of
// truth and the .docx is history. The result is always a draft. Read the diff
// before you publish it.
//
// Needs Anthropic credentials (ANTHROPIC_API_KEY, or `ant auth login`).
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, basename } from 'node:path';
import { parseArgs } from 'node:util';
import Anthropic from '@anthropic-ai/sdk';
import { betaZodOutputFormat } from '@anthropic-ai/sdk/helpers/beta/zod';
import mammoth from 'mammoth';
import { stringify } from 'yaml';
import { ResumeContent } from '../src/lib/resume.ts';

const OUT = 'src/content/resume/resume.yaml';

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    force: { type: 'boolean', default: false },
    text: { type: 'boolean', default: false },
  },
});

const [docx] = positionals;
if (!docx) {
  console.error('usage: npm run import-resume -- <file.docx> [--force] [--text]');
  process.exit(1);
}

const { value: text } = await mammoth.extractRawText({ buffer: readFileSync(docx) });

if (values.text) {
  console.log(text);
  process.exit(0);
}

if (existsSync(OUT) && !values.force) {
  console.error(`${OUT} exists. Pass --force to overwrite it (then review the git diff).`);
  process.exit(1);
}

const SYSTEM = `You convert a résumé's plain text into structured data for a personal website.

Rules:
- Be faithful. Keep the author's wording; fix only obvious typos and spacing. Do not invent, embellish, or summarise away facts or numbers.
- Never include a street address or phone number. "location" is city and region only (e.g. "Schenectady, NY").
- Links: email, GitHub, LinkedIn and personal website only, as written.
- Dates are YYYY-MM. A current role ("present") has end: null. If only a year is given, use January for a start and December for an end.
- A bullet written as "Lead-in: text" becomes {title: "Lead-in", text: "text"}. Drop empty bullets.
- Keep the document's ordering of jobs, schools and skill groups.
- If the summary or headline has an unfinished sentence or a blank (e.g. "Seeking a new opportunity in ."), drop that fragment rather than completing it.`;

const client = new Anthropic();

const response = await client.beta.messages.parse({
  model: 'claude-opus-5-5',
  max_tokens: 16000,
  output_config: { effort: 'low', format: betaZodOutputFormat(ResumeContent) },
  // On a safety decline, the API reroutes to its recommended fallback model.
  betas: ['server-side-fallback-2026-07-01'],
  fallbacks: 'default',
  system: SYSTEM,
  messages: [{ role: 'user', content: `<resume>\n${text}\n</resume>` }],
});

if (response.stop_reason === 'refusal') {
  console.error('The model declined the request:', response.stop_details);
  process.exit(1);
}
if (response.stop_reason === 'max_tokens' || !response.parsed_output) {
  console.error(`No usable output (stop_reason: ${response.stop_reason}).`);
  process.exit(1);
}

const header = [
  `# Imported from ${basename(docx)} on ${new Date().toISOString().slice(0, 10)} by scripts/import-resume.ts.`,
  '# Schema: src/lib/resume.ts. Review, edit, set `reviewed`, then set `draft: false`.',
  '',
].join('\n');

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, header + stringify({ draft: true, ...response.parsed_output }, { lineWidth: 0 }));
console.log(`Wrote ${OUT} (${response.usage.input_tokens} in / ${response.usage.output_tokens} out tokens).`);
