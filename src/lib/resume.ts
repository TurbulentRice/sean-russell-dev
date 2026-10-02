// The résumé's shape. One schema, two users: the `resume` content collection
// (src/content.config.ts) validates the YAML at build time, and
// scripts/import-resume.ts asks Claude to fill it from a .docx.
//
// Runs under plain Node too (the import script uses type stripping), so keep
// it free of Astro imports and TS-only syntax such as enums.
import { z } from 'zod';

// "2024-01". Months are enough for a résumé and sort as strings.
const month = z.string().regex(/^\d{4}-\d{2}$/, 'YYYY-MM');

// Public by design: the repo and the site are public. No street address, no
// phone number. They can go on a PDF sent by hand, never in here.
const links = z.object({
  email: z.string().optional(),
  github: z.string().optional(),
  linkedin: z.string().optional(),
  website: z.string().optional(),
});

const highlight = z.object({
  // The lead-in before the colon ("Cache Invalidation"), when there is one.
  title: z.string().optional(),
  text: z.string(),
});

const job = z.object({
  org: z.string(),
  location: z.string().optional(),
  role: z.string(),
  start: month,
  // null = present.
  end: month.nullable(),
  summary: z.string().optional(),
  highlights: z.array(highlight),
});

const school = z.object({
  institution: z.string(),
  location: z.string().optional(),
  credential: z.string(),
  start: month.optional(),
  end: month.optional(),
  notes: z.array(z.string()),
});

/** What the importer extracts: everything that comes from the document itself. */
export const ResumeContent = z.object({
  name: z.string(),
  headline: z.string(),
  // City and region only.
  location: z.string().optional(),
  links,
  summary: z.string(),
  skills: z.array(z.object({ group: z.string(), items: z.array(z.string()) })),
  experience: z.array(job),
  education: z.array(school),
});

/** The file on disk: the content, plus fields only a person sets. */
export const Resume = ResumeContent.extend({
  // A draft renders with a banner on /resume and stays out of the sitemap.
  draft: z.boolean().default(true),
  // When a person last checked this against reality.
  reviewed: month.optional(),
});

export type Resume = z.infer<typeof Resume>;
