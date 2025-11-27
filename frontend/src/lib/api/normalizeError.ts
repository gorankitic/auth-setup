// lib
import axios from "axios";
// types
import type { ErrorResponse, NormalizedError } from "./apiTypes";

export function normalizeApiError(error: unknown): NormalizedError {
    // Axios error
    if (axios.isAxiosError(error)) {
        const statusCode = error.response?.status ?? 500;
        const data = error.response?.data as ErrorResponse | undefined;

        return {
            status: data?.status || "error",
            message:
                data?.message ||
                error.message ||
                "Unexpected error occurred",
            errors: data?.errors,
            statusCode,
        };
    }

    // Non-Axios error
    return {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
        statusCode: 500,
    };
}