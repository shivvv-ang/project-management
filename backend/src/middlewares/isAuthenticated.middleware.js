import { UnAuthorizedException } from "../utils/appError.js";

const isAuthenticated = (req, res, next) => {
    if (!req.user) {
        throw new UnAuthorizedException("UnAuthorized");
    }

    next();
}


export default isAuthenticated;