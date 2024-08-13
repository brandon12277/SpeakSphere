
const Articles = require("./../models/article")
const { ObjectId } = require('mongodb');


exports.checkvotepPresent = async (_id,firebaseUid,category) =>{

    const id = new ObjectId(_id)
    const checkvote = await Articles.find({
     "_id" : id,
     [category] : {
       $elemMatch: {
       userId: firebaseUid,
     }
    }
   }
   )

   if(checkvote.length === 0)
   return false;

   return true;

}
exports.GiveVote = async (_id,firebaseUid,category) =>{

    const id = new ObjectId(_id)
    const make_vote = await Articles.updateOne(
        {
          "_id" : id
         
        },
        {
          $push: {
            [category]: {
              
                "userId": firebaseUid,
                
              }
              
            }
        }
      )

      return make_vote.acknowledged
}
exports.RemoveVote = async (_id,firebaseUid,category) =>{

    const id = new ObjectId(_id)
    const remove_vote = await Articles.updateOne(
        {
          "_id" : id
         
        },
        {
          $pull: {
            [category]: {
              
                "userId": firebaseUid,
                
              }
              
            }
        }
      )

      return remove_vote.acknowledged
}


