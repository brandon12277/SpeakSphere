const Articles = require("./../models/article")

const { initializeApp } =require("firebase/app");
const firebaseConfig =require("../config/firebaseConfig.js");
// import { getStorage, ref,getDownloadURL, uploadBytes } from "firebase/storage";

const { getStorage, ref,getDownloadURL, uploadBytesResumable } = require("firebase/storage")
const { ObjectId } = require('mongodb');

const voter = require("./VotingFunctions.js")


const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);



function getCurrentDateTimeString() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  const dateString = `${year}-${month}-${day}`;
  const timeString = `${hours}:${minutes}:${seconds}`;

  // Combine date and time
  const dateTimeString = `${dateString} ${timeString}`;

  return dateTimeString;
}

async function file_url(file){
  const storageRef = ref(storage, "article_images/"+file.originalname+getCurrentDateTimeString());

  // Upload the image
  
  const metadata = {
    contentType  : file.mimetype
  }
  const snapshot = await uploadBytesResumable(storageRef, file.buffer,metadata)
  const DownloadURL = await getDownloadURL(snapshot.ref)

  return DownloadURL
}


exports.addPhototest = async (req,res) =>{
    
      const file = req.file;
      
    // Get a reference to the storage location
     
    
      
}

exports.findRandomArticles = async (req,res) =>{

  try{ 
    const random_posts = await Articles.aggregate([
      { $sample: { size: 10 } }
    ]);

    res.status(200).json(random_posts)
  }
  catch(err){
    
  }
   
    




}


exports.findMostUpvoted = async (req,res) =>{
  try{ 
    const upvoted_posts = await Articles.aggregate([
      {
        $project: {
          _id:1,
          username  :1,
          article_name : 1,
          article_img : 1,
          description: 1,
          comments : 1,
          upvotes : 1,
          downvotes : 1,

       
           
          upvotedLength : { $size: "$upvotes" },
  
          
        }
      },
      {
        $sort: {
          upvotedLength : -1
        }
      },
      {
        $limit: 10  // Limit the result to 10 documents
      }
    ]);
    
    res.status(200).json(upvoted_posts)
  }
  catch(err){
    
  }
   
    




}


exports.handleVote = async (req,res) =>{
  try{
    
    const id = new ObjectId(req.body._id)
    const userIdToCheck = req.body.firebaseUid
    const category = req.body.category
     
    const given_upvote = await voter.checkUpvotepPresent(req.body._id,userIdToCheck,"upvotes")
    const given_downvote = await voter.checkUpvotepPresent(req.body._id,userIdToCheck,"downvotes")
    const given_neutralvote = await voter.checkUpvotepPresent(req.body._id,userIdToCheck,"neutralvotes")
    const given_changedvote = await voter.checkUpvotepPresent(req.body._id,userIdToCheck,"changedvotes")

        if(given_downvote && category === "downvotes") return res.status(200).json(1)
        if(given_upvote && category === "upvotes") return res.status(200).json(1)
        if(given_neutralvote && category === "neutralvotes") return res.status(200).json(1)



        if(given_downvote && category === "upvotes"){
          const pull_downvote = voter.RemoveVote(req.body._id,userIdToCheck,"downvotes")
          if(pull_downvote)
            {
              const give_vote = await voter.GiveVote(req.body._id,userIdToCheck,category)
              if(!given_changedvote){
                const give_change_vote = await voter.GiveVote(req.body._id,userIdToCheck,"changedvotes")
              }
              
              if(give_vote)
               return res.status(200).json(1)
            }
        }
        else if(given_downvote && category === "neutralvotes")return res.status(200).json(1)
        

        if(given_upvote && category === "downvotes"){
          const pull_upvote = voter.RemoveVote(req.body._id,userIdToCheck,"upvotes")
          if(pull_upvote)
            {
              const give_vote = await voter.GiveVote(req.body._id,userIdToCheck,category)
              if(!given_changedvote){
                const give_change_vote = await voter.GiveVote(req.body._id,userIdToCheck,"changedvotes")
              }
              if(give_vote)
               return res.status(200).json(1)
            }
        }
        else if(given_downvote && category === "neutralvotes")return res.status(200).json(1)

        
        if(given_neutralvote && category!="neutralvotes"){
          const pull_neutralvote = voter.RemoveVote(req.body._id,userIdToCheck,"neutralvotes")
          if(pull_neutralvote)
            {
              const give_vote = await voter.GiveVote(req.body._id,userIdToCheck,category)
              if(give_vote)
               return res.status(200).json(1)
            }
        }

        const make_new_vote = await voter.GiveVote(req.body._id,userIdToCheck,category)
        if(make_new_vote)
               return res.status(200).json(1)
      
     
      
 
  }
  catch(err){
    console.log(err)
  }
}



