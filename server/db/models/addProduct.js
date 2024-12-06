const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    min: 0,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'categories',
  },
  gender: {
    type: Schema.Types.ObjectId,
    ref: 'Gender',
  },
  brand: {
    type: String,
  },
  stock: {
    type: Number,
    min: 0,
  },
  images: [
    {
      url: { type: String, required: true },
      alt: { type: String },
    },
  ],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'users', // Reference to the User model
    // required: true,
  },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
