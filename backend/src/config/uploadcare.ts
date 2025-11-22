// modules
import { UploadcareSimpleAuthSchema } from "@uploadcare/rest-client";
// constants
import { UPLOADCARE_PUBLIC_KEY, UPLOADCARE_SECRET_KEY } from "src/constants/env";

export const UPLOADCARE_SIGNATURE_LIFETIME = 10 * 60 * 1000;

export const uploadcareAuth = new UploadcareSimpleAuthSchema({
    publicKey: UPLOADCARE_PUBLIC_KEY,
    secretKey: UPLOADCARE_SECRET_KEY,
});