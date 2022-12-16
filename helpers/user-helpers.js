var db = require('../config/connection')
var collection = require('../config/collections');
const bcrypt = require('bcrypt')
// const objectId=require('mongodb').ObjectId;
module.exports = {
    doSignup: (userData) => {
        return new Promise(async (resolve, reject) => {
            userData.Password = await bcrypt.hash(userData.Password, 10)
            db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data) => {
                resolve(data.insertedId)


            })
        })

    },
    doLogin: (userData) => {
        return new Promise(async (resolve, reject) => {
            let loginStatus = false
            let response = {}
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ Email: userData.Email })
            if (user) {
                bcrypt.compare(userData.Password, user.Password).then((status) => {
                    if (status) {
                        console.log("Login Successfull")
                        response.user = user
                        response.status = true
                        resolve(response)
                    }
                    else {
                        console.log("Login failed")
                        resolve({ status: false })
                    }
                })
            }
            else {
                console.log("Login Failed")
                resolve({ status: false })
            }

        })

    }
    // addToCart:(proId,userId)=>{
    //     return new Promise((resolve,reject)=>{
    //         let userCart=await db.get().collection(collection.CART_COLLECTION).findOne({user:objectId(userId)})
    //         if(userCart){

    //         }else{
    //             let cartObj={
    //                 user:objectId(userId),
    //                 products:[objectId(proId)]
    //             }
    //             db.get().col
    //         }
    //     })
    // }
}
