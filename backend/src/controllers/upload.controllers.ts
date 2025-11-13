import { AppError } from "src/lib/utils/AppError.ts";
import { catchAsync } from "src/lib/utils/catchAsync.ts";

export const getProfilePhotoPresignedUrl = catchAsync(async (req, res, next) => {
    const { fileType } = req.body;

    if (!fileType.startsWith("image/")) {
        return next(new AppError("Only images are allowed to upload.", 400));
    }


});