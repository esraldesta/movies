const User =  require("../Models/userModel")
const CustomError = require("../utils/CustomError")
const sendEmail = require("../utils/Email")
const asyncErrorHander = require("../utils/asyncErrorHander")
const jwt  = require("jsonwebtoken")
const util = require("util")
const crypto = require("crypto")
const signToken = id=>{
    return jwt.sign({id},process.env.JWT_SECRET_STR,{
        expiresIn: process.env.LOGIN_EXPIRES
    })
}
exports.signup = asyncErrorHander( async (req,res,next)=>{
    const user = await User.create(req.body)
    const token = signToken(user._id)

    res.status(201).json({
        status:"success",
        token,
        data:{
            user
        }
    })
})

exports.login = asyncErrorHander(async (req,res,next)=>{
    const {email,password} = req.body
    if(!email || !password){
        const error = new CustomError("Please Provide both email and password",400)
        return next(error)
    }

    const user = await User.findOne({email}).select("+password")

    if(!user || !await user.comparePasswordInDb(password)){
        const error = new CustomError("Incorrect email or password",401) 
        return next(error)
    }

    const token = signToken(user._id)
    res.status(200).json({
        status:"success",
        token,
        user
    })
})

exports.forgotPassword = asyncErrorHander(async (req,res,next)=>{
    const email = req.body.email
    const user =await User.findOne({email})
    if(!user){
        const error = new CustomError("We couldn't found user with provided email",404)
        next(error)
    }
    const resetToken = await user.createResetPassword()
    await user.save({validateBeforeSave:false})
    const resetUrl = `${req.protocol}://${req.get("host")}/api/v1/users/resetpassword/${resetToken}}`
    const message = `We have recived password rest requiest. Please use the link below to reset your password \n\n ${resetUrl}`
    
    try {
        await sendEmail(
            {
                email:user.email,
                subject: "Password reset requiest recived",
                message
            }
        );         

        res.status(200).json({
            status:"success",
            subject:"Password reset requires recived",
            message
        })

    } catch (error) {
        user.passwordResetToken = undefined
        user.passwordResetTokenExpires = undefined
        user.save(validateBeforeSave=false)
        
        return next(new CustomError("There was an error sending password reset email. please try again later",500))
    }
 
})

exports.passwordReset = asyncErrorHander(async (req, res, next) => {
    const token = crypto.createHash("sha256").update(req.params.token).digest("hex");
    const user = await User.findOne({ passwordResetToken: token, passwordResetTokenExpires: { $gt: Date.now() } });

    if (!user) {
        return next(new CustomError("Reset token not valid", 400));
    }

    // Update the password and confirmPassword
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;

    // Reset the token-related fields and update passwordChangedAt
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    user.passwordChangedAt = Date.now();

    // Save the user with the updated password and other fields
    await user.save();

    // Sign a new token after the password is successfully changed
    const loginToken = signToken(user._id);

    res.status(200).json({
        status: "success",
        token: loginToken
    });
});


exports.protect = asyncErrorHander(async (req,res,next)=>{
    const testToken = req.headers.authorization 
    let token = ""

    if(testToken && testToken.startsWith("Bearer")){
        token =testToken.split(" ")[1]
    }

    if(!token){
      return  next( new CustomError("You are not authorized",401))
    }

    const decodedToken =  await util.promisify(jwt.verify)(token,process.env.JWT_SECRET_STR)

    const user = await User.findById(decodedToken.id)
    if(!user){
        const error = new CustomError("user with given token dosn't exist",401)
        return next(error)
    }

    if(await user.isPasswordChanged(decodedToken.iat)){
        const error = new CustomError("password has been changed recently. Please login again",401)
        return next(error)
    }

    req.user = user
    next()
})

exports.restrict = (...role)=>{
    return (req,res,next)=>{
        if(role.includes(req.user.role)){
            next()
        }    
        const error = new CustomError("Sorry you don't have permision to delete",403)
        next(error)
    }
} 

