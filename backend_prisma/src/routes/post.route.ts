import { Router } from "express";
import validateRequest from "../middlewares/validateRequest.middleware";
import authMiddleware from "../middlewares/auth.middleware";
import { createPost, deletePost, editPost, getAllPosts, getPostById, hasLiked, togglePostLike } from "../controllers/posts.controller";
import { createComment, deleteComment, getAllComments, getCommentByID, toggleCommentLike } from "../controllers/comment.controller";
import { createPostSchema } from "../schema/postSchema";
import upload from "../middlewares/muter.middleware";

const postRouter = Router();

// Get All Posts of a Blog
postRouter.get("/", getAllPosts);

// Get a blog post
postRouter.get("/:postId", getPostById);

// Create a new blog post
postRouter.post("/", authMiddleware, upload.single("featuredImage"), validateRequest(createPostSchema), createPost);

// Update a blog post
postRouter.put("/:postId", authMiddleware, upload.single("featuredImage"), validateRequest(createPostSchema), editPost);

// Delete a blog post
postRouter.delete("/:postId", authMiddleware, deletePost);

// Like a blog post
postRouter.get("/:postId/like", authMiddleware, hasLiked);

// Like a blog post
postRouter.post("/:postId/like", authMiddleware, togglePostLike);

// Get All Comments
postRouter.get("/:postId/comments", getAllComments)

// Create a new Post
postRouter.post("/:postId/comments", authMiddleware, createComment)

// Get Comment by Id
postRouter.get("/:postId/comments/:commentId", getCommentByID)

// Like Comment by Id
postRouter.post("/:postId/comments/:commentId/like",authMiddleware, toggleCommentLike)

// Delete a new Post
postRouter.delete("/:postId/comments/:commentId", authMiddleware, deleteComment)

export default postRouter;