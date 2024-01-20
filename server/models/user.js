const bcrypt = require('bcryptjs');

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isMaster: { type: Boolean, default: false}
})

const User = mongoose.model("User", userSchema)

/**
const staticUser = {
    username: process.env.STATIC_USERNAME,
    password: bcrypt.hashSync(process.env.STATIC_PASSWORD, 8),
    isMaster: true,
};

User.create(staticUser)
    .then(() => console.log("Static user created successfully"))
    .catch((error) => console.error("Error creating static user:", error));
**/

module.exports = User;