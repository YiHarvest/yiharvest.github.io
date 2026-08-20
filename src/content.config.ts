import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    descriptionEn: z.string(),
    tags: z.array(z.string()),
    image: z.string(),
    imageAlt: z.string(),
    imageAltEn: z.string(),
    github: z.string().optional(),
    pypi: z.string().optional(),
    docs: z.string().optional(),
    publishedAt: z.date().optional(),
    status: z.enum(['active', 'archived', 'completed']).default('active'),
    priority: z.number().int().default(100),
    origin: z.enum(['original', 'adapted-fork']).default('original'),
  }),
});

const notes = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/notes' }),
  schema: z.object({
    title: z.string(),
    titleEn: z.string(),
    description: z.string().optional(),
    descriptionEn: z.string().optional(),
    publishedAt: z.date(),
    tags: z.array(z.string()).optional(),
  }),
});

export const collections = { projects, notes };
