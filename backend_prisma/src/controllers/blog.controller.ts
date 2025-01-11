import { Request, Response } from "express";
import ApiError from "../utilities/ApiError";
import ApiResponse from "../utilities/ApiResponse";
import asyncHandler from "../utilities/asyncHandler";
import db from "../utilities/db";
import { createBlogType } from "../schema/blogSchema";
import { AUTH_REQUIRED } from "../constants";


/**
 * Get All Blogs
 */
export const getAllBlogs = asyncHandler(async (req: Request, res: Response) => {
    const blogs = await db.blog.findMany({
        include: {
            author: {
                select: {
                    display_name: true,
                    user_name: true,
                }
            },
        }
    });

    return res.json(new ApiResponse(blogs, "Fetched all blogs"))
});

/**
 * Get Users Blog
 */
export const getUserBlogs = asyncHandler(async (req: Request, res: Response) => {
    if (!req.currentUser) {
        throw new ApiError(401, AUTH_REQUIRED)
    }

    const user_id = req.currentUser.id;
   
    const blogs = await db.blog.findMany({
        where: {
            user_id,
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

    return res.json(new ApiResponse(blogs, "Fetched all blogs"))
});

/**
 * Get Blog by Id
 */
export const getBlogById = asyncHandler(async (req: Request, res: Response) => {

    const { blogId } = req.params;

    if (!blogId) {
        throw new ApiError(400, "Blog required data is missing")
    }

    const blog = await db.blog.findFirst({
        where: {
            id: blogId,
        },
        include: {
            posts: {
                include: {
                    author: {
                        select: {
                            display_name: true,
                            user_name: true,
                        }
                    },
                }
            },
        }
    });


    if (!blog) {
        throw new ApiError(404, "Blog not found!")
    }

    return res.json(new ApiResponse(blog, "Fetched blog with posts"))
});

/**
 * Create a new Blog
 */
export const createBlog = asyncHandler(async (req: Request<{}, {}, createBlogType>, res: Response) => {

    if (!req.currentUser) {
        throw new ApiError(401, AUTH_REQUIRED)
    }

    const { title, description } = req.body;

    const foundBlog = await db.blog.findFirst({
        where: {
            title
        }
    });

    if (foundBlog) {
        throw new ApiError(409, "Blog already exists");
    }

    const currentUser = req.currentUser.id

    const blog = await db.blog.create({
        data: {
            title,
            description,
            user_id: currentUser,
        }
    })

    return res.status(201).json(new ApiResponse(blog, "Blog has been created!"))
});

/**
 * Edit a Blog
 */
export const editBlog = asyncHandler(async (req: Request, res: Response) => {

    if (!req.currentUser) {
        throw new ApiError(401, AUTH_REQUIRED)
    }

    const { blogId } = req.params;
    const { title, description } = req.body;

    const user_id = req.currentUser.id;

    const foundBlog = await db.blog.findFirst({
        where: {
            id: blogId,
            user_id,
        }
    });

    if (!foundBlog) {
        throw new ApiError(404, "Blog not Found!");
    }

    const updatedBlog = await db.blog.update({
        where: {
            id: blogId,
            user_id,
        },
        data: {
            title,
            description,
        }
    })

    return res.json(new ApiResponse(updatedBlog, "Blog has been updated!"));
});

/**
 * Delete a Blog
 */
export const deleteBlog = asyncHandler(async (req: Request, res: Response) => {

    if (!req.currentUser) {
        throw new ApiError(401, AUTH_REQUIRED)
    }

    const user_id = req.currentUser.id;

    const { blogId } = req.params;

    const foundBlog = await db.blog.findFirst({
        where: {
            id: blogId,
            user_id
        }
    });

    if (!foundBlog) {
        throw new ApiError(404, "Blog not Found!");
    }

    const deletedRecord = await db.blog.delete({
        where: {
            id: blogId,
            user_id,
        },
    })

    return res.json(new ApiResponse(deletedRecord, "Blog has been deleted!"));
});
