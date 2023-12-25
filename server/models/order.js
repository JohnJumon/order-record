const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    clientName: { type: String, required: true, default: "-"},
    orderDate: { type: Date, default: Date.now },
    items: [
        {
            productName: {type: String, required: true},
            quantity: { type: Number, required: true, default: 1},
            price: { type: Number, required: true, default: 0}
        }
    ],
    orderStatus: {type: Number, required: true, default: 0}
})

const Order = mongoose.model("Order", orderSchema)

module.exports = Order;