const fs=require('fs');
const path=require('path');
const p=path.join(path.dirname(require.main.filename),
'data',
'products.json');

// my function getProducts() uses the fs.readFile() method to read the products.json file and return the data in the callback function.
const getProductsFromFile = cb => {
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        cb([]);
      } else {
        cb(JSON.parse(fileContent));
      }
    });
  };

module.exports= class Product {
    constructor(title, imageUrl, description, price) {
        // je créé un objet avec les propriétés title
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }
    // je créé une méthode pour ajouter un produit
    save() {
        // I retrieve the promise from the getProductsFromFile() method and store the result in a variable called products.It is an array.
        getProductsFromFile(products => {
            products.push(this);
            fs.writeFile(p, JSON.stringify(products), err => {
                console.log(err);
            });
        });
    }

        // I create the path to the file
        // i need to read the file and parse it to an object
        // my fileContent is a buffer so i need to convert it to a string
        // it is undefined because i don't have any data yet
    //     fs.readFile(p,(err,fileContent)=>{
    //         let products=[];
    //         if(!err){
    //             products=JSON.parse(fileContent);
    //         }
    //         products.push(this);
    //         fs.writeFile(p,JSON.stringify(products),(err)=>{
    //             console.log(err);
    //         });
    // });
    
    // je créé une méthode pour récupérer tous les produits avec static pour pouvoir l'utiliser sans instancier la classe
    static fetchAll(cb) {
        getProductsFromFile(cb);
        //     // my static method execute this line 
        // const p=path.join(
        //     path.dirname(require.main.filename),
        //     'data',
        //     'products.json');
        //     // execute this line but registers the callback in the event loop and it finishes the function.
        //     // the function returns a promise.
        //     // the returns belong to the promise (the inner function) not to the outer function.
        //     // so I try to access lentgh of the products array but it is undefined.
        // fs.readFile(p, (err,fileContent)=>{
        //     if(err){
        //         cb([]);
        //     }
        //     cb(JSON.parse(fileContent));
        // });
    }

}