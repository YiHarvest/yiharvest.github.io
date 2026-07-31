import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()),
    image: z.string(),
    imageAlt: z.string(),
    github: z.string().optional(),
    pypi: z.string().optional(),
    docs: z.string().optional(),
    publishedAt: z.date().optional(),
    status: z.enum(['active', 'archived', 'completed']).default('active'),
  }),
});

const notes = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/notes' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    publishedAt: z.date(),
    tags: z.array(z.string()).optional(),
  }),
});

export const collections = { projects, notes };
