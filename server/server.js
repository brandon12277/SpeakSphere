const express= require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
dotenv.config({path: './config/config.env'})
const bodyParser = require('body-parser');
const cors = require('cors'); 

const app = express()
port = process.env.PORT || 5000



const router = require('./Routes/index');
app.use(bodyParser.json({ limit: '400mb' }));
app.use(cors());
app.use('/db', router);






mongoose.connect(process.env.CONN_STR,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then((conn)=>{
    console.log("DB connection succesfull")

})
.catch((error) => {
    console.error('Error :', error);
  
  });


  app.get("/getpost",(req,res)=>{
       
    return res.status(200).json("");
     
  })

  function makeRequest() {
    fetch("https://speakserver.onrender.com/getpost")
        .then(() => console.log("up and running"))
        .catch(err => console.log("opps! server down"))
}


makeRequest();

setInterval(makeRequest, 13 * 60 * 1000)





app.listen(port,()=>{
    console.log("Server running at ",port);
})