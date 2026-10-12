// Résumé → Markdown. Good for pasting into forms, READMEs and LinkedIn's About.
import type { Resume } from '../resume.ts';
import { contacts, range } from './format.ts';

const bullet = (h: { title?: string; text: string }) => `- ${h.title ? `**${h.title}.** ` : ''}${h.text}`;

export function toMarkdown(r: Resume): string {
  const out: string[] = [];
  out.push(`# ${r.name}`, '', [r.headline, r.location].filter(Boolean).join(' · '), '', contacts(r).join(' · '), '', r.summary, '');

  out.push('## Experience', '');
  for (const job of r.experience) {
    out.push(`### ${job.role}, ${job.org}`, '', `*${range(job.start, job.end)}${job.location ? ` · ${job.location}` : ''}*`, '');
    if (job.summary) out.push(job.summary, '');
    if (job.highlights.length) out.push(...job.highlights.map(bullet), '');
  }
  if (r.earlier?.length) out.push('**Earlier:** ' + r.earlier.join('; '), '');

  if (r.projects?.length) {
    out.push('## Projects', '');
    for (const p of r.projects) {
      out.push(`### ${p.name}${p.url ? ` (${p.url})` : ''}`, '', `*${p.period}*`, '', p.summary, '');
      if (p.highlights.length) out.push(...p.highlights.map(bullet), '');
    }
  }

  out.push('## Skills', '', ...r.skills.map((s) => `- **${s.group}:** ${s.items.join(', ')}`), '');

  out.push('## Education', '');
  for (const ed of r.education) {
    const when = range(ed.start, ed.end);
    out.push(`- **${ed.credential}**, ${ed.institution}${when ? ` (${when})` : ''}`);
    for (const n of ed.notes) out.push(`  - ${n}`);
  }
  return out.join('\n').replace(/\n{3,}/g, '\n\n').trimEnd() + '\n';
}

