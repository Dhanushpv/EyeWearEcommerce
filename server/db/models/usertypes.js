const mongoose =require('mongoose')

let userSchema = new mongoose.Schema({
    usertype :{
        type : String
    }

});

const UserType = mongoose.model('usertypes', userSchema);

module.exports = UserType;