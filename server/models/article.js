const mongoose = require("mongoose")
const ArticleSchema = new mongoose.Schema({
   firebaseUid: {
    type: String,
  },
  username: {
    type: String,
  },
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
    comments: [
        {
          user: {
            userId: {
              type: String,
            },
            username: String,
          },
          content: String,
          choice : String,
          replies: [
            {
              user: {
                userId: {
                  type: String,
                  
                },
                username: String,
              },
              content: String,
              choice : String,
            },
          ],
        },
      ],

    upvotes : [
        {
          userId: {
            type: String,
            
          },
        },
      ],
    downvotes : [
        {
          userId: {
            type: String,
           
          },
        },
      ],
    changedvotes : [
        {
          userId: {
            type: String,
            
          },
        },
      ],
    neutralvotes :[
        {
          userId: {
            type: String,
          },
        },
      ]
    

});

const Articles = mongoose.model('Articles',ArticleSchema)
module.exports = Articles