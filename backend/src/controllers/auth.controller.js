
import passport from "passport";
import { config } from "../configs/app.config.js";
import { HTTPSTATUS } from "../configs/http.config.js";
import { asyncHandler } from "../middlewares/asyncHandle.middleware.js";
import { registerUserService } from "../services/auth.index.js";
import { userSchema } from "../validators/auth.validation.js";

export const googleLoginCallback = asyncHandler(
    async (req, res) => {

        const currentWorkspace = req.user?.currentWorkspace;

        if (!currentWorkspace) {
            return res.redirect(`${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`)
        }

        return res.redirect(`${config.FRONTEND_ORIGIN}/workspace/${currentWorkspace}`);
    }
);

export const registerUser = asyncHandler(
    async (req, res) => {

        const validatedData = userSchema.parse(req.body);

        await registerUserService(validatedData);

        return res.status(HTTPSTATUS.CREATED).json({
            message: "User Created Successfully"
        })
    }
)

export const loginUser = asyncHandler(async (req, res, next) => {
    passport.authenticate(
        "local",
        (err, user, info) => {
            if (err) return next(err);

            if (!user) {
                return res.status(HTTPSTATUS.UNAUTHORIZED).json({
                    message: info?.message || "Invalid credentials",
                });
            }

            req.logIn(user, (err) => {
                if (err) return next(err);

                return res.status(HTTPSTATUS.OK).json({
                    message: "Logged in successfully",
                    user,
                });
            });
        }
    )(req, res, next);
});


export const logOutUser = asyncHandler(async (req, res) => {
    req.logout((err) => {
        if (err) {
            return res
                .status(HTTPSTATUS.INTERNAL_SERVER_ERROR)
                .json({ error: "Failed to log out" });
        }

     
        req.session.destroy((err) => {
            if (err) {
                return res
                    .status(HTTPSTATUS.INTERNAL_SERVER_ERROR)
                    .json({ error: "Failed to destroy session" });
            }

         
            res.clearCookie("session"); 

            return res.status(HTTPSTATUS.OK).json({
                message: "Logged out successfully",
            });
        });
    });
});