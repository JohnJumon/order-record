const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true},
    orderDate: { type: Date, default: Date.now },
    items: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
            quantity: { type: Number, required: true, default: 1 },
            productPrice: { type: Number },
            productName: { type: String },
            productCode: { type: String },
            productImage: { type: String }
        }
    ],
    orderStatus: { type: Number, required: true, default: 0 }
})

orderSchema.pre("save", async function (next) {
    try {
        if (!this.items[0].product.productPrice) {
            await Promise.all(
                this.items.map(
                    async (item, index) => {
                        const path = `items.${index}.product`;
                        await this.populate({ path });
                        item.productPrice = item.product.productPrice;
                        item.productName = item.product.productName;
                        item.productCode = item.product.productCode;
                    }
                )
            )
        };

        next();
    } catch (error) {
        next(error);
    }
});

const Order = mongoose.model("Order", orderSchema)

module.exports = Order;