const express = require("express")
const {signup,login,forgotPassword,passwordReset} = require("../Controllers/authControllers")
const router = express.Router()


router.route("/signup").post(signup)
router.route("/login").post(login)
router.route("/forgotpassword").post(forgotPassword)
router.route("/resetpassword/:token").patch(passwordReset)

module.exports = router