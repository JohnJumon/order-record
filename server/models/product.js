const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    productCode: { type: String, required: true, unique: true},
    productName: { type: String, required: true, default: "-"},
    productPrice: { type: Number, required: true, default: 0},
})

const Product = mongoose.model("Product", productSchema)

module.exports = Product;