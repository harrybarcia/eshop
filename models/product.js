
const mongodb=require('mongodb');
const getDb=require('../util/database').getDb;

class Product{
    constructor(title,price,description,imageUrl, id, userId){
        this.title=title;
        this.price=price;
        this.description=description;
        this.imageUrl=imageUrl;
        this.userId=userId;
        this._id=id ? new mongodb.ObjectId(id) : null;
    }
    save(){
        const db=getDb();
        let dbOp;
        if(this._id){
            dbOp=db.collection('test').updateOne({_id:this._id},{$set:this});
        }else{
            console.log('insert');
            dbOp=db.collection('test').insertOne(this);
        }
        console.log('this');
        console.log(this);
        console.log('dbOp');
        console.log(dbOp);

        return dbOp
        .then(result=>{
            console.log(result);

    })
    .catch(err=>{
        console.log(err);
    });
}

    static fetchAll(){
        console.log('inside fetchAll');
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
    static deleteById(prodId){
        const db=getDb();
        return db.collection('test')
        .deleteOne({_id:new mongodb.ObjectId(prodId)})
        .then(result=>{
            console.log(result);
        }).catch(err=>{
            console.log(err);
        }   
        );
    }
}


module.exports=Product;