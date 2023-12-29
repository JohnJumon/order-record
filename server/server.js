
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
  methods: ["GET", "POST", "PUT"],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {res.json('Hello World!')})

app.post('/order', requireAuth, orderController.createOrder);
app.get('/order', requireAuth, orderController.fetchOrders);
app.get('/order/:id', requireAuth, orderController.fetchOrder);
app.put('/order/:id', requireAuth, orderController.updateOrder);
app.delete('/order/:id', requireAuth, orderController.deleteOrder)

app.post('/product', requireAuth, productController.createProduct);
app.get('/product', requireAuth, productController.fetchProducts);
app.get('/product/:id', requireAuth, productController.fetchProduct);
app.put('/product/:id', requireAuth, productController.updateProduct);
app.get('/product/check/:code', requireAuth, productController.checkProduct);

app.post('/customer', requireAuth, customerController.createCustomer);
app.get('/customer/:id', requireAuth, customerController.fetchCustomer);
app.get('/customer', requireAuth, customerController.fetchCustomers);
app.put('/customer/:id', requireAuth, customerController.updateCustomer);
app.get('/customer/check/:number', requireAuth, customerController.checkCustomer);

app.post('/login', userController.login)
app.get('/logout', userController.logout)
app.get('/check-auth', requireAuth, userController.checkAuth);

connectDB()
