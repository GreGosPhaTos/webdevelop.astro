import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    author: z.string().default('Adrien Petitjean'),
    tags: z.array(z.string()),
    draft: z.boolean().default(false),
  }),
});

const homepageCollection = defineCollection({
  type: 'data',
  schema: z.object({
    meta: z.object({
      title: z.string(),
      description: z.string(),
    }),
    hero: z.object({
      firstName: z.string(),
      lastName: z.string(),
      tagline: z.string(),
    }),
    sections: z.object({
      articles: z.string(),
      works: z.string(),
    }),
    footer: z.object({
      copy: z.string(),
    }),
  }),
});

export const collections = {
  blog: blogCollection,
  homepage: homepageCollection,
};
