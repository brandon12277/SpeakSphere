const mongoose = require("mongoose")
const ArticleSchema = new mongoose.Schema({
      
    article_name : {
        type: String,
        required  : [true]
    },
    article_img : {
        type: String,
    },
    description : {
        type: String,
        required  : [true]
    },
    upvotes : {
        type : Number,
        required : [true]
    },
    downvotes : {
        type : Number,
        required : [true]
    },
    changedvotes : {
        type : Number,
        required : [true]
    },
    neutralvotes : {
        type : Number,
        required : [true]
    }
    

});

const Articles = mongoose.model('Articles',ArticleSchema)
module.exports = Articles