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
    },
    password : {
        type: String,
    },
     email : {
        type: String,
        required : [true],
        unique  :true,
    },
    phoneg : {
       type: String,
       unique  :true,
       sparse : true,
    }

});
userSchema.index({ phoneg: 1 }, { unique: true, partialFilterExpression: { phoneg: { $exists: true } } });
const Users = mongoose.model('Users',userSchema)
module.exports = Users