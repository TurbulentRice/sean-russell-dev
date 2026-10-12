// Formatting shared by every résumé export. Plain TypeScript with no Node or
// Astro APIs: the CLI (scripts/export-resume.ts) and P3's in-browser tool both
// import it. Under Node it runs with type stripping, so no enums, and imports
// keep their .ts extensions.
import type { Resume } from '../resume.ts';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** "2024-01" → "Jan 2024"; null or missing → "Present". */
export function month(m?: string | null): string {
  if (!m) return 'Present';
  const [y, mo] = m.split('-');
  return `${MONTHS[Number(mo) - 1]} ${y}`;
}

/** "Jan 2024 – Present", or just the end when there's no start (a degree). */
export function range(start?: string | null, end?: string | null): string {
  return start ? `${month(start)} – ${month(end)}` : end ? month(end) : '';
}

export const bare = (u: string) => u.replace(/^https?:\/\//, '').replace(/\/$/, '');

/** Contact details in display order, as plain addresses (they print and paste well). */
export function contacts(r: Resume): string[] {
  const { website, email, linkedin, github } = r.links;
  return [website, email, linkedin, github].filter((x): x is string => !!x).map(bare);
}

/** "Role · Org · Location", the one-line identity of a job. */
export function jobLine(job: Resume['experience'][number]): string {
  return [job.role, job.org, job.location].filter(Boolean).join(' · ');
}
