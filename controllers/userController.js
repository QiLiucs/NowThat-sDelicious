const mongoose=require("mongoose")
const User=mongoose.model("User")

const Store=mongoose.model("Store");
const promisify=require("es6-promisify")

exports.login=(req,res)=>{
    res.render("login")
}
exports.registerForm=(req,res)=>{

    res.render("register");
}
exports.register = async(req,res,next)=>{
    console.log("#####")
    const user=new User({email:req.body.email,name:req.body.name});
    const register=promisify(User.register,User)
    await register(user,req.body.password)
    // res.send("it works!")
    next();
}

exports.validateRegister=(req,res,next)=>{
    req.sanitizeBody("name");//get rid of script tag
    req.checkBody("name","You Must Supply a Name").notEmpty();
    req.checkBody("email","The Email is not Valid").isEmail();
    req.sanitizeBody("email").normalizeEmail({
        remove_dots:true,
        remove_extension:false,
        gmail_remove_subaddress:false
    });
    req.checkBody("password","Password can not be Blank!").notEmpty();
    req.checkBody("password-confirm"," Confirmed Password can not be Blank!").notEmpty();
    req.checkBody("password-confirm","Oops! Your Password don't Match").equals(req.body.password);
    //begin validation
    const errors=req.validationErrors();
    if(errors){
        req.flash("error",errors.map(err=>err.msg))
        //必须传递flashes，否则跳转到register页面后不显示flash
        res.render('register',{title:"Register Error",body:req.body,flashes:req.flash()})
        return;
    }
    next();
}
exports.account=(req,res)=>{
    res.render('account');
}
exports.updateAccount=async (req,res)=>{
    const updates={
        name:req.body.name,
        email:req.body.email
    };
    const user=await User.findOneAndUpdate(
        {_id:req.user._id},
        {$set:updates},
        {new:true,runValidators:true,context:"query"}
    );
    req.flash("success","Updated the Profile");
    res.redirect("back");//还是/acount
}
exports.heartAStore=async (req,res)=>{
    console.log("heartAStore")
    const hearts=req.user.hearts.map(obj=>obj.toString())
    const operator=hearts.includes(req.params.storeId)?"$pull":"$addToSet"
    //如果已经收藏了，就取消收藏
    //否则，添加进去
    //使用{[operator]:{hearts:req.params.storeId}},等同于{$pull:{hearts:req.params.storeId}}+{$addToSet:{hearts:req.params.storeId}}
    const user=await User.findByIdAndUpdate(req.user._id,
        {[operator]:{hearts:req.params.storeId}},
        {new:true})//true表示返回update之后的值
    res.json(user)
}
exports.getHearts=async (req,res)=>{
    const stores=await Store.find({
        //where _id in req.user.hearts
        _id:{$in:req.user.hearts}
    });
    res.render("stores",{title:"HEARTED STORE",stores})
}