// lib
import { toast } from "sonner";
import imageCompression from "browser-image-compression";
// config
import { uploadToUploadcare } from "@/config/uploadcareClient";
// utils
import { normalizeApiError } from "@/lib/api/normalizeError";

const MAX_MB = 2;
const MAX_WIDTH_OR_HEIGHT = 512;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const useUploadAvatar = () => {

    const uploadAvatar = async (file: File) => {
        try {
            // Basic validation
            if (!ALLOWED_TYPES.includes(file.type)) {
                toast.error("Only JPG, PNG or WebP images are allowed.");
                return null;
            }

            const sizeMb = file.size / (1024 * 1024);
            if (sizeMb > 8) {
                toast.error("Max file size is 8MB.");
                return null;
            }

            // Compress image (to ~2MB and max 512px)
            const compressed = await imageCompression(file, {
                maxSizeMB: MAX_MB,
                maxWidthOrHeight: MAX_WIDTH_OR_HEIGHT,
                useWebWorker: true,
            });

            const { uuid } = await uploadToUploadcare(compressed);
            return { avatarUuid: uuid };

        } catch (error) {
            const err = normalizeApiError(error);
            toast.error(err.message);
            return null;
        };
    }
    return { uploadAvatar };
}
