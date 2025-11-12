// modules
import crypto from "crypto";
// constants
import { REFRESH_TOKENS_BYTES } from "src/constants/env.ts";

export const hash = (token: string) => crypto.createHash("sha256").update(token).digest("hex");

export const generateToken = (bytes = REFRESH_TOKENS_BYTES) => crypto.randomBytes(bytes).toString("hex");
