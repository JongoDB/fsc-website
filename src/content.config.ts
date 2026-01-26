import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Schema for solution pages
const solutions = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/solutions' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string(),
    description: z.string(),
    order: z.number().optional(),
    heroStyle: z.string().optional(),
  }),
});

// Schema for platform pages
const platforms = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/platforms' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string(),
    description: z.string(),
    order: z.number().optional(),
  }),
});

// Schema for training pages
const training = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/training' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string(),
    description: z.string(),
    duration: z.string().optional(),
    level: z.string().optional(),
    order: z.number().optional(),
  }),
});

// Schema for bundle pages
const bundles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/bundles' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string(),
    description: z.string(),
    order: z.number().optional(),
  }),
});

export const collections = {
  solutions,
  platforms,
  training,
  bundles,
};
