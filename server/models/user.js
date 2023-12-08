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
        unique  :true,
        sparse: true,
        default: null,
    },
    password : {
        type: String,
    },
     email : {
        type: String,
        required : [true],
        unique  :true,
        sparse: true,
        default: null,
    },
    phone : {
        type: String,
        unique  :true,
        sparse: true,
        default: null,
    }

});

const Users = mongoose.model('Users',userSchema)
module.exports = Users