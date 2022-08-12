
const mongodb=require('mongodb');
const getDb=require('../util/database').getDb;

class Product{
    constructor(title,price,description,imageUrl){
        this.title=title;
        this.price=price;
        this.description=description;
        this.imageUrl=imageUrl;
    }
    save(){
        const db=getDb();
        return db.collection('test')
        .insertOne(this)
        .then(result=>{
            console.log(result);

    })
    .catch(err=>{
        console.log(err);
    });
}

    static fetchAll(){
        const db=getDb();
        return db.collection('test')
        // find is a cursor, so we need to use toArray to get the result
        .find()
        .toArray()
        .then(products=>{
            console.log(products);
            return products;
        }).catch(err=>{
            console.log(err);
        });
    }
    static findById(prodId){
        const db=getDb();
        console.log('prodId');
        console.log(prodId);
        console.log('new mongodb.ObjectId(prodId)');
        console.log(new mongodb.ObjectId(prodId));

        return db.collection('test')
        .find({_id:new mongodb.ObjectId(prodId)})
        .next()
        .then(product=>{
            console.log(product);
            return product;
        }).catch(err=>{
            console.log(err);
        }   
        );
    }
}


module.exports=Product;