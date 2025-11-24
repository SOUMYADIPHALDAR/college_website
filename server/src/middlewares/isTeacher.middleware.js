import { apiError } from "../utils/apiError";
import { asyncHandler } from "../utils/asyncHandler";

export const isTeacher = asyncHandler(async(req, res, next) => {
    if (req.user.role !== "Teacher") {
        throw new apiError(400, "A student can not do this..")
    }
});