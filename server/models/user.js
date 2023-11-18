const mongoose = require("mongoose")
const userSchema = new mongoose.Schema({
    firebaseUid : {
       type : String,
       required : [true]
    },
    name : {
        type: String,
        required  : [true]
    },
    username : {
        type: String,
        required : [true],
        unique  :true
    },
    password : {
        type: String,
    },
     email : {
        type: String,
        required : [true],
        unique  :true
    },
    phone : {
        type: String,
        unique  :true
    }

});

const Users = mongoose.model('Users',userSchema)
module.exports = Users