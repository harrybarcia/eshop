const mongodb=require('mongodb');
const MongoClient=mongodb.MongoClient;
let _db;

const mongoConnect = callback=>{
// connect is an async function, so we need to use a callback function to get the result
MongoClient.connect('mongodb+srv://admin:doudou@cluster0.iaepn.mongodb.net/eshop')
.then(client=>{
    console.log('connected');
    _db=client.db();
    callback();
}).catch(err=>{
    console.log(err);
    throw err;

})
};

const getDb=()=>{
    if(_db){
        return _db;
    }
    throw 'No database found';
}

exports.mongoConnect=mongoConnect;
exports.getDb=getDb;