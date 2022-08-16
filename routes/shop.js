const path = require('path');

const express = require('express');

const shopController = require('../controllers/shop');

const router = express.Router();

// router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:productId', shopController.getProduct);

router.post('/cart', shopController.postCart);

router.post('/cart-delete-item', shopController.postCartDeleteProduct);

router.get('/cart', shopController.getCart);

// // router.get('/checkout', shopController.getCheckout);

router.post('/create-order', shopController.postOrder);

// // /admin/products => GET
// router.get('/orders', shopController.getOrders);

// router.post('/orders', shopController.postOrder);


module.exports = router;
