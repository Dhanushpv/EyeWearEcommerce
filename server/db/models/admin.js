const mongoose = require('mongoose');
const Schema = mongoose.Schema;  

const accessSchema = new Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String
    },
    usertype: {
        type: Schema.Types.ObjectId, // Reference to another schema
        ref: 'usertypes' // Refers to the 'UserType' model
    }
});

const Access = mongoose.model('AdminControl', accessSchema); 
module.exports = Access;