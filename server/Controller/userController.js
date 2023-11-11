const User  = require("./../models/user")

exports.createUser = async (req,res) => {
   try{
    console.log(req.body)
    const user = await User.create(req.body)
    res.status(201).json({
        data : {
            user
        }
    })
   }
   catch(err){
     console.log(err.code)
   }
   
}


exports.validateUserCredentials = async (req,res) =>{
    try{
     const user = await User.find({
        $and:[
            req.body
        ]
     })
     
     if(user.length){
        res.status(400).json({
            res  : "Your logged in"
        })
     }
     else{
        res.status(400).json({
            res  : "Credentials are not present"
        })
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
          { phoneNumber: req.body.phone }
        ]
      });
  
      console.log(users)

      if(users.length){
        if(users[0].username == req.body.username)
        res.status(400).json({
            res  : "Username already exists"
        })

        if(users[0].email == req.body.email)
        res.status(400).json({
            res  : "This email is already registered"
        })

        if(users[0].phone == req.body.phone)
        res.status(400).json({
            res  : "This mobile number is already registered"
        })
      }
}

