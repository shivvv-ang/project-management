import { HTTPSTATUS } from "../configs/http.config.js";
import { AppError } from "../utils/appError.js";

export const errorHandler = (error,req,res,next)=>{

  console.error(`Error Occured on Path:${req.path}`,error);  

  if(error instanceof SyntaxError){
    return res.status(HTTPSTATUS.BAD_REQUEST).json({
        message:"Invalid Json Format. Please Check your request"
    })
  }

  if(error instanceof AppError){
      return res.status(error.statusCode).json({
          message:error.message,
          errorCode: error.errorCode,
      })
  }


  return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
    message:"Internal Server Error",
    error:error?.message || "Unknown error occrured"
  })
}