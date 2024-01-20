if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}


const express = require('express');
const multer = require('multer');
const connectDB = require('./config/connectDB');

const orderController = require('./controllers/orderControllers');
const productController = require('./controllers/productControllers');
const customerController = require('./controllers/customerControllers');
const userController = require('./controllers/userControllers');
const requireAuth = require('./middleware/requireAuth');

const cors = require('cors');

const app = express();
const upload = multer()

app.use(cors({
  origin: [process.env.ORIGIN],
  methods: ["GET", "POST", "PUT"],
  credentials: true,
}));

app.use(express.json());
app.use(upload.single('image'))

app.get('/api', (req, res) => { res.json('Hello World!') })

app.post('/api/order', requireAuth, orderController.createOrder);
app.get('/api/order', requireAuth, orderController.fetchOrders);
app.get('/api/order/:id', requireAuth, orderController.fetchOrder);
app.put('/api/order/:id', requireAuth, orderController.updateOrder);
app.delete('/api/order/:id', requireAuth, orderController.deleteOrder)

app.post('/api/product', requireAuth, productController.createProduct);
app.get('/api/product', requireAuth, productController.fetchProducts);
app.get('/api/product/:id', requireAuth, productController.fetchProduct);
app.put('/api/product/:id', requireAuth, productController.updateProduct);
app.put('/api/product/:id/production', requireAuth, productController.productionProduct);
app.get('/api/product/check/:code', requireAuth, productController.checkProduct);

app.post('/api/customer', requireAuth, customerController.createCustomer);
app.get('/api/customer/:id', requireAuth, customerController.fetchCustomer);
app.get('/api/customer', requireAuth, customerController.fetchCustomers);
app.put('/api/customer/:id', requireAuth, customerController.updateCustomer);
app.put('/api/customer/:id/blacklist', requireAuth, customerController.blacklistCustomer);
app.get('/api/customer/check/:number', requireAuth, customerController.checkCustomer);

app.post('/api/admin', requireAuth, userController.createAdmin);
app.get('/api/admin', requireAuth, userController.fetchAdmins);
app.get('/api/admin/:id', requireAuth, userController.fetchAdmin);
app.get('/api/admin/check/:username', requireAuth, userController.checkAdmin);
app.put('/api/admin/:id', requireAuth, userController.updateAdmin);

app.post('/api/login', userController.login)
app.get('/api/logout', userController.logout)
app.get('/api/check-auth', requireAuth, userController.checkAuth);

app.listen(process.env.PORT)

connectDB()
