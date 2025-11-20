// lib
import { UploadClient } from "@uploadcare/upload-client";
// services
import { getUploadSignature } from "@/services/user.services";

export const uploadToUploadcare = async (file: File) => {
    const { secureSignature, secureExpire, publicKey } = await getUploadSignature();

    const client = new UploadClient({
        publicKey,
        secureSignature,
        secureExpire,
    });

    const uploaded = await client.uploadFile(file);

    return { uuid: uploaded.uuid };
}
