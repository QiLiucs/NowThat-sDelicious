const passport=require("passport")
const mongoose=require("mongoose")
const User=mongoose.model("User")
passport.use(User.createStrategy());
//需要做session对象序列化与反序列
//第一段代码是将环境中的user.id序列化到session中，即sessionID，同时它将作为凭证存储在用户cookie中。
// 第二段代码是从session反序列化，参数为用户提交的sessionID，若存在则从数据库中查询user并存储与req.user中。
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());