const express = require('express');
const router = express.Router();
const helloController=require("../controllers/helloController")
const userController=require("../controllers/userController")
const authController=require("../controllers/authController")
const reviewController=require("../controllers/reviewController")
const {catchErrors}=require("../handlers/errorHandlers")

router.get("/add",authController.isLoggedIn,helloController.addStore)
router.post("/add",helloController.upload,catchErrors(helloController.resize),catchErrors(helloController.createStore))
router.post("/add/:id",helloController.upload,catchErrors(helloController.resize),catchErrors(helloController.updateStore))
router.get("/stores",catchErrors(helloController.getStore))
router.get("/stores/:id/edit",catchErrors(helloController.editStore))
router.get("/",catchErrors(helloController.getStore));
router.get("/store/:name",catchErrors(helloController.getOneStore));
router.get("/tags",catchErrors(helloController.getStoresByTag));
router.get("/tags/:tag",catchErrors(helloController.getStoresByTag));
router.get("/login",userController.login);
router.post("/login",authController.login);
router.get("/register",userController.registerForm);
router.post("/register",userController.validateRegister,catchErrors(userController.register),authController.login);
router.get("/logout",authController.logout)
router.get("/account",userController.account)
router.post("/account",userController.updateAccount)
router.post("/account/forget",catchErrors(authController.forget))
router.get("/account/reset/:token",catchErrors(authController.reset))
router.post("/account/reset/:token",
authController.confirmPassword,
catchErrors(authController.updatePassword))
//api

router.get("/api/search",catchErrors(helloController.searchStore))//these are endpoints
router.get("/api/stores/near",catchErrors(helloController.mapStores))
router.post("/api/stores/:storeId/heart",catchErrors(userController.heartAStore))
router.get("/hearts",authController.isLoggedIn,catchErrors(userController.getHearts))
router.post("/reviews/:storeId",authController.isLoggedIn,catchErrors(reviewController.addReview))

router.get("/top",helloController.getTopStores);
router.get("/map",helloController.mapPage);

// Do work here
/*
router.get('/', (req, res) => {
  // res.send('Hey! It works!');
  ////发送json数据
  // let json={"name":'machaohui',"age":18};
  // res.send(json)

  //http://localhost:7777/?name=kiki&age=17
  // res.send(req.query.name) //kiki
  // res.send(req.query)  //json{name:"kiki",age:17}

  // res.send("hey!");
  //res.render("hello")//get rid of extension ".pug"

  let params={
    email:"kki@123.com",
    token:req.query.token
  }
  res.render("hello",params)

});
*/
router.get("/reverse/:name/:second/:last",(req,res)=>{
  console.log(req.params)//print req on terminal!!!!
  //http://localhost:7777/reverse/kk/ll/ll
  console.log(req.params.name)//kk
  console.log([...req.params.name].reverse().join("&"))//[ 'k', 'k' ],k&k
  res.send(req.params)//{ name: 'kk', second: 'll', last: 'll' }
  
})
module.exports = router;
