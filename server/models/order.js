const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    clientName: { type: String, required: true, default: "-" },
    orderDate: { type: Date, default: Date.now },
    items: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
            quantity: { type: Number, required: true, default: 1 },
            productPrice: { type: Number },
            productName: { type: String },
            productCode: { type: String },
        }
    ],
    orderStatus: { type: Number, required: true, default: 0 }
})

orderSchema.pre("save", async function (next) {
    try {
        if (!this.items[0].product.productPrice) {
            await this.populate("items.product");
        }
        this.items.forEach(item => {
            item.productPrice = item.product.productPrice;
            item.productName = item.product.productName;
            item.productCode = item.product.productCode;
        });

        next();
    } catch (error) {
        next(error);
    }
});

const Order = mongoose.model("Order", orderSchema)

module.exports = Order;