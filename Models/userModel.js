const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require("bcryptjs")
const crypto = require("crypto")
const Schema = mongoose.Schema;
//name, email, password, confirmPassword, photo
const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name.']
    },
    email: {
        type: String,
        required: [true, 'Please enter an email.'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please enter a valid email.']
    },
    role:{
        type:String,
        enum:["user","admin"],
        default:"user"
    },
    photo: String,
    password: {
        type: String,
        required: [true, 'Please enter a password.'],
        minlength: 8,
        select:false,
    },
    confirmPassword: {
        type: String,
        required: [true, 'Please confirm your password.'],
        validate: {
            validator: function (value) {
                return value === this.password;
            },
            message: 'Password and confirmPassword do not match.',
        },

    },
    passwordChangedAt:Date,
    passwordResetToken : String,
    passwordResetTokenExpires:Date
} , {
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
      },
    },
  })

userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next();
    this.password= await bcrypt.hash(this.password,10)
    this.confirmPassword = undefined;
})

userSchema.methods.comparePasswordInDb = async function(pswd){
    console.log("this.password =>",this.password);
    return await bcrypt.compare(pswd,this.password)
}

userSchema.methods.isPasswordChanged = async function(JWTTimeStamp){
    if(this.passwordChangedAt){
        const pswdChangedTimeatamp = parseInt(this.passwordChangedAt.getTime()/ 1000);
        return JWTTimeStamp < pswdChangedTimeatamp
    }
    return false;
}

userSchema.methods.createResetPassword = async function(){
    const resetToken = crypto.randomBytes(32).toString("hex")
    this.passwordResetToken  = crypto.createHash("sha256").update(resetToken).digest("hex")
    this.passwordResetTokenExpires = (Date.now() + 10*60 *1000)

    return resetToken
}
const User = mongoose.model('User', userSchema);

module.exports = User;
