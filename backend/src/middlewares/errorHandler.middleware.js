import { ZodError } from "zod";
import { HTTPSTATUS } from "../configs/http.config.js";
import { AppError } from "../utils/appError.js";
import { ErrorCodeEnum } from "../enum/error-code.enum.js";


const formatZodError = (res, error) => {
  const errors = error.issues.map((err) => ({
    field: err.path.length ? err.path.join(".") : "body",
    message: err.message,
  }));

  return res.status(HTTPSTATUS.BAD_REQUEST).json({
    message: "Validation failed",
    errors,
    errorCode: ErrorCodeEnum.VALIDATION_ERROR,
  });
};

export const errorHandler = (error, req, res, next) => {

  console.error(`Error Occured on Path:${req.path}`, error);

  if (error instanceof SyntaxError) {
    return res.status(HTTPSTATUS.BAD_REQUEST).json({
      message: "Invalid Json Format. Please Check your request"
    })
  }

  if (error instanceof ZodError) {
    return formatZodError(res, error);
  }

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      message: error.message,
      errorCode: error.errorCode,
    })
  }


  return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
    message: "Internal Server Error",
    error: error?.message || "Unknown error occrured"
  })
}