import { z } from 'zod';

export const createPostSchema = z.object({
  title: z.string({
    required_error: "Title is required",
    invalid_type_error: "Title must be a string"
  }).min(1, { message: "Title must be 1 or more characters long" }),
  slug: z.string({
    required_error: "Slug is required",
    invalid_type_error: "Slug must be a string"
  }).min(1, { message: "Slug must be 1 or more characters long" }),
  content: z.string({
    required_error: "Content is required",
    invalid_type_error: "Content must be a string"
  }).min(1, { message: "Content must be 1 or more characters long" }),
  featuredImage: z.string({
    required_error: "Featured Image is required",
    invalid_type_error: "Featured Image must be a string"
  }).min(1, { message: "Featured Image must be 1 or more characters long" })
  .optional(),
});