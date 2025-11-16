// This matches what backend sends for Zod errors
export interface BackendFieldError {
    path: string;
    message: string;
}

// Shape of error JSON that backend returns
export interface BackendErrorResponse {
    status: "fail" | "error";
    message: string;
    errors?: BackendFieldError[];
}

// Normalized error shape that the frontend will use everywhere
export interface NormalizedError {
    status: "fail" | "error";
    message: string;
    statusCode: number;
    errors?: BackendFieldError[];
}
