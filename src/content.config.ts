import { defineCollection, z } from "astro:content"
import { glob } from "astro/loaders"

const careerCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/career" }),
  schema: z.object({
    date: z.string(),
    endDate: z.string().optional(),
    title: z.string(),
    image: z.string().optional(),
    color: z.string().optional(),
  }),
})

const valuesCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/values" }),
  schema: z.object({}),
})

const notesCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/notes" }),
  schema: z.object({
    date: z.string(),
    title: z.string(),
  }),
})

export const collections = {
  career: careerCollection,
  values: valuesCollection,
  notes: notesCollection,
}
