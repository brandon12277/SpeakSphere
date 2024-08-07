const express  =require("express")
const bodyParser = require("body-parser")
const upload = require("../config/multerconnfig")


const  userController = require("./../Controller/userController")
const  articleController = require("./../Controller/articleController")

const router = express.Router()

router.route("/createUser")
.post(userController.createUser)

router.route("/Login")
.post(userController.validateUserCredentials)

router.route("/FindUser")
.get(userController.Finduser)

router.route("/PullArticles")
.get(articleController.FindArticles)

router.route("/FindRandomPosts")
.get(articleController.findRandomArticles)

router.route("/FindTrending")
.get(articleController.findTrendingArticles)

router.route("/FindMostVotes")
.get(articleController.findMostUpvoted)


router.route("/FindArticle")
.get(articleController.FindSpecificArticle)

router.route("/CheckVotestatus")
.get(articleController.CheckVotestatus)



router.post("/handlevote",articleController.handleVote)

router.post("/AddComment",articleController.AddComment)

router.post("/AddReply",articleController.AddReply)

router.route("/ValidateUser")
.post(userController.validateUserCredentials)

router.route("/ValidateNewUser")
.post(userController.validateNewUser)

router.post("/addArticles",upload.single('file'),articleController.addArticles)
router.route("/DeletePost").post(articleController.DeletePost)

router.route("/updateArticle/:id").post(articleController.UpdateArticle)
.post(userController.validateNewUser)



module.exports = router