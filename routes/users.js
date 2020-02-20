var express = require('express');
var controller =  require("../controller/loginController");

var router = express.Router();


// render login register forms
router.get('/login', controller.renderLoginForm);
router.get("/register" , controller.renderLoginForm);


// handel the login and register post routes
router.post("/login" , controller.checkLoginValidation)
router.post("/register" , controller.addUserIntoTheDatabase )


module.exports = router;
