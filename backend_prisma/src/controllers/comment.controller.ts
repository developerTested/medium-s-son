import { Request, Response } from "express";
import ApiError from "../utilities/ApiError";
import ApiResponse from "../utilities/ApiResponse";
import asyncHandler from "../utilities/asyncHandler";
import db from "../utilities/db";
import { AUTH_REQUIRED } from "../constants";
import { isValidObjectId } from "../utilities/helper";

/**
 * Get all comments
 */
export const getAllComments = asyncHandler(async (req: Request, res: Response) => {
    const { postId } = req.params;

    if (!postId || !isValidObjectId(postId)) {
        throw new ApiError(400, "Invalid Post ID");
    }

    const post = await db.post.findFirst({
        where: {
            id: postId,
        },
    });

    if (!post) {
        throw new ApiError(404, "Post not found!")
    }

    const comment = await db.comment.findMany({
        where: {
            post_id: postId,
        },
        include: {
            author: {
                select: {
                    display_name: true,
                    user_name: true,
                }
            },
            _count: {
                select: {
                    likes: true,
                }
            }
        }
    });

    if (!comment) {
        throw new ApiError(404, "Comments not found!")
    }

    return res.json(new ApiResponse(comment, "Fetched all comments"))
});


/**
 * Get all comments
 */
export const getCommentByID = asyncHandler(async (req: Request, res: Response) => {
    const { postId } = req.params;

    if (!postId || !isValidObjectId(postId)) {
        throw new ApiError(400, "Invalid Post ID");
    }

    const post = await db.post.findFirst({
        where: {
            id: postId,
        },
    });

    if (!post) {
        throw new ApiError(404, "Post not found!")
    }

    const comment = await db.comment.findFirst({
        where: {
            post_id: postId,
        },
        include: {
            author: {
                select: {
                    display_name: true,
                    user_name: true,
                }
            },
            _count: {
                select: {
                    likes: true,
                }
            }
        }
    });

    if (!comment) {
        throw new ApiError(404, "Comments not found!")
    }

    return res.json(new ApiResponse(comment, "Fetched all comments"))

});

/**
 * Create a new Comment
 */
export const createComment = asyncHandler(async (req: Request, res: Response) => {
    if (!req.currentUser) {
        throw new ApiError(401, AUTH_REQUIRED)
    }

    const user_id = req.currentUser.id;

    const { content } = req.body as { content: string };

    const { postId } = req.params;

    if (!postId || !isValidObjectId(postId)) {
        throw new ApiError(400, "Invalid Post ID");
    }

    const post = await db.post.findFirst({
        where: {
            id: postId,
        },
    });

    if (!post) {
        throw new ApiError(404, "Post not found!")
    }

    const existsComment = await db.comment.findFirst({
        where: {
            content,
            post_id: postId,
            user_id,
        }
    })

    if (existsComment) {
        throw new ApiError(409, "Comment already exists.")
    }

    const comment = await db.comment.create({
        data: {
            user_id,
            post_id: postId,
            content,
        },
        include: {
            author: {
                select: {
                    display_name: true,
                    user_name: true,
                }
            },
        }
    });

    return res.status(201).json(new ApiResponse(comment, "Comment created.", 201));
});


/**
 * Delete a comment
 */
export const deleteComment = asyncHandler(async (req: Request, res: Response) => {
    if (!req.currentUser) {
        throw new ApiError(401, AUTH_REQUIRED)
    }

    const user_id = req.currentUser.id;

    const { content } = req.body as { content: string };

    const { postId, commentId } = req.params

    if (!postId || !isValidObjectId(postId)) {
        throw new ApiError(404, "Post not found!")
    }

    const post = await db.post.findFirst({
        where: {
            id: postId,
        },
    });

    if (!post) {
        throw new ApiError(404, "Post not found!")
    }

    const existsComment = await db.comment.findFirst({
        where: {
            content,
            post_id: postId,
            user_id,
        }
    })

    if (!existsComment) {
        throw new ApiError(404, "Comment not found.")
    }

    const comment = await db.comment.delete({
        where: {
            id: commentId,
            user_id,
            post_id: postId,
        }
    });

    return res.json(new ApiResponse(comment, "Comment has been deleted!"));
});

/**
 * Toggle Comment Like
 */
export const toggleCommentLike = asyncHandler(async (req: Request, res: Response) => {
    /**
     * Check if the user is authenticated
     */
    if (!req.currentUser) {
        throw new ApiError(401, AUTH_REQUIRED)
    }

    const userId = req.currentUser.id;

    /**
     * Get the post id
     */
    const { postId, commentId } = req.params;

    /**
     * Check if post id is valid
     */
    if (!postId || !isValidObjectId(postId)) {
        throw new ApiError(400, "Invalid Post ID");
    }

    /**
     * Check if post exists
     */
    const post = await db.post.findUnique({
        where: {
            id: postId,
        },
    });

    if (!post) {
        throw new ApiError(404, "Post not found!")
    }

    const like = await db.like.findFirst({
        where: {
            comment_id: commentId,
            user_id: userId,
            type: "COMMENT",
        }
    });

    if (!like) {

        await db.like.create({
            data: {
                comment_id: commentId,
                user_id: userId,
                type: "COMMENT",
            }
        })

        return res.json(new ApiResponse({}, "You've liked the Comment!"));
    }


    await db.like.delete({
        where: {
            id: like.id,
            comment_id: commentId,
            user_id: userId,
            type: "COMMENT",
        }
    })

    return res.json(new ApiResponse({}, "You've taken back the like!"));
});