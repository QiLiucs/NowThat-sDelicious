const mongoose=require("mongoose");
mongoose.Promise=global.Promise;//Tell Mongoose to use ES6 promises
const slug=require('slugs')
const storeSchema=new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:"please enter a store name"
    },
    slug:String,
    desc:{
        type:String,
        trim:true
    },
    tags:[String],
    location:{
        type:{
            type:String,
            // enum: "Point",
            default:"Point"
        },
        coordinates:[{
            type:Number,
            required:"please supply your store's coordinate!",
            default: 0
        }],
        address:{
            type:String,
            required:"must input your address"
    
        }
    },
    photo:{
        type:String
    },
    author:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        requires:"You Must Supply an Author"
    }
},{
    //so that we can dump virtual field
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
});
storeSchema.index({
    name:"text",
    desc:"text"
})
//throw an error
// storeSchema.index({location: '2dsphere'});
storeSchema.pre("save",(next)=>{//在保存数据之前执行的操作
    // this.slug=slug(this.name);//"this" is storeSchema make word lowercase
    this.slug=this.name
    next();//next表示下一步就执行save
});
storeSchema.statics.getTopStores=function(){
    return this.aggregate([
        //1.lookup stores and populate their reviews
        {$lookup:{
            //reviews:Capitalize initial && append s to the end
            from:"reviews",localField:"_id",
            foreignField:"store",as:"masca"
        }},
        //filter for items that have 2 or more reviews
        {$match:{"masca.1":{$exists:true}}},
        //add the ave reviews field
        {
            $project:{
                photo:"$$ROOT.photo",
                name:"$$ROOT.name",
                reviews:"$$ROOT.masca",
                averageRating:{$avg:"$masca.rating"}
            }
        },
        //sort it by ave field,highest rating first
        {$sort:{averageRating:-1}},
        //limit 10
        {$limit:10}
    ])
}
storeSchema.statics.getTagsList=function(){
    return this.aggregate([
        {$unwind : "$tags"},
        {$group:{_id:"$tags",count:{$sum:1}}},
        {$sort:{count:-1}}//descending order
    ]);
}

//find reviews where the stores _id property === review store property
storeSchema.virtual("reviews",{//get reviews but dont save it in database
    ref:"Review",
    localField:"_id",
    foreignField:"store"
})
module.exports=mongoose.model("Store",storeSchema)
