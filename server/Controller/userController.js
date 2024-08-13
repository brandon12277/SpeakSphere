const User  = require("./../models/user")


exports.createUser = async (req,res) => {
   try{
    
    const user = await User.create(req.body)
    console.log(user)
    res.status(200).json(user)

    
   }
   catch(err){
    console.log(err)
    res.status(400).json("Error while logging In")
   }
   
}
exports.Finduser = async (req,res)=>{
    try{
        const finduser = {
            firebaseUid  : req.query.userid
        }
        const user = await User.findOne(finduser)
        
        if(user){
           res.status(200).json(user)
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






exports.validateUserCredentials = async (req,res) =>{
    try{
     const user = await User.findOne(req.body)
     console.log(user)
     
     if(user){
        res.status(200).json(user)
     }
     else{
        res.status(400).json("Invalid Username or password")
     }
    }
    catch(err){

    }

    
}

exports.validateNewUser = async (req,res) => {
   
    const users = await User.find({
        $or: [
          { username: req.body.username },
          { email: req.body.email },
          { phoneg: req.body.phone }
        ]
      });
  
     
      
      if(users.length){
        
        if(users[0].username == req.body.username)
        return res.status(400).json(
           "Username already exists"
        )

        if(users[0].email == req.body.email)
        return res.status(400).json(
            "This email is already registered"
        )

        if(users[0].phoneg == req.body.phone && (users[0].phoneg!=null || users[0].phoneg!=""))
        return res.status(400).json(
            "This mobile number is already registered"
        )
      }
      else
      {
        res.status(200).json()
      }
}

