const mongoose=require("mongoose")
const Store=mongoose.model("Store");
const multer=require("multer")
const multerOptions={
    storage:multer.memoryStorage(),
    fileFilter:function(req,file,next){
        const isPhoto=file.mimetype.startsWith("image/")
        if(isPhoto){
            next(null,true);
        }else{
            next({message:"that filetype is not allowed!"},false);
        }
    }
}
// jimp is used to resize file
const jimp=require('jimp')
const uuid=require('uuid')

exports.renderHello=(req,res)=>{
    res.render("hello")
}
exports.addStore=(req,res)=>{
    res.render("editStore",{title:"ADD STORE"})
}
exports.createStore=async (req,res)=>{
    //no need to send
    // res.json(req.body)
    // console.log(req.body)
    // { name: 'Qi Liu',
    // [💻]   desc: 'hello world',
    // [💻]   tags: [ 'Open Late', 'Family Friendly' ] }
    //store data in db
    //upload data to db
    req.body.author=req.user._id;
    console.log("***",req.body)
    const store=new Store(req.body)
    //js is asynchronous, so you have to use callback
    await store.save();//wait for save
    // req.flash("success",`Successfully Created ${store.name}, care to leave a review?`)
    //after finishing saving
    res.redirect("/")
}
exports.getStore=async (req,res)=>{
    const stores=await Store.find();
    console.log(stores)
    res.render("stores",{stores:stores,title:"Stores"})
}
exports.editStore=async (req,res)=>{
    const store=await Store.findOne({_id:req.params.id});
    console.log(store)
    // res.json(store)
    res.render("editStore",{title:`Edit ${store.name}`,store:store})
}
exports.updateStore=async (req,res)=>{
    const store=await Store.findOneAndUpdate({_id:req.params.id},req.body,{
        new:true,
        runValidators:true
    }).exec();
    req.flash("success",`Successfully updated <strong>${store.name}</strong>. <a href="/store/${store.name}"> View Store></a>`)
    res.redirect(`/stores/${store._id}/edit`);
}
exports.upload=multer(multerOptions).single("photo")
exports.resize=async(req,res,next)=>{
    if(!req.file){
        next();
        return;
    }
    console.log(req.file)
    const extension=req.file.mimetype.split("/")[1]
    req.body.photo=`${uuid.v4()}.${extension}`;
    const photo=await jimp.read(req.file.buffer);
    await photo.resize(800,jimp.AUTO);
    await photo.write(`./public/uploads/${req.body.photo}`);
    next();
}
exports.getOneStore=async(req,res,next)=>{
    // http://localhost:7777/store/99%20Ranch%20Market的params还是99 Ranch Market
    // res.json(req.params);
    const store=await Store.findOne({name:req.params.name}).populate("reviews");
    if(!store){
        return next();
    }
    res.render("store",{store})
}
exports.getStoresByTag=async (req,res)=>{
    
    // res.json(stores)
    const tag=req.params.tag
    const tagsPromise=Store.getTagsList();
    const tagQuery=tag||{$exists:true}
    // {tags:tag}means: tags include tag
    // const storesPromise=Store.find({tags:tag})
    //如果没有点击一个spacific的tag，就显示所有
    const storesPromise=Store.find({tags:tagQuery})
    const [tags,stores]=await Promise.all([tagsPromise,storesPromise]);
    // console.log(stores)
    res.render("tags",{tags:tags,tag:tag,stores})
}

exports.searchStore=async(req,res)=>{
    const stores=await Store.find({
        // Use the $text operator to perform text searches on fields which have a text index.
        //The $meta projection operator returns for each matching document the metadata (e.g. "textScore") associated with the query.
        //比如查到的关键词越多，textScore也就越高
        $text:{
            $search:req.query.q
        }
    },{
        score:{$meta:"textScore"}
    })
    .sort({
        score:{$meta:"textScore"}
    }).limit(5);
    res.json(stores)
}

exports.mapStores=async(req,res)=>{
    const coordinates = [req.query.lng, req.query.lat].map(parseFloat);
    console.log(coordinates);
    const q = {
        location: {
            $near: {
                $geometry: {
                    type: 'Point',
                    coordinates
                },
                $maxDistance: 10000 // 10km
            }
        }
    };

    const stores = await Store.find(q).select('slug name description location photo').limit(10);
    res.json(stores);
    
}
exports.getTopStores=async(req,res)=>{
    const stores=await Store.getTopStores();
    res.render("topStores",{stores:stores,title:"⭐️ Top Stores!"})
    // res.json(stores)
}
exports.mapPage=async(req,res)=>{

    res.render('map', { title: 'Map' });
}