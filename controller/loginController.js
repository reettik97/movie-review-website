var User = require("../models/user");
var bcrypt = require("bcryptjs");

function renderLoginForm(req, res) {
  res.render("login-reg");
}

// add user into the database 
function addUserIntoTheDatabase(req, res) {
  let userObj = req.body;
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return console.log("genSalt create fail");
    }
    bcrypt.hash(req.body.password, salt, (err, hash) => {
      if (err) {
        return console.log('hash password create fail');
      }
      userObj.password = hash;
      // insert into the database userObj    
      User.create(userObj, (err, data) => {
        if (err) {
          return console.log(err);
        }
        res.redirect("/");
      })
    })
  })
}

// check the validation email and password
function checkLoginValidation(req, res) {
  User.findOne({
    email: req.body.email
  }, (err, user) => {
    if (err) {
      return console.log(err);
    }
    // is user is true that mean the email is currect
    if (!user) {
      res.send("wrong email address")
    }
    //check the password is currect or not
    bcrypt.compare(req.body.password, user.password, (err, response) => {
      if (err) {
        return console.log(err)
      }
      if (response) {
        req.session.userId = user.id;
        res.redirect("/");
      } else {
        res.send("wrong password");
      }
    })
  })
}

function logout(req, res, next) {
  if (req.session && req.session.userId) {
    req.session.destroy()
  }
  res.redirect('/');
}

module.exports = {
  renderLoginForm,
  addUserIntoTheDatabase,
  checkLoginValidation,
  logout
}