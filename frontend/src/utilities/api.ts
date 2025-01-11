import axios, { AxiosResponse } from "axios"
import { refreshToken } from "./helper";

const MediumAPI = axios.create({
    baseURL: import.meta.env.VITE_MEDIUM_API,
    withCredentials: true,
    timeout: 60 * 1000,
})

/**
 * Axios send Access Token
 */
MediumAPI.interceptors.request.use(function (config) {
    return config;
}, function (error) {
    return Promise.reject(error);
});


/**
 * Axios Response 
 */
MediumAPI.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    async error => {
        const originalRequest = error.config;

        // Check if the error is a 401 and if it's not already trying to refresh
        if (error.response &&
            error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            if (error.response.data &&
                error.response.data.errors &&
                error.response.data.errors.name === "TokenExpiredError") {
                try {
                    await refreshToken();

                    return MediumAPI(originalRequest);
                } catch (refreshError) {
                    return Promise.reject(refreshError);
                }
            }
        }

        return error.response?.data ? Promise.reject(error.response.data) : Promise.reject(error);
    }
);

export default MediumAPI