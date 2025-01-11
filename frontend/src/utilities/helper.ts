import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import MediumAPI from "./api";
import { store } from "@/redux/store";
import { getRefreshToken, setAccessToken, setRefreshToken } from "@/redux/slices/authSlice";
import moment from "moment";


/**
 * Covert date to time ago format
 * @param date 
 * @returns 
 */
export function formatDate(date: string, format = "ll") {

    if (!date) return "Bad date";

    return moment(date).format(format);
}

/**
 * Covert date to time ago format
 * @param date 
 * @returns 
 */
export function timeAgo(date: string) {

    if (!date) return "Bad date";

    return moment(date).fromNow();
}

/**
 * Create initials from name
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
 * classNames utility function
 * @param inputs 
 * @returns 
 */
export function classNames(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

/**
 * Refresh token
 */
export async function refreshToken() {
    try {
        const response = await MediumAPI.post('/auth/refreshToken', {
            refreshToken: getRefreshToken(store.getState()),
        })

        store.dispatch(setAccessToken(response.data.accessToken));
        store.dispatch(setRefreshToken(response.data.refreshToken));

    } catch (error) {
        console.log(error);
    }
}

/**
 * Decode JWT Token
 * @param token 
 * @returns 
 */
export function decodeJwtResponse(token: string) {
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}