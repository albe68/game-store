

var db = require('../config/connection')
var collection = require('../config/collections');
const objectId = require('mongodb').ObjectId;
const { resolve } = require('express-hbs/lib/resolver');
const { response } = require('../app');
module.exports = {
    addProduct: (product, callback) => {

        db.get().collection('product').insertOne(product).then((data) => {
            console.log(data);
            callback(data.insertedId)
        })
    },
    getAllProducts: () => {
        return new Promise(async (resolve, reject) => {
            let products = await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
            resolve(products)

        })

    },
    deleteProduct: (proId) => {
        return new Promise((resolve, reject) => {
            console.log(proId)
            console.log(objectId(proId))
            db.get().collection(collection.PRODUCT_COLLECTION).deleteOne({ _id: objectId(proId) }).then((response) => {
                // console.log(response);
                resolve(response);

            })
        })
    },
    getProductDetails: (proId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTION).findOne({ _id: objectId(proId) }).then((product) => {
                resolve(product)
            })
        })
    },
    updateProduct: (proId, proDetails) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTION)
                .updateOne({ _id: objectId(proId) }, {
                    $set: {
                        Name: proDetails.Name,
                        Description: proDetails.Description,
                        Price: proDetails.Price,
                        Category: proDetails.Category
                    }
                }).then((response) => {
                    resolve()
                })
        })
    }
}