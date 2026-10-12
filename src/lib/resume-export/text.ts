// Résumé → plain text, wrapped at 80 columns. For forms that strip formatting.
import type { Resume } from '../resume.ts';
import { contacts, range } from './format.ts';

function wrap(text: string, width = 80, indent = ''): string {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = '';
  for (const w of words) {
    if ((line + ' ' + w).trim().length > width - indent.length && line) {
      lines.push(line);
      line = w;
    } else line = line ? `${line} ${w}` : w;
  }
  if (line) lines.push(line);
  return lines.map((l, i) => (i === 0 ? l : indent + l)).join('\n');
}

const head = (s: string) => `\n${s.toUpperCase()}\n${'-'.repeat(s.length)}`;
const item = (h: { title?: string; text: string }) => '  - ' + wrap(`${h.title ? `${h.title}. ` : ''}${h.text}`, 80, '    ');

export function toText(r: Resume): string {
  const out: string[] = [r.name.toUpperCase(), [r.headline, r.location].filter(Boolean).join(' · '), contacts(r).join(' · '), '', wrap(r.summary)];

  out.push(head('Experience'));
  for (const job of r.experience) {
    out.push('', `${job.role}, ${job.org}`, `${range(job.start, job.end)}${job.location ? ` · ${job.location}` : ''}`);
    if (job.summary) out.push(wrap(job.summary));
    out.push(...job.highlights.map(item));
  }
  if (r.earlier?.length) out.push('', 'Earlier: ' + r.earlier.join('; '));

  if (r.projects?.length) {
    out.push(head('Projects'));
    for (const p of r.projects) {
      out.push('', `${p.name}${p.url ? ` (${p.url})` : ''}`, p.period, wrap(p.summary), ...p.highlights.map(item));
    }
  }

  out.push(head('Skills'), '', ...r.skills.map((s) => wrap(`${s.group}: ${s.items.join(', ')}`, 80, '  ')));

  out.push(head('Education'));
  for (const ed of r.education) {
    const when = range(ed.start, ed.end);
    out.push('', `${ed.credential}, ${ed.institution}${when ? ` (${when})` : ''}`, ...ed.notes.map((n) => '  - ' + wrap(n, 80, '    ')));
  }
  return out.join('\n') + '\n';
}
