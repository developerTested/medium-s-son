import { Request, Response } from "express";
import ApiError from "../utilities/ApiError";
import ApiResponse from "../utilities/ApiResponse";
import asyncHandler from "../utilities/asyncHandler";
import { AUTH_REQUIRED } from "../constants";
import { findPostById, isValidObjectId } from "../utilities/helper";
import { deleteFileFromCloudinary, uploadToCloudinary } from "../utilities/cloudinary";
import { createPostType, editPostType } from "../types/postTypes";
import db from "../utilities/db";

/**
 * Get All Posts
 */
export const getAllPosts = asyncHandler(async (req: Request, res: Response) => {

    /**
     * Get all posts with author details
     */
    const posts = await db.post.findMany({
        include: {
            author: {
                select: {
                    display_name: true,
                    user_name: true,
                }
            },
            _count: {
                select: {
                    comments: true,
                    likes: true,
                }
            }
        },
        orderBy: {
            createdAt: "desc",
        }
    });

    /**
     * Check if there are no posts
     */
    if (!posts) {
        throw new ApiError(404, "There are no posts!")
    }

    return res.json(new ApiResponse(posts, "Fetched All Posts!"))
});

/**
 * Get Post by ID
 */
export const getPostById = asyncHandler(async (req: Request, res: Response) => {

    /**
     * Get the post id
     */
    const { postId } = req.params;

    /**
     * Check if post id is valid
     */

    if (!postId) {
        throw new ApiError(400, "Post requested data is Invalid")
    }

    /**
     * Check if post exists
     */
    const post = await findPostById(postId);

    if (!post?.id) {
        throw new ApiError(404, "Post not found!")
    }

    return res.json(new ApiResponse(post, "Fetched posts with comments"))
});

/**
 * Create a new post
 */
export const createPost = asyncHandler(async (req: Request, res: Response) => {
    /**
    * Get the input for the post
    */
    const { title, content, slug } = req.body as createPostType;

    /**
     * Check if the user is authenticated
     */
    if (!req.currentUser) {
        throw new ApiError(401, AUTH_REQUIRED)
    }

    const userId = req.currentUser.id;

    /**
     * Featured Image
     */
    const featuredImageLocalPath = req.file?.path || "";

    const featuredImage = await uploadToCloudinary(featuredImageLocalPath);

    /**
     * Check if post exists
     */
    const postExists = await db.post.findFirst({
        where: {
            slug,
        }
    })

    if (postExists) {
        throw new ApiError(409, "Post already exists.");
    }

    /**
     * Create a new post
     */
    const post = await db.post.create({
        data: {
            title,
            content,
            slug,
            user_id: userId,
            featuredImage
        }
    });

    return res.status(201).json(new ApiResponse(post, "Post has been created successfully!"))
});

/**
 * Edit a post
 */
export const editPost = asyncHandler(async (req: Request, res: Response) => {
    /**
     * Check if the user is authenticated
     */
    if (!req.currentUser) {
        throw new ApiError(401, AUTH_REQUIRED)
    }

    const userId = req.currentUser.id;

    /**
     * Get the input for the post
     */
    const { title, content, slug, blog_id } = req.body;

    /**
     * Get the post id
     */
    const { postId } = req.params;

    /**
     * Check if post id is valid
     */
    if (!postId || !isValidObjectId(postId)) {
        throw new ApiError(400, "Invalid Post ID");
    }

    /**
     * Check if post exists
     */
    const post = await db.post.findFirst({
        where: {
            id: postId,
            user_id: userId,
        },
    });

    if (!post) {
        throw new ApiError(404, "Post not found!")
    }

    const formData: editPostType = {
        title,
        slug,
        content,
        blog_id
    }

    /**
   * Featured Image
   */
    const featuredImageLocalPath = req.file?.path || "";

    if (featuredImageLocalPath) {
        await deleteFileFromCloudinary(featuredImageLocalPath);
    }

    try {
        const featuredImage = await uploadToCloudinary(featuredImageLocalPath);

        if (featuredImage) {
            formData.featuredImage = featuredImage;
        }
    } catch (error) {
        throw new ApiError(500, "Unable to upload image to cloudinary");
    }


    /**
     * Update Post and return updated post
     */
    const updatedPost = await db.post.update({
        where: {
            id: postId,
            user_id: userId,
        },
        data: formData,
        include: {
            blog: true,
            author: {
                select: {
                    display_name: true,
                    user_name: true,
                }
            },
        }
    })

    return res.json(new ApiResponse(updatedPost, "Post has been updated!"));
});

/**
 * Delete a post
 */
export const deletePost = asyncHandler(async (req: Request, res: Response) => {
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
    const { postId } = req.params;

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

    /**
     * Delete the featured image
     */
    if (post.featuredImage) {
        await deleteFileFromCloudinary(post.featuredImage);
    }

    /**
     * Delete post
     */
    await db.post.delete({
        where: {
            id: postId,
            user_id: userId,
        }
    })

    return res.json(new ApiResponse({}, "Post has been deleted!"));
});

/**
 * Check user liked post or not
 */
export const hasLiked = asyncHandler(async (req: Request, res: Response) => {
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
    const { postId } = req.params;

    /**
     * Check if post id is valid
     */
    if (!postId || !isValidObjectId(postId)) {
        throw new ApiError(400, "Invalid Post ID");
    }

    const existingLike = await db.like.findFirst({
        where: { post_id: postId, user_id: userId, type: "POST" },
    });

    return res.json(new ApiResponse({
        hasLiked: existingLike ? true : false,
    }));
});

/**
 * Toggle Post Like
 */
export const togglePostLike = asyncHandler(async (req: Request, res: Response) => {
    // Ensure user is authenticated
    if (!req.currentUser) {
        throw new ApiError(401, AUTH_REQUIRED);
    }

    const userId = req.currentUser.id;
    const { postId } = req.params;

    // Validate post ID
    if (!postId || !isValidObjectId(postId)) {
        throw new ApiError(400, "Invalid Post ID");
    }

    // Check if post exists
    const post = await db.post.findUnique({
        where: { id: postId },
    });

    if (!post) {
        throw new ApiError(404, "Post not found!");
    }

    // Perform the like toggle and get updated like count in a transaction
    const result = await db.$transaction(async (prisma) => {
        // Find if the user already liked the post
        const existingLike = await prisma.like.findFirst({
            where: { post_id: postId, user_id: userId, type: "POST" },
        });

        let updatedLikeCount = 0;
        let responseMessage = "";
        let hasLiked = false;

        if (!existingLike) {
            // If the post is not liked by the user, create the like
            await prisma.like.create({
                data: {
                    post_id: postId,
                    user_id: userId,
                },
            });
            responseMessage = "You've liked the Post!";
            hasLiked = true;  // Set hasLiked to true when the user likes the post
        } else {
            // If already liked, delete the like
            await prisma.like.delete({
                where: { id: existingLike.id },
            });
            responseMessage = "You've taken back the like!";
            hasLiked = false;  // Set hasLiked to false when the user unlikes the post
        }

        // Get the updated like count for the post after the like toggle
        updatedLikeCount = await prisma.like.count({
            where: { post_id: postId },
        });

        return { updatedLikeCount, responseMessage, hasLiked };
    });

    // Send the response with the updated like count, message, and hasLiked status
    return res.json(new ApiResponse(
        {
            likes: result.updatedLikeCount,
            hasLiked: result.hasLiked,
        },
        result.responseMessage,
    ));
});
