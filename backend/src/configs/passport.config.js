import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";
import { config } from "./app.config.js";
import { providerEnum } from "../enum/account-provider.enum.js";
import { loginOrCreatAccountService, verifyUserService } from "../services/auth.index.js";
import User from "../models/user.model.js";
import { NotFoundException } from "../utils/appError.js";


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

            const { safeUser } = await loginOrCreatAccountService({
                provider: providerEnum.GOOGLE,
                displayName: profile.displayName,
                providerId: googleId,
                picture: picture,
                email: email
            })
            return cb(null, safeUser);
        } catch (error) {
            cb(error, false);
        }
    }
));


passport.use(new LocalStrategy({
    usernameField: "email",
    passwordField: "password",
    session: true,
},
    async (email, password, done) => {
        try {
            const user = await verifyUserService({ email, password });
            return done(null, user);
        } catch (error) {
            return done(error, false, { message: error?.message });
        }
    }
));

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        if (!user) return done(null, false);
        done(null, user._id || user.id);
    } catch (err) {
        done(err);
    }
});