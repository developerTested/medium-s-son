import { Prisma } from '@prisma/client';
import { z } from 'zod';
import db from '../utilities/db';

export const createBlogSchema = z.object({
  title: z.string({
    required_error: "Title is required",
    invalid_type_error: "Title must be a string"
  }).min(1, { message: "Title must be 1 or more characters long" }),
  description: z.string({
    required_error: "Description is required",
    invalid_type_error: "Description must be a string"
  }).min(1, { message: "Title must be 1 or more characters long" }),
});

export type createBlogType = z.infer<typeof createBlogSchema>;

export type BlogCreateBody = Prisma.Args<typeof db.blog, 'create'>['data']