const { response } = require('express');
var express = require('express');
// const { response } = require('../app');
var router = express.Router();
const productHelpers=require('../helpers/product-helpers')
const userHelpers=require('../helpers/user-helpers')
const verifyLogin=(req,res,next)=>{
    if(req.session.user.LoggedIn){
        next()
    }else{
        res.redirect('/login')
    }
}
/* GET home page. */
router.get('/', function(req, res, next) {
    let user=req.session.user
    console.log(user)
    productHelpers.getAllProducts().then((products)=>{
        
        res.render('user/view-products',{products,user})
       })
});

router.get('/login',(req,res)=>{
    
    if(req.session.userLoggedIn||req.session.loggedIn){
        console.log("kitty")
        res.redirect('/')
        
    }
    else{
        res.render('user/login',{"loginErr":req.session.userLoginErr})
        req.session.userLoginErr=false
        console.log("munji")
    } 
    
})
router.get('/signup',(req,res)=>{
    res.render('user/signup')
})
router.post('/signup',(req,res)=>{
    userHelpers.doSignup(req.body).then((response)=>{
        console.log(response)
        req.session.user=response
        req.session.userLoggedIn=true
        res.redirect('/')
    })

})
router.post('/login',(req,res)=>{
userHelpers.doLogin(req.body).then((response)=>{
    if(response.status){
        req.session.user=response.user
        req.session.loggedIn=true
        console.log("login success")
        
        res.redirect('/')
    }else{
        console.log("login Failed")
        
        req.session.userLoginErr="Invalid username or Password"
        res.redirect('/login')

    }
})
})


router.get('/logout',(req,res)=>{
    req.session.user=null
    req.session.destroy()
    
    res.redirect('/')
})

router.get('/cart',verifyLogin,(req,res)=>{
    //middleware

    res.render('user/cart')
})

// router.get('/add-to-cart/:id',(req,res)=>{
//     userHelpers.addToCart(req.params.id,req.session.user._id)
// })

module.exports = router;
