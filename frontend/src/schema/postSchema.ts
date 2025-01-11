import { z } from 'zod';

export const PostSchema = z.object({
  title: z.string({
    required_error: "Title is required",
    invalid_type_error: "Title must be a string"
  }),
  slug: z.string({
    required_error: "Slug is required",
    invalid_type_error: "Slug must be a string"
  }),
  content: z.string({
    required_error: "Content is required",
    invalid_type_error: "Content must be a string"
  }),
});

export type PostBodyType = z.infer<typeof PostSchema>;