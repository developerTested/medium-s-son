declare module 'express' {
    interface Request {
        currentUser?: UserType;
        file?: Express.Multer.File;
        files?: Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] };
    }
}

export type UserType = {
    id: string,
    user_name: string,
    display_name: string,
    email: string,
    password: string,
    avatar: string | null,
    refreshToken: string | null,
    role: RoleType,
    createdAt: Date | null,
    updatedAt: Date | null,
}

export type RoleType = "ADMIN" | "USER"