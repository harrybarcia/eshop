const mongodb=require('mongodb');
const MongoClient=mongodb.MongoClient;

const mongoConnect=(callback)=>{

MongoClient.connect('mongodb+srv://admin:doudou@cluster0.iaepn.mongodb.net/eshop')
.then(client=>{
    console.log('connected');
    callback(client);
}).catch(err=>{
    console.log(err);

})
};

module.exports=mongoConnect;