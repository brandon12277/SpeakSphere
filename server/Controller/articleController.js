const Articles = require("./../models/article")

const { initializeApp } =require("firebase/app");
const firebaseConfig =require("../config/firebaseConfig.js");
// import { getStorage, ref,getDownloadURL, uploadBytes } from "firebase/storage";

const { getStorage, ref,getDownloadURL, uploadBytesResumable } = require("firebase/storage")





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
exports.findTrendingArticles = async (req,res) =>{
  try{ 
    const trend_posts = await Articles.aggregate([
      {
        $project: {
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
              { $size: "$neuralvotes" },
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
    console.log(req.file)
    const article_name = req.body.name
    const article_descp = req.body.description

    const img_url = await file_url(img_file)
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

