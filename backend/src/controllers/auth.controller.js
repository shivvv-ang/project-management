import { config } from "../configs/app.config.js";
import { asyncHandler } from "../middlewares/asyncHandle.middleware.js";

export const googleLoginCallback = asyncHandler(
    async (req,res)=>{

        const currentWorkspace = req.user?.currentWorkspace; 

        if(!currentWorkspace){
            return res.redirect(`${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`)
        }

        return res.redirect(`${config.FRONTEND_ORIGIN}/workspace/${currentWorkspace}`);
    }
);