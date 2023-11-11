const express  =require("express")
const bodyParser = require("body-parser")



const  userController = require("./../Controller/userController")
const  articleController = require("./../Controller/articleController")

const router = express.Router()

router.route("/createUser")
.post(userController.validateNewUser,userController.createUser)

router.route("/Login")
.post(userController.validateUserCredentials)

router.route("/uploadtest")
.post(articleController.addPhototest)

module.exports = router