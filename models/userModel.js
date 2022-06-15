const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const userSchema = new mongoose.Schema({
    name:{
        type:String,
    },
    email:{
        type:String,
        required:[true,'Please provide your email'],
        unique:true,
        lowercase:true,
        validate:[validator.isEmail,'Please provide a valid email']
    },
    photo:String,
    role:{
        type:String,
        enum:['user','guide','lead-guide','admin'],//The enum keyword is used to restrict a value to a fixed 
        //set of values. It must be an array with at least one element, where each element is unique.
        default:'user'
    },
    password:{
        type:String,
        required:[true,'Please provide a password'],
        minlength:8,
        select:false
    },
    passwordConfirm:{
        type:String,
        required:[true,'Please confirm your password'],
        validate:{
            validator:function(el){
                return el === this.password
            },
            message:'Passwords are not the same!!'
        }
    },
    passwordChangeAt:Date,
    passwordResetToken:String,
    passwordResetExpires:Date,
    active:{
        type:Boolean,
        default:true,
        select:false
    }
})
userSchema.pre(/^find/, function(next){
    // this points to the current query
    console.log(this)
    this.find({active:{$ne:false}})
    next()
})
userSchema.pre('save',async function(next){
    // only run this function if password was actually modified
    if(!this.isModified('password')) return next();
    //hash the password with cost of 12
    this.password = await bcrypt.hash(this.password,12);
    //delete the passwordconfirm field
    this.passwordConfirm = undefined;
    next();
})

userSchema.pre('save',function(next){
    if(this.isModified('password') || this.isNew) return next();
    this.passwordChangeAt = Date.now()-1000;
    next();
})

userSchema.methods.correctPassword = async function(candidatePassword,userPassword){
    return await bcrypt.compare(candidatePassword, userPassword)
}
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if(this.passwordChangeAt){
        const changedTimeStamp = parseInt(this.passwordChangeAt.getTime() /1000,10)
        return JWTTimestamp < changedTimeStamp
    }
    // False means NOT changes
    return false;
}
userSchema.methods.CreatePasswordResetToken = function(){
    const resetToken = crypto.randomBytes(32).toString('hex') //randomBytes() method is used to
    // generate a cryptographically well-built artificial random data and 
    //the number of bytes to be generated in the written code.
    console.log(this) // এইখানে ডকুমেন্ট মডেল কে পয়েন্ট করে ।
    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    console.log({resetToken},this.passwordResetToken)
    this.passwordResetExpires = Date.now()+ 10*60*1000;

    return resetToken;
}
const User = mongoose.model('User',userSchema);
module.exports = User;
