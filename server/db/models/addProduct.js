const mongoose = require('mongoose');
const Schema = mongoose.Schema;  

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    // required: true,
    trim: true,
  },
  description: {
    type: String,
    // required: true,
  },
  price: {
    type: Number,
    // required: true,
    min: 0,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref :'categories'
    // required: true,
  },
  gender : {
    type: Schema.Types.ObjectId,
    ref : 'Gender'
  },
  brand: {
    type: String,
    // required: true,
  },
  stock: {
    type: Number,
    // required: true,
    min: 0,
  },
  images: [
    {
        url: { type: String, required: true },
        alt: { type: String }
    }
    ],

  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },

});



const Product = mongoose.model('Product', productSchema);

module.exports = Product;
