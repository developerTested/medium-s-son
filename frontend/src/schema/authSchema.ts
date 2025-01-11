import { z } from 'zod';

// Schema for user login
export const LoginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
});

// Schema for user registration
export const RegisterSchema = z.object({
    user_name: z.string({
        required_error: "User Name is required",
        invalid_type_error: "User Name must be a string"
    }).min(1, { message: "User name must be 1 or more characters long" }),
    display_name: z.string({
        required_error: "Display Name is required",
        invalid_type_error: "Display Name must be a string"
    }).min(2, { message: "Display name must be 2 or more characters long" }),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
})

export type loginBody = z.infer<typeof LoginSchema>;
export type registerBody = z.infer<typeof RegisterSchema>;