const mongoose =require('mongoose')

let genderSchema = new mongoose.Schema({
    gender :{
        type : String
    }

});

const genders = mongoose.model('Gender', genderSchema);

module.exports = genders;