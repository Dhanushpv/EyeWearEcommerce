const mongoose =require('mongoose')

let categorySchema = new mongoose.Schema({
    category :{
        type : String
    }

});

const categories = mongoose.model('categories', categorySchema);

module.exports = categories;