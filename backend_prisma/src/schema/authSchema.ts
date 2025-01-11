import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string({
    required_error: "Email Address is required",
    invalid_type_error: "Email must be a string"
  }).email('Invalid email'),
  password: z.string({
    required_error: "Password is required",
    invalid_type_error: "Password must be a string"
  }).min(6, 'Password must be at least 6 characters long'),
});

export const RegisterSchema = z.object({
  user_name: z.string({
    required_error: "User Name is required",
    invalid_type_error: "User Name must be a string"
  }).min(1, { message: "User name must be 1 or more characters long" }),
  display_name: z.string({
    required_error: "Display Name is required",
    invalid_type_error: "Display Name must be a string"
  }).min(2, { message: "Display name must be 2 or more characters long" }),
  email: z.string({
    required_error: "Email is required",
    invalid_type_error: "Email must be a string"
  }).email("Invalid email address"),
  password: z.string({
    required_error: "Password is required",
    invalid_type_error: "Password must be a string"
  }).min(6, { message: "Password must be at least 6 characters long" }),
})

export const SocialRegisterSchema = z.object({
  avatar: z.string({
    required_error: "Avatar is required",
    invalid_type_error: "Avatar must be a string"
  }).min(1, { message: "Avatar must be 1 or more characters long" }).optional(),
  user_name: z.string({
    required_error: "User Name is required",
    invalid_type_error: "User Name must be a string"
  }).min(1, { message: "User name must be 1 or more characters long" }),
  display_name: z.string({
    required_error: "Display Name is required",
    invalid_type_error: "Display Name must be a string"
  }).min(2, { message: "Display name must be 2 or more characters long" }),
  email: z.string({
    required_error: "Email is required",
    invalid_type_error: "Email must be a string"
  }).email("Invalid email address"),
  social_provider: z.string({
    required_error: "Social Provider is required",
    invalid_type_error: "Social Provider must be a string"
  }).min(1, { message: "Social Provider must be 1 or more characters long" }),
  social_id: z.string({
    required_error: "Social ID is required",
    invalid_type_error: "Social ID must be a string"
  }).min(1, { message: "Social ID must be 1 or more characters long" }),
})

export type loginType = z.infer<typeof LoginSchema>;
export type registerType = z.infer<typeof RegisterSchema>;
export type SocialRegisterType = z.infer<typeof SocialRegisterSchema>;