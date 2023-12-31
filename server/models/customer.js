const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
    phoneNumber: { type: String, required: true, unique: true},
    customerName: { type: String, required: true, default: "-"},
    blacklist: { type: Boolean, default: false},
})

const Customer = mongoose.model("Customer", customerSchema)

module.exports = Customer;