exports.findTrendingArticles = async (req,res) =>{
  try{ 
    const trend_posts = await Articles.aggregate([
      {
        $project: {
          _id:1,
          username  :1,
          article_name : 1,
          article_img : 1,
          description: 1,
          comments : 1,
          upvotes : 1,
          downvotes : 1,

          totalLength: {
            $add: [
              { $size: "$upvotes" },
              { $size: "$downvotes" },
              { $size: "$neutralvotes" },
            ]
          }
        }
      },
      {
        $sort: {
          totalLength: -1
        }
      },
      {
        $limit: 10  // Limit the result to 10 documents
      }
    ]);
    res.status(200).json(trend_posts)
  }
  catch(err){
    
  }
   
    




}
exports.addArticles = async (req,res) =>{

    const img_file = req.file;
    
    const article_name = req.body.name
    const article_descp = req.body.description
    let img_url = ""
    if(img_file){img_url = await file_url(img_file)}
    const new_article = {
      "firebaseUid" : req.body.firebaseUid,
      "username" : req.body.username,
      "article_name" : article_name,
      "article_img" : img_url,
      "description" : article_descp

    }
    try{
      
      const article = await Articles.create(new_article)
      res.status(200).json(article)
     }
     catch(err){
       console.log(err.code)
     }

}

exports.FindSpecificArticle = async (req,res)=>{
  try{
      const id = {
        _id : req.query.id
      }
      const article = await Articles.findOne(id)
      if(article){

        let choice = []

        console.log(choice)
        
        res.status(200).json(article)
     }
     else{
        res.status(400).json({
            res  : "Credentials are not present"
        })
     }

  }

  catch(e){

  }
}


exports.AddComment = async (req,res) =>{
  try{
        
    const id = new ObjectId(req.body._id)
    const userid = req.body.firebaseUid

    const comment = {
      "user" : {
        "userId" : userid,
         "username" : req.body.username
      },
      "content" : req.body.content,
      "choice" : req.body.choice,
      replies: []

    }
    
    const make_comment = await Articles.findOneAndUpdate(
        {
          "_id" : id
         
        },
        {
          $push: {
            comments : comment
          }
        },
        { returnDocument: 'after' }
      )

      console.log(make_comment)
     const newComment = make_comment.comments[make_comment.comments.length-1 ];
     const newCommentId = newComment._id.toString();

     res.status(200).json({"comment_id" : newCommentId,"done" : true})
  

  }
  catch(e){
   console.log(e)
  }
}


exports.AddReply = async (req,res) =>{
  try{
        
    const id = new ObjectId(req.body._id)
    const userid = req.body.firebaseUid
    const comment_id = new ObjectId(req.body.comment_id)

    const reply = {
      "user" : {
        "userId" : userid,
         "username" : req.body.username
      },
      "content" : req.body.content,
      "choice" : req.body.choice,
      replies: []

    }
    
    const make_reply= await Articles.updateOne(
      {
        _id: id,
        'comments._id': comment_id,
      },
      {
        $push: {
          'comments.$.replies': reply,
        },
      }
      )
      if(make_reply.acknowledged)return res.status(200).json(true)
  

  }
  catch(e){
   console.log(e)
  }
}



exports.FindArticles = async (req,res)=>{
  try{
     
      const user = {
          firebaseUid  : req.query.userid
      }
      const articles = await Articles.find(user)
      
      if(articles){

         res.status(200).json(articles)
      }
      else{
         res.status(400).json({
             res  : "Credentials are not present"
         })
      }
     }
     catch(err){
  console.log(err)
     }
}

exports.CheckVotestatus = async (req,res)=>{
  try{
     console.log(req.query.id,req.query.userid)
    const given_upvote = await voter.checkUpvotepPresent(req.query.id,req.query.userid,"upvotes")
    const given_downvote = await voter.checkUpvotepPresent(req.query.id,req.query.userid,"downvotes")
    
      
      if(given_upvote){

         res.status(200).json(1)
      }
      else if(given_downvote){
        res.status(200).json(2)
      }
      else{
         res.status(200).json(false)
      }
     }
     catch(err){
  console.log(err)
     }
}

