import ApiError from "./ApiError";
import db from "./db";
import bcrypt from "bcrypt"
import dotenv from "dotenv"
import jwt from "jsonwebtoken";
import { AUTH_FAILED } from "../constants";
import { registerType } from "../schema/authSchema";
import { UserType } from "../types/authTypes";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

/**
 * Load environment variables
 */
dotenv.config();

/**
 * App Configuration
 */
export const appConfig = {
    debug: process.env.APP_DEBUG === 'true' || false,

    FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:5173",

    // Access Token
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || "",
    ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY || "",

    // Refresh Token
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || "",
    REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY || "",

    // Database
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,

    // MongoDB Database
    MONGODB_URL: process.env.MONGODB_URL,

    // Email
    EMAIL_FROM: process.env.EMAIL_FROM || "",
    RESEND_API: process.env.RESEND_API || "",
}

/**
 * Get Initials
 * @param inputName 
 * @returns 
 */
export function getInitials(inputName: string) {
    const names = inputName.split(' ');
    let initials = names[0].substring(0, 1).toUpperCase();

    if (names.length > 1) {
        initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }

    return initials;
}

/**
 * Stringify bigInt to JSON
 * @param data 
 * @returns 
 */
export function stringifyToJSON(data: any) {
    const json = JSON.stringify(data, (key, value) => (typeof value === 'bigint' ? value.toString() : value));
    return JSON.parse(json);
}

/**
 * Exclude keys from object
 * @param obj 
 * @param keysToRemove 
 * @returns 
 */
export function exclude<T extends Record<string, any>, K extends keyof T>(obj: T, keysToRemove: K[]): Omit<T, K> {
    const newObj = { ...obj }; // Create a new object by spreading the original object
    keysToRemove.forEach(key => {
        delete newObj[key]; // Delete each specified key from the new object
    });
    return newObj; // Return the modified object
}

/**
 * Create user by email and password
 * @param user 
 * @returns 
 */
export function createUserByEmailAndPassword(user: registerType) {
    user.password = bcrypt.hashSync(user.password, 12);

    return db.user.create({
        data: user,
    });
}

/**
 * check if password is correct
 * @param password 
 * @param encryptedPassword 
 * @returns 
 */
export function isPasswordCorrect(password: string, encryptedPassword: string) {
    return bcrypt.compareSync(password, encryptedPassword);
}

/**
 * Login user
 * @param email 
 * @param password 
 * @returns 
 */
export async function loginUser(email: string, password: string) {

    const user = await db.user.findUnique({
        omit: {
            password: false,
            refreshToken: false
        },
        where: {
            email,
        },
    });

    if (user && isPasswordCorrect(password, user.password)) {
        return user;
    }

    return null;
}

/**
 * Find user by email
 * @param email 
 * @returns 
 */

export function findUserByEmail(email: string) {
    return db.user.findUnique({
        where: {
            email,
        },
    });
}

/**
 * Find user by id
 * @param userId 
 * @returns 
 */
export function findUserById(userId: string) {
    return db.user.findUnique({
        where: {
            id: userId,
        },
    });
}

/**
 * Find post by id
 * @param postId 
 * @returns 
 */
export async function findPostById(postId: string, userId?: string) {

    const query: { id?: string, slug?: string } = {};


    if (isValidObjectId(postId)) {
        query.id = postId;
    } else {
        query.slug = postId;
    }

    const post = await db.post.findFirst({
        where: { OR: [query] },
        include: {
            blog: {
                select: {
                    id: true,
                    title: true,
                }
            },
            author: {
                select: {
                    display_name: true,
                    user_name: true,
                }
            },
            comments: {
                include: {
                    author: {
                        select: {
                            display_name: true,
                            user_name: true,
                        }
                    },
                }
            },
            _count: {
                select: {
                    likes: true,
                    comments: true,
                }
            },
        }
    });

    return post;
}


/**
 * Generate access and refresh tokens
 * @param userId 
 * @returns 
 */
export async function generateTokens(userId: string) {

    try {
        const user = await findUserById(userId);

        if (!user) {
            throw new ApiError(401, AUTH_FAILED)
        }

        const accessToken = generateAccessToken(userId);
        const refreshToken = generateRefreshToken(userId);

        /**
         * Update refresh token to database
         */
        await db.user.update({
            where: {
                id: user.id,
            },
            data: {
                refreshToken,
            }
        })

        return {
            accessToken,
            refreshToken
        }

    } catch (error) {
        throw new ApiError(500, "An occurred while generating access and refresh tokens")
    }
}

/**
 * Check if id is valid
 * @param id 
 * @returns 
 */

export function isValidObjectId(id: string): boolean {
    return /^[a-fA-F0-9]{24}$/.test(id);
}

/**
 * Generate access token
 * @param userId 
 * @returns 
 */
export function generateAccessToken(userId: string) {
    return jwt.sign({
        id: userId,
    }, appConfig.ACCESS_TOKEN_SECRET, {
        expiresIn: appConfig.ACCESS_TOKEN_EXPIRY
    })
}

/**
 * Generate refresh token
 * @param userId 
 * @returns 
 */
export function generateRefreshToken(userId: string) {
    return jwt.sign({
        id: userId,
    }, appConfig.REFRESH_TOKEN_SECRET, {
        expiresIn: appConfig.REFRESH_TOKEN_EXPIRY
    })
}

/**
 * Verify token
 * @param token 
 * @returns 
 */
export function verifyToken(token: string) {
    try {
        return jwt.verify(token, appConfig.ACCESS_TOKEN_SECRET) as UserType

    } catch (error: any) {
        if (error.name === 'TokenExpiredError') {
            throw new ApiError(401, 'Token has expired.', error);
        }
        throw new ApiError(401, 'Invalid token');;
    }
}

/**
 * Verify refresh token
 * @param token 
 * @returns 
 */
export function verifyRefreshToken(token: string) {
    try {
        return jwt.verify(token, appConfig.REFRESH_TOKEN_SECRET) as UserType
    } catch (error: any) {
        if (error.name === 'TokenExpiredError') {
            throw new ApiError(401, 'Token has expired.',);
        }
        throw new ApiError(401, 'Invalid token');;
    }
}

/**
 * Handle Prisma error
 * @param err 
 * @returns 
 */
export const handlePrismaError = (err: PrismaClientKnownRequestError) => {
    switch (err.code) {
        case 'P2002':
            // handling duplicate key errors
            return new ApiError(400, `Duplicate field value: ${err.meta?.target}`);
        case 'P2014':
            // handling invalid id errors
            return new ApiError(400, `Invalid ID: ${err.meta?.target}`);
        case 'P2003':
            // handling invalid data errors
            return new ApiError(400, `Invalid input data: ${err.meta?.target}`);
        default:
            // handling all other errors
            return new ApiError(500, `Something went wrong: ${err.meta?.cause || err.message}`);
    }
};