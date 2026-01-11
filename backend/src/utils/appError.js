import { HTTPSTATUS } from "../configs/http.config.js";
import { ErrorCodeEnum } from "../enum/error-code.enum.js";

export class AppError extends Error {
    constructor(message, statusCode, errorCode) {
        super(message);
        this.errorCode = errorCode,
            this.statusCode = statusCode,
            Error.captureStackTrace(this, this.constructor);
    }
};


export class Httpexception extends AppError {
    constructor(message = "Http Exception error", statusCode, errorCode) {
        super(message, statusCode, errorCode)
    }
}

export class NotFoundException extends AppError {
    constructor(message = "Resource Not Found", errorCode) {
        super(message, HTTPSTATUS.NOT_FOUND, errorCode || ErrorCodeEnum.RESOURCE_NOT_FOUND);
    }
}


export class InternalServerException extends AppError {
    constructor(message = "Internal Server Error", errorCode) {
        super(message,
            HTTPSTATUS.INTERNAL_SERVER_ERROR,
            errorCode || ErrorCodeEnum.INTERNAL_SERVOR_ERROR)
    }
}

export class BadRequestException extends AppError {
    constructor(message = "Bad Request", errorCode) {
        super(message,
            HTTPSTATUS.BAD_REQUEST,
            errorCode || ErrorCodeEnum.VALIDATION_ERROR)
    }
}

export class UnAuthorizedException extends AppError {
    constructor(message = "UnAuthorized Access", errorCode) {
        super(message,
            HTTPSTATUS.UNAUTHORIZED,
            errorCode || ErrorCodeEnum.VALIDATION_ERROR)
    }
}