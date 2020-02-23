var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

// required sesssions
var session = require("express-session");
var Mongostore = require("connect-mongo")(session);


var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

// authentication middleware require
var auth = require("./middleware/auth");
 

//database conneection
mongoose.connect(
  "mongodb://localhost:27017/movies",
  { useNewUrlParser: true, useUnifiedTopology: true },
  err => {
    if (err) {
      return console.log;
    }
    console.log("Database connected");
  }
);


var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//session routes
app.use(session({
  secret : "reettikGoswami",
  resave: false,
  saveUninitialized: true,
  // cookie: { secure : true},
  store: new Mongostore({ mongooseConnection : mongoose.connection })
})); 

app.use(auth.storeSessionData); 

// main router 
app.use("/", indexRouter);
// app.use("/login" ,loginRoute);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
