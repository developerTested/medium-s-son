export type ApiErrorResponse = {
    success: string,
    statusCode: number,
    message: string,
    data: null,
    errors: any,
}

export type ApiResponse = {
    success: boolean,
    statusCode: number,
    message: string,
    data: any,
}

export type UserType = {
    id: string,
    user_name: string,
    display_name: string,
    email: string,
    avatar: string,
    password: string,
    refreshToken: String | null,
    createdAt: string,
    updatedAt: string,
}

/**
 * Blog Type
 */
export type CreateBlogType = {
    title: string,
    description: string,
}

export type BlogType = {
    id: string,
    user_id: number,
    title: string,
    description: string,
    createdAt: string,
    updatedAt: string,
    author: UserType,
    posts?: PostType[],
    _count: BlogCount | CommentsCount | PostCount,
}

export type CreatePostType = {
    id: string,
    blog_id: string,
    title: string,
    slug: string,
    content: string,
    published: boolean,
    status: string,
    images: any,
}

export type PostType = {
    id: string,
    blog_id: string,
    user_id: string,
    title: string,
    slug: string,
    content: string,
    featuredImage?: string,
    published: boolean,
    status: string,
    createdAt: string,
    updatedAt: string,
    author: UserType,
    blog: BlogType,
    _count: countType
}

export type CommentType = {
    id: string,
    blog_id: string,
    user_id: string,
    content: string,
    createdAt: string,
    updatedAt: string,
    author: UserType,
    _count: LikeCount
}

type BlogCount = {
    blogs: number,
}

type PostCount = {
    posts: number,
}

type CommentsCount = {
    comments: number,
}


type LikeCount = {
    likes: number,
}


type countType = CommentsCount & LikeCount