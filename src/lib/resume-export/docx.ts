// Résumé → Word document. Single column, real text, standard headings and a
// plain font, because applicant-tracking systems parse that best, and because
// "send me a Word version" means a file people can edit. Returns a docx
// Document; the caller packs it (Packer.toBuffer in Node, Packer.toBlob in a
// browser), so this file has no Node-only APIs.
import {
  AlignmentType,
  BorderStyle,
  Document,
  ExternalHyperlink,
  LevelFormat,
  Paragraph,
  TextRun,
} from 'docx';
import type { Resume } from '../resume.ts';
import { bare, range } from './format.ts';

// Arial, not Calibri: every Mac, PC and previewer has it, so the file looks the
// same wherever it's opened, and parsers read it just as well.
const FONT = 'Arial';
const pt = (n: number) => n * 2; // docx sizes are half-points
const inch = (n: number) => Math.round(n * 1440); // and lengths are twips
const MUTED = '4A4F4C';

// Every run names the font itself. Word and Google Docs would inherit it from
// the document default, but Quick Look and some previewers ignore that.
type RunOptions = ConstructorParameters<typeof TextRun>[0];
const run = (o: RunOptions) => new TextRun(typeof o === 'string' ? { text: o, font: FONT } : { font: FONT, ...o });

export interface DocxOptions {
  /** Written into the file's properties, e.g. the git commit it came from. */
  description?: string;
}

function sectionHead(text: string): Paragraph {
  return new Paragraph({
    spacing: { before: 200, after: 80 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: 'BFC5C1', space: 2 } },
    children: [run({ text: text.toUpperCase(), bold: true, size: pt(9.5), characterSpacing: 20, color: MUTED })],
  });
}

/** "Role · Org" in bold, then "dates · place" under it. No tab stops or tables:
    applicant-tracking parsers misread both, and previewers misplace tabs. */
function entryHead(title: string, when: string, where?: string): Paragraph[] {
  return [
    new Paragraph({ spacing: { before: 120 }, keepNext: true, children: [run({ text: title, bold: true, size: pt(11) })] }),
    new Paragraph({
      keepNext: true,
      children: [run({ text: [when, where].filter(Boolean).join(' · '), size: pt(9.5), color: MUTED })],
    }),
  ];
}

function bullet(h: { title?: string; text: string }): Paragraph {
  return new Paragraph({
    numbering: { reference: 'dash', level: 0 },
    spacing: { after: 40 },
    children: [...(h.title ? [run({ text: `${h.title}. `, bold: true })] : []), run(h.text)],
  });
}

const body = (text: string) => new Paragraph({ spacing: { after: 60 }, children: [run(text)] });

export function toDocx(r: Resume, opts: DocxOptions = {}): Document {
  const links = [r.links.website, r.links.email, r.links.linkedin, r.links.github].filter((x): x is string => !!x);
  const children: Paragraph[] = [
    new Paragraph({ children: [run({ text: r.name, bold: true, size: pt(20) })] }),
    new Paragraph({ children: [run({ text: [r.headline, r.location].filter(Boolean).join(' · '), size: pt(11.5), color: MUTED })] }),
    new Paragraph({
      spacing: { after: 120 },
      children: links.flatMap((l, i) => [
        ...(i ? [run({ text: '  ·  ', color: MUTED, size: pt(9.5) })] : []),
        new ExternalHyperlink({
          link: l.includes('@') ? `mailto:${l}` : `https://${bare(l)}`,
          children: [run({ text: bare(l), size: pt(9.5) })],
        }),
      ]),
    }),
    body(r.summary),
  ];

  children.push(sectionHead('Experience'));
  for (const job of r.experience) {
    children.push(...entryHead(`${job.role} · ${job.org}`, range(job.start, job.end), job.location));
    if (job.summary) children.push(body(job.summary));
    children.push(...job.highlights.map(bullet));
  }
  if (r.earlier?.length) {
    children.push(
      new Paragraph({
        spacing: { before: 120 },
        children: [run({ text: 'Earlier: ', bold: true }), run(r.earlier.join('; '))],
      }),
    );
  }

  if (r.projects?.length) {
    children.push(sectionHead('Projects'));
    for (const p of r.projects) {
      children.push(...entryHead(p.name, p.period, p.url ? bare(p.url) : undefined), body(p.summary), ...p.highlights.map(bullet));
    }
  }

  children.push(sectionHead('Skills'));
  for (const s of r.skills) {
    children.push(new Paragraph({ spacing: { after: 30 }, children: [run({ text: `${s.group}: `, bold: true }), run(s.items.join(', '))] }));
  }

  children.push(sectionHead('Education'));
  for (const ed of r.education) {
    children.push(...entryHead(ed.credential, range(ed.start, ed.end), [ed.institution, ed.location].filter(Boolean).join(' · ')));
    children.push(...ed.notes.map((n) => bullet({ text: n })));
  }

  return new Document({
    creator: r.name,
    title: `${r.name} · Résumé`,
    description: opts.description,
    styles: { default: { document: { run: { font: FONT, size: pt(10.5) }, paragraph: { spacing: { line: 264 } } } } },
    numbering: {
      config: [
        {
          reference: 'dash',
          levels: [{ level: 0, format: LevelFormat.BULLET, text: '–', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: inch(0.22), hanging: inch(0.16) } } } }],
        },
      ],
    },
    sections: [
      {
        properties: { page: { size: { width: inch(8.5), height: inch(11) }, margin: { top: inch(0.6), bottom: inch(0.6), left: inch(0.6), right: inch(0.6) } } },
        children,
      },
    ],
  });
}
