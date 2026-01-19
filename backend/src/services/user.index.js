import User from "../models/user.model.js"
import { BadRequestException } from "../utils/appError.js";

export const getCurrentUserService = async (userId) => {
    const user = await User.findById(userId).populate("currentWorkspace").select("-password");

    if (!user) {
        throw new BadRequestException("User Not Found");
    }

    return {
        user
    };
}