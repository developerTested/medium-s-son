import express, { NextFunction, Request, Response } from "express"
import dotenv from "dotenv";
import cors from "cors"
import cookieParser from "cookie-parser"
import ApiResponse from "./utilities/ApiResponse";
import authRouter from "./routes/auth.routes";
import ApiError from "./utilities/ApiError";
import { Prisma } from "@prisma/client";
import { handlePrismaError } from "./utilities/helper";
import postRouter from "./routes/post.route";
import blogRouter from "./routes/blog.route";

/**
 * Load .env file
 */
dotenv.config();

export const PORT = process.env.PORT || 3000;
export const app = express();

/**
 * add some settings
 */
app.use(express.json({ limit: "16KB" }))
app.use(express.urlencoded({ limit: "16KB", extended: true }))
app.use(cookieParser())
app.use(cors({
    origin: process.env.ORIGIN_HOSTS || '*',
    credentials: true,
}))

/**
 * Helper function to fast create route url
 * @param route 
 * @param version 
 * @returns string
 */
const createVersionRoute = (route: string, version: string = "v1") => '/api/' + version + '/' + route;

/**
 * Routes
 */
app.get('/', (req: Request, res: Response) => {
    return res.json(new ApiResponse(""))
});

app.get('/ping', (req: Request, res: Response) => {
    return res.send('pong 🏓')
})

// Auth
app.use(createVersionRoute("user"), authRouter)

// Blog
app.use(createVersionRoute("blogs"), blogRouter)

// Posts
app.use(createVersionRoute("posts"), postRouter)

/**
 * Error Handing
 */
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    
    if (err?.statusCode) {
        return res.status(err.statusCode || 500).json(err);
    }

    if (err instanceof Prisma.PrismaClientInitializationError) {
        return res.status(500).json(new ApiError(500, "Please make sure your database server is running"));
    }

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        const errResponse = handlePrismaError(err)

        return res.status(errResponse.statusCode).json(errResponse);
    }

    return res.status(err?.statusCode || 500).json(new ApiError(err.statusCode || 500, "An error occurred", err.message))
})

/**
 * 404 errors
 */
app.use("*", (req: Request, res: Response) => {
    return res.status(404).json(new ApiError(404, "Page not found"))
})