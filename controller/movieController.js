var mongoose = require('mongoose');
var path = require("path");
var fs = require("fs");

//require the database models
var Movie = require("../models/movie");
var Comment = require("../models/comment");

//render all the forms
function viewIndex(req, res, next) {
  Movie.find({}, (err, movies) => {
    if (err) {
      return console.log(err)
    }
    res.render('index', {
      movies,
    });
  })
}

function renderAddForm(req, res, next) {
  res.render("addMovie");
}

function renderEditForm(req, res, next) {
  // send the data to the edit page
  let movieId = req.params.id;
  Movie.findById(movieId, (err, movie) => {
    if (err) {
      next(err);
    }
    res.render("editMovie", {
      movie,
      userDetail: req.userDetail
    });
  })
}

// database 
function addIntoTheDatabase(req, res, next) {
  req.body.createdBy = req.userDetail.id;
  req.body.tags = req.body.tags.split(",");
  req.body.directedBy = req.body.directedBy.split(",");
  req.body.writtenBy = req.body.writtenBy.split(",");
  let movieObj = req.body;
  let imgPath = "/images/uploads/" + req.file.originalname;
  movieObj.imgSrc = imgPath;
  Movie.create(movieObj, (err, data) => {
    if (err) {
      return console.log(err)
    }
    res.redirect("/");
  })
}

// edit the movie into the database
function editTheMovie(req, res) {
  let movieId = req.params.id;
  Movie.findById(movieId, (err, movie) => {
    if (err) {
      return console.log(err);
    }
    if (req.file) {
      let imgPath = "/images/uploads/" + req.file.originalname;
      req.body.imgSrc = imgPath;

      let deleteImagePath = path.join(__dirname, "../public" + movie.imgSrc);
      fs.unlink(deleteImagePath, (err) => {
        if (err) {
          return console.log(err);
        }
        Movie.findByIdAndUpdate(movieId, req.body, (err, editedMovie) => {
          if (err) {
            return console.log(err);
          }
          res.redirect('/');
        })
      })
    } else {
      Movie.findByIdAndUpdate(movieId, req.body, (err, editedMovie) => {
        if (err) {
          return console.log(err);
        }
        res.redirect('/');
      })
    }
  })
}

function renderViewMovie(req, res, next) {
  let movieId = req.params.id;
  Movie.findById(movieId).populate("comments").populate("createdBy").exec((err, movie) => {
    if (err) {
      return console.log(err);
    }
    res.render("viewMovie", {
      movie
    });
  })
}


// delete the movie from the database
function deleteFromTheDatabase(req, res) {
  let movieId = req.params.id;
  Movie.findByIdAndDelete(movieId, (err, movie) => {
    if (err) {
      return console.log(err);
    }
    //delete the movie comments into the database 
    Comment.deleteMany({
      movieId: movie.id
    }, (err) => {
      if (err) {
        return console.log(err);
      }
    })
    //delele the public/image/imgName into the folder 
    let deleteImagePath = path.join(__dirname, "../public" + movie.imgSrc);
    fs.unlink(deleteImagePath, (err) => {
      if (err) {
        return console.log(err);
      }
      console.log('movie deleted succesfully');
    })
    res.redirect("/");
  })
  return;
}

// add comments in the movie
function addComment(req, res) {
  let movieId = req.params.id;
  req.body.movieId = movieId;
  req.body.userId = req.userDetail.id;
  req.body.username = req.userDetail.name;
  Comment.create(req.body, (err, createdComment) => {
    if (err) {
      return console.log(err);
    }
    Movie.findByIdAndUpdate(
      movieId, {
        $push: {
          comments: createdComment.id
        }
      },
      (err, movie) => {
        if (err) {
          return console.log(err)
        }
        res.redirect(`/movie/${movieId}`);
      }
    )
  })
}

function deleteComment(req, res) {
  let commentId = req.params.id;
  Comment.findById(commentId, (err, comment) => {
    if (err) {
      return console.log(err)
    }
    // remove comment from the Movie collection
    Movie.updateOne({
      id: comment.movieId
    }, {
      $pull: {
        comments: [commentId]
      }
    }, (err) => {
      if (err) {
        return console.log(err)
      }
      // delete the particular comment
      Comment.findByIdAndRemove(commentId, (err, data) => {
        if (err) {
          return console.log(err)
        }
        res.redirect("/movie/" + comment.movieId);
      })
    })
  })
}

module.exports = {
  viewIndex,
  renderAddForm,
  renderEditForm,
  addIntoTheDatabase,
  renderViewMovie,
  deleteFromTheDatabase,
  addComment,
  editTheMovie,
  deleteComment
}