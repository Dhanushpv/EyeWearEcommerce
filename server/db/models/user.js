
const mongoose = require('mongoose');

const users = new mongoose.Schema({
    name: {
        type: String,
        // required: true,
    },
    email: {
        type: String,
        // required: true,
    },
    phone_no: {
        type: String,
        // required: true, // If necessary
    },
    password: {
        type: String,
        // required: true,
    },
    usertype: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "usertypes",
    },
    address: [
        {
            firstName: {
                type: String,
                // required: true,
            },
            pincode: {
                type: String,
                // required: true,
            },
            flatDetails: {
                type: String,
                // required: true,
            },
            streetDetails: {
                type: String,
                // required: true,
            },
            landmark: {
                type: String,
            },
            city: {
                type: String,
                // required: true,
            },
            state: {
                type: String,
                // required: true,
            },
        }
    ],
    
    addCart: [
        {
            items: [
                {
                    productId: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'products', // Reference to the Product collection 
                        // required: true,
                    },
                    quantity: {
                        type: Number,
                        // required: true,
                        min: 0,
                    },
                    price: {
                        type: Number,
                        // required: true,
                    },
                }
            ],
            totalPrice: {
                type: Number,
                default: 0,
            }
        }
    ],
    wishlist: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'products', // Reference to the Product collection
                // required: true,
            },
            title: {
                type: String, // Optional product name for display
                // required: true,
            },
            price: {
                type: Number, // Optional product price for display
                // required: true,
            },
            images: {
                type: [String], // Array of image URLs
                default: [], 
            },
            addedAt: {
                type: Date, // Timestamp when the product was added to the wishlist
                default: Date.now,
            },
        }
    ],
});

module.exports = mongoose.model("users", users);
