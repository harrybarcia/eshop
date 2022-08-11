const fs=require('fs');
const path=require('path');
const p=path.join(path.dirname(require.main.filename),'data','cart.json');


module.exports=class Cart {
    static addProduct(id, productPrice) {
        // fetch the previous cart
            // I create my cart if it doesn't exist
        fs.readFile(p,(err,fileContent)=>{
            let cart={products:[], totalPrice:0};
            if (!err){
                cart=JSON.parse(fileContent);
            }
            // analyse the cart => find existing product
            const existingProductIndex=cart.products.findIndex(prod=>prod.id===id);
            const existingProduct=cart.products[existingProductIndex];
            let updatedProduct;
                    // add new product to the cart and increase the quantity
            if (existingProduct){
                updatedProduct={...existingProduct};
                updatedProduct.qty=updatedProduct.qty+1;
                cart.products=[...cart.products];
                // Our updated product is either replaced or added to the cart
                cart.products[existingProductIndex]=updatedProduct;

            }else{
                updatedProduct={id:id, qty:1};
                cart.products=[...cart.products, updatedProduct];
            }
            cart.totalPrice=cart.totalPrice+ + productPrice;
            fs.writeFile(p,JSON.stringify(cart),(err)=>{
                console.log(err);
            });
        })
    }

}
