// modules
import chalk from "chalk";

const getEnv = (key: string, defaultValue?: string): string => {
    const value = process.env[key] || defaultValue;

    if (!value) {
        throw new Error(chalk.bgRed.bold(`Missing environment variable: ${key}`));
    }
    return value;
}

export const NODE_ENV = getEnv("NODE_ENV");
export const PORT = getEnv("PORT", "3000");
export const APP_ORIGIN = getEnv("APP_ORIGIN");
export const MONGO_URI = getEnv("MONGO_URI");

// JWT (for access tokens)
export const JWT_ACCESS_SECRET = getEnv("JWT_ACCESS_SECRET");
export const JWT_ACCESS_EXPIRES_IN = getEnv("JWT_ACCESS_EXPIRES_IN");

// Refresh tokens
export const TOKEN_BYTES = Number(getEnv("TOKEN_BYTES", "64"));
export const REFRESH_TOKEN_TTL_MS = Number(getEnv("REFRESH_TOKEN_TTL_MS"));

// Email: for production
export const RESEND_API_KEY = getEnv("RESEND_API_KEY");
// Email: for development
export const EMAIL_USERNAME = getEnv("EMAIL_USERNAME");
export const EMAIL_PASSWORD = getEnv("EMAIL_PASSWORD");
export const EMAIL_HOST = getEnv("EMAIL_HOST");
export const EMAIL_PORT = getEnv("EMAIL_PORT");