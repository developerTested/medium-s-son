import { z } from "zod";
import { createPostSchema } from "../schema/postSchema";

export type createPostType = z.infer<typeof createPostSchema>;
export type editPostType = {
  title: string,
  slug: string,
  content: string,
  featuredImage?: string,
  blog_id?: string,
};