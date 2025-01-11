import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import { createBlog, deleteBlog, editBlog, getAllBlogs, getBlogById, getUserBlogs } from "../controllers/blog.controller";

const blogRouter = Router();

// Get All Blogs
blogRouter.get("/", getAllBlogs);

// Create a new Blog
blogRouter.get("/users", authMiddleware, getUserBlogs);

// Create a new Blog
blogRouter.post("/", authMiddleware, createBlog);

// Get a blog
blogRouter.get("/:blogId", getBlogById);

// Update a blog
blogRouter.put("/:blogId", authMiddleware, editBlog);

// Delete a blog
blogRouter.delete("/:blogId", authMiddleware, deleteBlog);

export default blogRouter;