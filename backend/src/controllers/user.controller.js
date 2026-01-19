import { HTTPSTATUS } from "../configs/http.config.js";
import { asyncHandler } from "../middlewares/asyncHandle.middleware.js";
import { getCurrentUserService } from "../services/user.index.js";


export const getCurrentUser = asyncHandler(async(req,res)=>{

    const userId = req?.user;

    const {user} = await getCurrentUserService(userId);

    return res.status(HTTPSTATUS.OK).json({
        message:"User Fetched Successfully",
        user
    })
});