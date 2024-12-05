const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();


async function mongoConnect() {
    try {
        await mongoose.connect(process.env.MONGOD_URI)
        console.log("Database connection established...")
    } catch (error) {
        console.log("Database connection error :", error)
    }
}

module.exports = mongoConnect;