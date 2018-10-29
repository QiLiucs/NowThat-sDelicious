const mongoose=require("mongoose");
mongoose.Promise=global.Promise;
const reviewSchema=new mongoose.Schema({
    create:{
        type:Date,
        default:Date.now
    },
    author:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        requires:"You must supply an author!"
    },
    store:{
        type:mongoose.Schema.ObjectId,
        ref:"Store",
        requires:"You must supply an store!"
    },
    text:{
        type:String,
        requires:"Your review must have text!"
    },
    rating:{
        type:Number,
        min:1,
        max:5
    }
});
//a hook
function autopopulate(next){
    this.populate("author");
    next();
}
reviewSchema.pre("find",autopopulate);
reviewSchema.pre("findOne",autopopulate);
module.exports=mongoose.model("Review",reviewSchema);