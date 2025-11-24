// lib
import { cn, getAvatarUrl } from "@/lib/utils";
import { Camera } from "lucide-react";

type UploadAvatarProps = {
    avatarUuid: string | null;
    initials: string;
    isUploading: boolean;
    onFileSelect: (file: File) => void;
}

const UploadAvatar = ({ avatarUuid, initials, isUploading, onFileSelect }: UploadAvatarProps) => {
    const avatarUrl = getAvatarUrl(avatarUuid);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) onFileSelect(file);
    };

    return (
        <div className="relative size-24">
            {avatarUrl ? (
                <img
                    src={avatarUrl}
                    className={cn("w-full h-full rounded-full object-cover shadow transition", isUploading && "opacity-40 blur-[1px]")}
                />
            ) : (
                <div className={cn("w-full h-full rounded-full bg-gray-100 flex items-center justify-center text-xl font-semibold tracking-wider shadow-sm", isUploading && "opacity-40 blur-[1px]")}>
                    {initials}
                </div>
            )}

            <input
                type="file"
                id="avatarInput"
                accept="image/*"
                className="hidden"
                disabled={isUploading}
                onChange={handleChange}
            />

            <label
                htmlFor="avatarInput"
                className={cn("absolute -bottom-0.5 -right-0.5 bg-white border border-gray-300 rounded-full p-2 shadow cursor-pointer hover:bg-gray-50 hover:scale-105 transition", isUploading && "opacity-40 pointer-events-none")}
            >
                <Camera className="size-4 text-gray-700" />
            </label>
            {/* Spinner overlay while uploading */}
            {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/20 rounded-full">
                    <div className="size-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}
        </div>
    );
};

export default UploadAvatar;