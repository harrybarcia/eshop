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
            const existingProductIndex=cart.products.findIndex(prod=>prod.id===id); // output "0"
            const existingProduct=cart.products[existingProductIndex];// output {id:3, qty:1}
            let updatedProduct;
                    // add new product to the cart and increase the quantity
            if (existingProduct){
                updatedProduct={...existingProduct};// I create a copy of the existing product
                updatedProduct.qty=updatedProduct.qty+1; // I increase the quantity
                cart.products=[...cart.products];// I create a copy of the products array
                // Our updated product is either replaced or added to the cart
                cart.products[existingProductIndex]=updatedProduct;// I replace the existing product with the updated product

            }else{
                updatedProduct={id:id, qty:1}; // I create a new product
                cart.products=[...cart.products, updatedProduct];// I add the new product to the cart
            }
            cart.totalPrice=cart.totalPrice+ + productPrice;// I increase the total price
            fs.writeFile(p,JSON.stringify(cart),(err)=>{
                console.log(err);
            });
        })
    }

    static deleteProduct(id, productPrice) {
        fs.readFile(p, (err, fileContent) => {
          if (err) {
            return;
          }
          const updatedCart = { ...JSON.parse(fileContent) };
          const product = updatedCart.products.find(prod => prod.id === id);
          if (!product) {
            return;
          }
          const productQty = product.qty;
          updatedCart.products = updatedCart.products.filter(
            prod => prod.id !== id
          );
          updatedCart.totalPrice =
            updatedCart.totalPrice - productPrice * productQty;
    
          fs.writeFile(p, JSON.stringify(updatedCart), err => {
            console.log(err);
          });
        });
      }
    

    static getCart(cb) {
        fs.readFile(p, (err, fileContent) => {
          const cart = JSON.parse(fileContent);
          if (err) {
            cb(null);
          } else {
            cb(cart);
          }
        });
      }
    

}
