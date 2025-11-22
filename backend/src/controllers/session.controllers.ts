// utils
import { catchAsync } from "src/lib/utils/catchAsync";
// models
import { findAllUserSessions } from "src/services/session.services";

export const getSessions = catchAsync(async (req, res) => {
    const userId = req.user._id;
    const sessions = await findAllUserSessions(userId);

    res.status(200).json({
        status: "success",
        currentSessionId: req.session._id,
        sessions
    });
});