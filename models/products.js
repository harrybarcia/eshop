const fs=require('fs');
const path=require('path');
module.exports= class Product {
    constructor(t) {
        // je créé un objet avec les propriétés title
        this.title = t;
    }
    // je créé une méthode pour ajouter un produit
    save() {
        // I create the path to the file
        const p=path.join(
            path.dirname(require.main.filename),
            'data',
            'products.json');
        // i need to read the file and parse it to an object
        // my fileContent is a buffer so i need to convert it to a string
        // it is undefined because i don't have any data yet
        fs.readFile(p,(err,fileContent)=>{
            let products=[];
            if(!err){
                products=JSON.parse(fileContent);
            }
            products.push(this);
            fs.writeFile(p,JSON.stringify(products),(err)=>{
                console.log(err);
            });
    });
    }
    // je créé une méthode pour récupérer tous les produits avec static pour pouvoir l'utiliser sans instancier la classe
    static fetchAll() {
        return products;
    }

}

