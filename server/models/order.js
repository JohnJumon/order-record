const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true},
    orderDate: { type: Date, default: Date.now },
    items: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
            quantity: { type: Number, required: true, default: 1 },
            status: { type: Number, default: 0},
            size: {type: String, default: "-"},
            color: {type: String, default: "-"},
            description: {type: String, default: "-"},
        }
    ],
    statusCount: {
        0: {type: Number, default: 0},
        1: {type: Number, default: 0},
        2: {type: Number, default: 0},
        3: {type: Number, default: 0},
        4: {type: Number, default: 0},
    },
    deposit: {type: Number, default: 0},
    isPaidOff: {type: Boolean, default: false}
})

const Order = mongoose.model("Order", orderSchema)

module.exports = Order;