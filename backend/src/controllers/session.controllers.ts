// utils
import { catchAsync } from "src/lib/utils/catchAsync.ts";
// models
import { findAllUserSessions } from "src/services/session.services.ts";

export const getSessions = catchAsync(async (req, res) => {
    const userId = (req as any).user._id;
    const sessions = await findAllUserSessions(userId);

    res.status(200).json({
        status: "success",
        currentSessionId: (req as any).session._id,
        sessions
    });
});