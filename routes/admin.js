var express = require('express');
//set-1
const {render}=require("../app")
var router = express.Router();
//set-2

var productHelpers=require('../helpers/product-helpers')

/* GET users listing. */
router.get('/', function(req, res, next) {
 
 productHelpers.getAllProducts().then((products)=>{
  console.log(products)
  res.render('admin/view-products',{admin:true,products})
 })

  
});



router.get('/add-product',function(req,res)
{
  res.render('admin/add-product')
})
router.post('/add-product',(req,res)=>{
  
  

  productHelpers.addProduct(req.body,(id)=>{
    let image=req.files.Image;
    console.log(id)
    image.mv('./public/product-images/'+id+'.jpg',(err)=>{
      if(!err){
      res.redirect("/admin")
      
      }
      else{
        console.log(err)
      }
    })
  
})

})
router.get('/delete-product/:id',(req,res)=>{
  let proId=req.params.id
  console.log(proId);
  productHelpers.deleteProduct(proId).then((response)=>{
    res.redirect('/admin/')
  })
})
router.get('/edit-product/:id',async (req,res)=>{
  let product=await productHelpers.getProductDetails(req.params.id)
  console.log(product)
  res.render('admin/edit-product',{product})

})
router.post('/edit-product/:id',(req,res)=>{
  console.log(req.params.id);
  let id=req.params.id
  productHelpers.updateProduct(req.params.id,req.body).then(()=>{
    res.redirect('/admin')
    //af
    if(req.files.Image){
      let image=req.files.Image
      image.mv('./public/product-images/'+id+'.jpg')
    //af

    }
  })
})
router.get('/add-to-cart/:id',(req,res)=>{
  
})

// router.get('/login',(req,res)=>{
//   console.log(req.session.user)
//   if(req.session.user){
      
//       res.redirect('/')
//   }
//   else{
//       res.render('user/login',{"loginErr":req.session.userLoginErr})
//       req.session.userLoginErr=false
//   }
  
// })
router.get('/admin-login',(req,res)=>{
  res.render('admin/admin-login')
console.log("abc")
})

let adminData ={
  Name:"admin@gmail.com",
  Password:"admin",
  name:"Admin"
}

router.post('/admin-login',function(req,res){
  console.log(req.body)
 if(req.body.email==adminData.Name && req.body.password==adminData.Password){
   console.log("login confirmed")
   req.session.admin=adminData
   req.session.adminloggedIn=true
 res.redirect('/admin')
}

 else{
   console.log("login failed");    
 
//  req.session.adminloginErr=true
 res.redirect('/admin/admin-login')
 }
})


router.get('/logout',function(req,res){
 //req.session.destroy()
 req.session.admin=null 
res.redirect('/admin/login') 
})


module.exports = router;
