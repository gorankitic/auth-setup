// modules
import crypto from "crypto";
// constants
import { TOKEN_BYTES } from "src/config/env";

export const hash = (token: string) => crypto.createHash("sha256").update(token).digest("hex");

export const generateToken = (bytes = TOKEN_BYTES) => crypto.randomBytes(bytes).toString("hex");