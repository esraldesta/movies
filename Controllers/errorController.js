const CustomError = require("../utils/CustomError")

const devErrors = (res,error)=>{
    return res.status(error.statusCode).json({
        status:error.status,
        message:error.message,
        stackTrace:error.stackTrace,
        error:error
    })
}

const prodErrors = (res,error)=>{
    if(error.isOperational){
       return res.status(error.statusCode).json({
            status:error.status,
            message:error.message
        })
    }
    else{
       return res.status(500).json({
        "status":'fail',
        "message":"Some thing went wrong! Please try again later"
       })
    }
}

const castErrorHandler = (err)=>{
    const msg = `Invalid value ${err.value} for field ${err.path}`
    return new CustomError(msg,400)
}

const duplicateKeyErrorHandler = (err)=>{
    const name = err.keyValue.name
    const msg = `There is already a movie with name ${name}! Please try with another name`
    
    return new CustomError(msg,400)
}

const validationErrorHandler = (err) => {
    const errors = Object.values(err.errors).map(val => val.message);
    const errorMessages = errors.join('. ');
    const msg = `Invalid input data: ${errorMessages}`;

    return new CustomError(msg, 400);
}

const handleExpiredToken = (err)=>{
    return new CustomError("JWT has expired. Please login in again!",401)    
}

const handleJWTError = (err)=>{
    return new CustomError("Invalid token. Please try again!",401)    
}

module.exports = (error,req,res,next)=>{
    error.statusCode = error.statusCode || 500
    error.status = error.status|| "error"
    if(process.env.NODE_ENV == "development"){
        devErrors(res,error)  
    }
    else if(process.env.NODE_ENV == "production"){
        console.log(process.env.NODE_ENV);

            if(error.name == "CastError") error = castErrorHandler(error)
            if(error.code == 11000) error = duplicateKeyErrorHandler(error)
            if(error.name === 'ValidationError') error = validationErrorHandler(error);
            if(error.name === "TokenExpiredError") error = handleExpiredToken(error)
            if(error.name === "JsonWebTokenError") error = handleJWTError(error)
            prodErrors(res,error)

    }
}