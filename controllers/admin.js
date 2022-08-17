const Product = require('../models/product');
const mongodb=require('mongodb');
const ObjectId = mongodb.ObjectId;


exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    isAuthenticated: req.headers.cookie
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  // the left side is the key and the right side is the value
  const product = new Product({ title: title, price: price, description: description, imageUrl: imageUrl, userId: req.user});
  product
  // save method comes from the mongoose model
  .save()
  .then(result=>{
    console.log('Created Product');

  res.redirect('/admin/products');
  }).catch(err=>{
    console.log(err);
  });
};

exports.getEditProduct = (req, res, next) => {
  // if edit is set to true, then we are editing a product
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
  .then(product => {
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing:editMode,
      product: product,
      isAuthenticated: req.headers.cookie
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  Product.findById(prodId)
  // we have a full mongoos document, so we can use the update method
  .then(product => {
    product.title = updatedTitle;
    product.price = updatedPrice;
    product.description = updatedDesc;
    product.imageUrl = updatedImageUrl;
    return product.save();
  }).then(result=>{
    console.log('Updated Product');
    res.redirect('/admin/products');
  }).catch(err=>{
    console.log(err);
  }
  );
}


exports.postDeleteProduct= (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByIdAndRemove(prodId)
  .then(result=>{
    console.log('Deleted Product');
  res.redirect('/admin/products');
  })
  .catch(err=>{
    console.log(err);
  });
}



exports.getProducts = (req, res, next) => {
  Product.find()
// allow to have the all object and not write queries one by one
// .select('title price -_id')
//   .populate('userId', 'name')
  .then(products => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products',
      isAuthenticated: req.headers.cookie
    });
  }
  ).catch(err => {
    console.log(err);
  }
  );


};

