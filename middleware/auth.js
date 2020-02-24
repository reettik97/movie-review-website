var User = require("../models/user")

function storeSessionData(req, res, next) {
  if (req.session && req.session.userId) {
    // let userId = req.session.userId;
    User.findById(req.session.userId, (err, userDetail) => {
      if (err) {
        return console.log(err);
      }
      req.userDetail = userDetail;
      res.locals.userDetail = userDetail;
      next();
    })
  } else {
    req.userDetail = null;
    res.locals.userDetail = null;
    next();
  }
}

function checkLoginUser(req, res, next) {
  if (req.session && req.session.userId) {
    next();
  } else {
    res.redirect("/users/login");
  }
}

module.exports = {
  storeSessionData,
  checkLoginUser
}