import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { Resume } from './lib/resume.ts';

// A draft builds in `npm run dev` and nowhere else (src/lib/content.ts).
const draft = z.boolean().default(false);

/** Case studies: the professional front. Few, deep, decision-focused. */
const work = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/work' }),
  schema: z.object({
    title: z.string(),
    // One sentence: the outcome, not the technology.
    summary: z.string(),
    // The one-word discipline shown beside it in lists: reliability, data, product…
    area: z.string(),
    role: z.string(),
    period: z.string(),
    stack: z.array(z.string()),
    // Lower sorts first on /work and the home page.
    order: z.number(),
    featured: z.boolean().default(false),
    links: z.object({ live: z.url().optional(), repo: z.url().optional() }).default({}),
    draft,
  }),
});

/** The lab: experiments, labelled as such. Rough edges allowed. */
const lab = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/lab' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    status: z.enum(['live', 'wip', 'archived']),
    date: z.coerce.date(),
    stack: z.array(z.string()),
    draft,
  }),
});

/** Notes: the blog. Built from day one, kept out of the nav until it has posts. */
const notes = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/notes' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    date: z.coerce.date(),
    draft,
  }),
});

/** One entry, `resume`, from resume.yaml. Schema shared with scripts/import-resume.ts. */
const resume = defineCollection({
  loader: glob({ pattern: 'resume.yaml', base: './src/content/resume' }),
  schema: Resume,
});

export const collections = { work, lab, notes, resume };
