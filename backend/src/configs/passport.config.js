import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import { config } from "./app.config.js";
import { providerEnum } from "../enum/account-provider.enum.js";
import { loginOrCreatAccountService } from "../services/auth.index.js";

passport.use(new GoogleStrategy({
    clientID: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_CLIENT_SECRET,
    callbackURL: config.GOOGLE_CALLBACK_URL,
    scope: ["profile", "email"],
    passReqToCallback: true,
},
    async function (req, accessToken, refreshToken, profile, cb) {
        try {
            const { email, sub: googleId, picture } = profile._json;
            console.log("googleId", googleId);
            console.log("email", email);

            if (!googleId) {
                throw new NotFoundException("Google ID (sub) is missing");
            }

            const { user } = await loginOrCreatAccountService({
                provider: providerEnum.GOOGLE,
                displayName: profile.displayName,
                providerId: googleId,
                picture: picture,
                email: email
            })
            return cb(null, user);
        } catch (error) {
            cb(error, false);
        }
    }
));

passport.serializeUser((user,cb)=>cb(null,user));

passport.deserializeUser((user, cb) => cb(null, user));