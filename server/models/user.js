const bcrypt = require('bcryptjs');

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
})

const User = mongoose.model("User", userSchema)

const staticUser = {
    username: process.env.USERNAME,
    password: bcrypt.hashSync(process.env.PASSWORD, 8),
};

User.create(staticUser)
    .then(() => console.log("Static user created successfully"))
    .catch((error) => console.error("Error creating static user:", error));

module.exports = User;