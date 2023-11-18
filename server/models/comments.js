const mongoose = require("mongoose")
const CommentSchema = new mongoose.Schema({
    author : {
        type: String,
    },
    stand : {
        type: Number,
        required: true,
        validate: {
            validator: function (v) {
                return [1, 2, 3, 4].includes(v);
            },
            message: props => `Not a valid value. It must be 1, 2, 3, or 4.`
        }
    },
    comment : {
        type: String,
    },
    likes : {
        type: String,
        required  : [true]
    },
    dislikes : {
        type : Number,
        required : [true]
    },
    reply : {
        type : Number,
        required : [true]
    },
    

});

const Comments = mongoose.model('Comments',CommentSchema)
module.exports = Comments