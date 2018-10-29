const mongoose=require("mongoose");
mongoose.Promise=global.Promise;//Tell Mongoose to use ES6 promises
const Schema=mongoose.Schema;
const md5=require("md5")
const validator=require("validator")
const mongooseErrorHandlor=require('mongoose-mongodb-errors');
const passportLocalMongoose=require('passport-local-mongoose');
const userSchema=new Schema({
    email:{
        type:String,
        unique:true,
        lowercase:true,
        trim:true,
        validate:[validator.isEmail,"Invalid Email"],
        requires:"Please Supply an Email Address"
    },
    name:{
        type:String,
        required:"Please Supply a Name",
        trim:true
    },
    resetPasswordToken:String,
    resetPasswordExpires:Date,
    //一对多的关系
    hearts:[
        {type:mongoose.Schema.ObjectId,ref:"Store"}
    ]
});

userSchema.virtual("gravatar").get(function(){
    const hash=md5(this.email);
    return `https://gravatar.com/avatar/${hash}?s=200`;
});
userSchema.plugin(passportLocalMongoose,{usernameField:"email"});//used to validate username and password
userSchema.plugin(mongooseErrorHandlor);//transfer an ugly error message to a much nicer error message
module.exports=mongoose.model("User",userSchema)
