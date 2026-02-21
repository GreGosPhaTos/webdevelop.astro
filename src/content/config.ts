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
      keywords: z.string().optional(),
    }),
    hero: z.object({
      firstName: z.string(),
      lastName: z.string(),
      tagline: z.string(),
      glitchVerbs: z.array(z.string()),
    }),
    sections: z.object({
      articles: z.string(),
      works: z.string(),
    }),
    blog: z.object({
      title: z.string(),
      heading: z.string(),
      subtitle: z.string(),
      label: z.string(),
    }).optional(),
    projects: z.array(z.object({
      name: z.string(),
      description: z.string(),
      url: z.string(),
    })),
    footer: z.object({
      copy: z.string(),
    }),
  }),
});

export const collections = {
  blog: blogCollection,
  homepage: homepageCollection,
};

