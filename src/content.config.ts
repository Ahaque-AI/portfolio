import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Content collections for the portfolio.
 *
 * - experience: work history. One entry per role.
 * - projects:    research / side / case-study work with optional rich body.
 *
 * Authored as Markdown so content can be edited without touching components.
 * Ordering is explicit (`order`) so we never depend on filesystem ordering.
 */

const linkSchema = z.object({
  label: z.string(),
  href: z.url(),
  type: z.enum(['code', 'paper', 'demo', 'other']).optional(),
});

const experience = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/experience' }),
  schema: z.object({
    company: z.string(),
    role: z.string(),
    /** ISO date string. Omit `endDate` for ongoing roles. */
    startDate: z.string(),
    endDate: z.string().optional(),
    location: z.string(),
    summary: z.string(),
    highlights: z.array(z.string()),
    stack: z.array(z.string()),
    order: z.number().default(0),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    period: z.string(),
    stack: z.array(z.string()),
    links: z.array(linkSchema).default([]),
    featured: z.boolean().default(false),
    /** True for research work that warrants a full case-study page. */
    caseStudy: z.boolean().default(false),
    order: z.number().default(0),
  }),
});

export const collections = { experience, projects };
