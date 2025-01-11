import { PrismaClient } from "@prisma/client";

const db = new PrismaClient({
    omit: {
        user: {
            password: true,
            refreshToken: true,
        },
        blog: {
            user_id: true,
        },
        post: {
            user_id: true,
        },
        comment: {
            post_id: true,
            user_id: true,
        },
    }
});

export default db;