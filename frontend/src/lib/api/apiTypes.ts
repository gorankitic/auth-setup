// Zod error response from server
export type FieldError = {
    path: string;
    message: string;
}

// Error that server returns
export type ErrorResponse = {
    status: "fail" | "error";
    message: string;
    errors?: FieldError[];
}

// Normalized error that the client will use everywhere
export type NormalizedError = {
    status: "fail" | "error";
    message: string;
    statusCode: number;
    errors?: FieldError[];
}

export type SuccessResponse = {
    status: "success",
    message?: string
}

export type User = {
    _id: string,
    name: string,
    email: string,
    avatarUuid: string | null,
    role: string | null,
    isVerified: boolean
}

export type GetUserResponse = {
    status: "success",
    user: User
}

export type GetUploadSignatureResponse = {
    status: "success",
    secureSignature: string,
    secureExpire: string,
    publicKey: string
}

export type Session = {
    userAgent: string
    lastUsedAt: string,
    location: string | null
}

export type GetSessionsResponse = {
    status: "success",
    currentSessionId: string,
    sessions: Session[]
}