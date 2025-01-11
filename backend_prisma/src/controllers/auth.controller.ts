import { Request, Response } from "express";
import { AUTH_FAILED, USER_EXISTS } from "../constants";
import ApiError from "../utilities/ApiError";
import ApiResponse from "../utilities/ApiResponse";
import asyncHandler from "../utilities/asyncHandler";
import { createUserByEmailAndPassword, exclude, findUserByEmail, findUserById, generateTokens, isPasswordCorrect, loginUser, stringifyToJSON } from "../utilities/helper";
import db from "../utilities/db";
import { SocialRegisterType } from "../schema/authSchema";

export const signIn = asyncHandler(async (req: Request, res: Response) => {

    const { email, password } = req.body;

    const existsUser = await loginUser(email, password);

    if (!existsUser) {
        throw new ApiError(409, AUTH_FAILED)
    }

    const user = exclude(existsUser, ["password", "refreshToken"])

    if (!user || !isPasswordCorrect(password, existsUser.password)) {
        return res.status(401).json(new ApiError(401, AUTH_FAILED));
    }

    const { accessToken, refreshToken } = await generateTokens(stringifyToJSON(user.id));

    return res
        .cookie("accessToken", accessToken)
        .cookie("refreshToken", refreshToken)
        .json(new ApiResponse({
            user: stringifyToJSON(user),
            accessToken,
            refreshToken,
        }, "User logged in successfully!"));

});

export const signUp = asyncHandler(async (req: Request, res: Response) => {

    const { email, password, user_name, display_name } = req.body;

    const existsUser = await findUserByEmail(email);

    if (existsUser) {
        throw new ApiError(409, USER_EXISTS)
    }

    const user = await createUserByEmailAndPassword({
        email,
        password,
        user_name,
        display_name
    })

    return res.status(201).json(new ApiResponse({
        user: stringifyToJSON(user),
    }, "User register successfully"));
});


export const currentUser = asyncHandler(async (req: Request, res: Response) => {
    const getUser = req.currentUser;

    if (!getUser) {
        throw new ApiError(401, AUTH_FAILED);
    }

    const user = await findUserById(getUser.id);

    if (!user) {
        throw new ApiError(401, AUTH_FAILED)
    }

    return res.json(new ApiResponse(stringifyToJSON(user), "Fetched logged in user"));
});


export const logoutUser = asyncHandler(async (req: Request, res: Response) => {

    const getUser = req.currentUser;

    if (!getUser) {
        throw new ApiError(401, AUTH_FAILED);
    }

    const user = await findUserById(getUser.id);

    if (!user) {
        throw new ApiError(401, AUTH_FAILED)
    }

    return res
        .clearCookie("accessToken")
        .clearCookie("refreshToken")
        .json(new ApiResponse({}, "User has been logged out successfully!"));

});








export const socialLoginAndSignup = asyncHandler(async (req: Request, res: Response) => {
    const { email, user_name, display_name, avatar, social_provider, social_id } = req.body as SocialRegisterType;

    // Check if the account is already linked
    const accountLinked = await db.social_accounts.findFirst({
        where: {
            email,
            provider: social_provider,
        },
    });

    if (accountLinked) {
        // Account is already linked, check if user exists
        const existingUser = await findUserByEmail(email);

        if (!existingUser) {
            // If no user exists, create a new user
            const newUser = await db.user.create({
                data: {
                    avatar,
                    email,
                    display_name,
                    user_name,
                    password: "", // No password required for social login
                },
            });

            // Link the new user with social account
            await db.social_accounts.create({
                data: {
                    email,
                    user_id: newUser.id,
                    social_id,
                    provider: social_provider,
                },
            });

            const { accessToken, refreshToken } = await generateTokens(stringifyToJSON(newUser.id));

            return res
                .cookie("accessToken", accessToken)
                .cookie("refreshToken", refreshToken)
                .json(new ApiResponse(
                    { user: stringifyToJSON(newUser), accessToken, refreshToken },
                    "You've registered successfully!"
                ));
        } else {
            // Account is already linked, check if user exists
            const existingUser = await findUserByEmail(email);
            if (existingUser) {

                const { accessToken, refreshToken } = await generateTokens(stringifyToJSON(existingUser.id));

                return res
                    .cookie("accessToken", accessToken)
                    .cookie("refreshToken", refreshToken)
                    .json(new ApiResponse(
                        { user: stringifyToJSON(existingUser), accessToken, refreshToken },
                        "You've logged in successfully!"
                    ));
            }
        }

        // If user exists and account is linked, return the login response
        return res.status(400).json(new ApiResponse(null, "User already linked."));
    } else {
        // Account is not linked, check if user exists
        const existingUser = await findUserByEmail(email);

        if (existingUser) {
            // If user exists, link the social account
            await db.social_accounts.create({
                data: {
                    email,
                    user_id: existingUser.id,
                    social_id,
                    provider: social_provider,
                },
            });

            const { accessToken, refreshToken } = await generateTokens(stringifyToJSON(existingUser.id));

            return res
                .cookie("accessToken", accessToken)
                .cookie("refreshToken", refreshToken)
                .json(new ApiResponse(
                    { user: stringifyToJSON(existingUser), accessToken, refreshToken },
                    "User logged in successfully!"
                ));
        }

        // If no user exists, create a new user and link the social account
        const newUser = await db.user.create({
            data: {
                avatar,
                email,
                display_name,
                user_name,
                password: "", // No password required for social login
            },
        });

        // Link the new user with social account
        await db.social_accounts.create({
            data: {
                email,
                user_id: newUser.id,
                social_id,
                provider: social_provider,
            },
        });

        const { accessToken, refreshToken } = await generateTokens(stringifyToJSON(newUser.id));

        return res
            .cookie("accessToken", accessToken)
            .cookie("refreshToken", refreshToken)
            .json(new ApiResponse(
                { user: stringifyToJSON(newUser), accessToken, refreshToken },
                "You've registered successfully!"
            ));
    }
});
