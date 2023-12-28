
if (process.env.NODE_ENV != "production") {
  require("dotenv").config()
}

const express = require('express');
const connectDB = require('./config/connectDB');

const orderController = require('./controllers/orderControllers');
const productController = require('./controllers/productControllers');
const customerController = require('./controllers/customerControllers');
const userController = require('./controllers/userControllers');
const requireAuth = require('./middleware/requireAuth');

const cors = require('cors');
const cookieParser = require("cookie-parser");

const app = express();

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.post('/order', orderController.createOrder);
app.get('/order', orderController.fetchOrders);
app.get('/order/:id', orderController.fetchOrder);
app.put('/order/:id', orderController.updateOrder);
app.delete('/order/:id', orderController.deleteOrder)

app.post('/product', productController.createProduct);
app.get('/product', productController.fetchProducts);
app.get('/product/:id', productController.fetchProduct);
app.put('/product/:id', productController.updateProduct);
app.get('/product/check/:code', productController.checkProduct);

app.post('/customer', customerController.createCustomer);
app.get('/customer/:id', customerController.fetchCustomer);
app.get('/customer', customerController.fetchCustomers);
app.put('/customer/:id', customerController.updateCustomer);
app.get('/customer/check/:number', customerController.checkCustomer);

app.post('/signup', userController.signup)
app.post('/login', userController.login)
app.get('/logout', userController.logout)
app.get('/check-auth', requireAuth, userController.checkAuth);

app.listen(process.env.PORT)

connectDB()
