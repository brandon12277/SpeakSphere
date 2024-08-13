const express= require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
dotenv.config({path: './config/config.env'})
const bodyParser = require('body-parser');
const cors = require('cors'); 

const app = express()
port = process.env.PORT || 5000



const router = require('./Routes/index');
app.use(bodyParser.json());
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





app.listen(port,()=>{
    console.log("Server running at ",port);
})