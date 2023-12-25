
if (process.env.NODE_ENV != "production") {
  require("dotenv").config()
}

const express = require('express');
const connectDB = require('./config/connectDB');
const orderController = require('./controllers/orderControllers');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.post('/order', orderController.createOrder);
app.get('/order', orderController.fetchOrders);
app.get('/order/:id', orderController.fetchOrder);
app.put('/order/:id', orderController.updateOrder);
app.delete('/order/:id', orderController.deleteOrder)

app.listen(process.env.PORT)

connectDB()
