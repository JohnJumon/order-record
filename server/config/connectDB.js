const mongoose = require('mongoose');

async function connectDB() {
    try{
        await mongoose.connect(process.env.DB_URL)
        console.log('Database connected');
    } catch(err) {
        console.log(err);
    }
}

module.exports = connectDB;