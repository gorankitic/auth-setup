// lib
import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from "axios";
// contants
import { baseApiUrl } from "@/config/env";
// utils
import { normalizeApiError } from "@/lib/api/normalizeError";

// Custom type to add our own flat _retry to the request config
interface AxiosRequestConfigWithRetry extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

// Flag & shared promise to avoid multiple /refresh calls at once
let isRefreshing = false;
let refreshPromise: Promise<any> | null = null;

// Main API client used everywhere in the app
const api: AxiosInstance = axios.create({
    baseURL: `${baseApiUrl}/api/v1`,
    withCredentials: true,
});

// Separate client JUST for /api/v1/auth/refresh (no interceptors, to avoid recursion)
const refreshClient: AxiosInstance = axios.create({
    baseURL: `${baseApiUrl}/api/v1`,
    withCredentials: true,
});

// Request interceptor
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        return config;
    },
    (error: AxiosError) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
    // If the response is OK (status 2xx), just return it
    (response) => response,
    // If the response is an error (non-2xx)
    async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfigWithRetry;
        const status = error.response?.status;

        // Don't try to refresh for the refresh endpoint itself
        const isRefreshCall = originalRequest?.url?.includes("/auth/refresh");

        // If we got 401 (Unauthorized) AND we haven't retried this request yet
        // Never for /api/v1/auth/refresh
        if (status === 401 && !originalRequest._retry && !isRefreshCall) {
            // Mark this request as already retried
            originalRequest._retry = true;

            // Only one refresh call happens no matter how many requests get 401 at the same time
            // Avoid multiple /refresh calls running in parallel
            if (!isRefreshing) {
                isRefreshing = true;
                // Call your backend to refresh the accessToken using the refreshToken cookie
                refreshPromise = refreshClient
                    .post("/auth/refresh")
                    .finally(() => { isRefreshing = false; refreshPromise = null });
            }

            // Wait for the refresh request to finish (whether this request triggered it, or another request did)
            const refreshResponse = await refreshPromise;

            // If refresh succeeded (backend returned 200), retry original request
            if (refreshResponse?.status === 200) {
                return api(originalRequest);
            }

            // If refresh failed (e.g. refresh token expired / revoked), force user to sign in again
            window.location.href = "/signin";
            throw normalizeApiError(error);
        }

        // If it's not a 401 error, or if the retry already happened and failed,
        // just throw the error (Promise rejected) down to the caller (React Query custom hook, onError will catch it)
        throw normalizeApiError(error);
    }
);

export default api;