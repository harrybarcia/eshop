const Product = require('../models/product');
const Order=require('../models/order');

exports.getProducts = (req, res, next) => {
  // i use find instead of fetchAll 
  Product.find()
    .then(products => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products'
      });
    })
    .catch(err => {
      console.log(err);
    }
    );
}

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  //findbyid is a mongoose method 
  Product.findById(prodId)
    .then(product => {
    res.render('shop/product-detail', {
      product: product,
      pageTitle: product.title,
      path: '/products'
    });
  });
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
  .then(products => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    });
  })
  .catch(err => {
    console.log(err);
  }
  );
}

exports.getCart = (req, res, next) => {
  req.user
  .populate('cart.items.productId')
.then(user => {
  console.log(user.cart.items);
  const products = user.cart.items;
    res.render('shop/cart', {
      path: '/cart',
      pageTitle: 'Your Cart',
      products: products
    });
    
  }).catch(err => {
    console.log(err);
  }
  );
};
// I retrieve the request body from the form sent by the user
exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;

  Product.findById(prodId)
  .then(product => {
    return req.user.addToCart(product);
  })
  .then(result=>{
      console.log(result);
      res.redirect('/cart');
  })
  .catch(err=>{
    console.log(err);
  }
  );
}

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
  .removeFromCart(prodId)
  .then(result=>{
    res.redirect('/cart');
  }
  ).catch(err=>{
    console.log(err);
  });
};
  
exports.postOrder = (req, res, next) => {
  req.user
  .populate('cart.items.productId')
.then(user => {
  console.log(user.cart.items);
  const products = user.cart.items.map(i=>{
    return {quantity: i.quantity, product: {...i.productId._doc}};
  });
  const order=new Order({
    user:{
      name:req.user.name,
      userId:req.user
    },
    products:products

    });
    return order.save();
})
.then(result=>{
  return req.user.clearCart();
}).then(result=>{
      res.redirect('/orders');
    })

    .catch(err => console.log(err));
};


exports.getOrders = (req, res, next) => {
  Order.find({'user.userId': req.user._id})
  .then(orders => {
    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders',
      orders: orders
    });
  }).catch(err => {
    console.log(err);
  });
} 

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout',
    
  });
};
