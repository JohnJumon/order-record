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
  origin: [process.env.ORIGIN],
  methods: ["GET", "POST", "PUT"],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(cookieParser());

app.get('/api', (req, res) => {res.json('Hello World!')})

app.post('/api/order', requireAuth, orderController.createOrder);
app.get('/api/order', requireAuth, orderController.fetchOrders);
app.get('/api/order/:id', requireAuth, orderController.fetchOrder);
app.put('/api/order/:id', requireAuth, orderController.updateOrder);
app.delete('/api/order/:id', requireAuth, orderController.deleteOrder)

app.post('/api/product', requireAuth, productController.createProduct);
app.get('/api/product', requireAuth, productController.fetchProducts);
app.get('/api/product/:id', requireAuth, productController.fetchProduct);
app.put('/api/product/:id', requireAuth, productController.updateProduct);
app.get('/api/product/check/:code', requireAuth, productController.checkProduct);

app.post('/api/customer', requireAuth, customerController.createCustomer);
app.get('/api/customer/:id', requireAuth, customerController.fetchCustomer);
app.get('/api/customer', requireAuth, customerController.fetchCustomers);
app.put('/api/customer/:id', requireAuth, customerController.updateCustomer);
app.get('/api/customer/check/:number', requireAuth, customerController.checkCustomer);

app.post('/api/login', userController.login)
app.get('/api/logout', userController.logout)
app.get('/api/check-auth', requireAuth, userController.checkAuth);

app.listen(3001, () => {
  console.log("Server is running");
})

connectDB()
