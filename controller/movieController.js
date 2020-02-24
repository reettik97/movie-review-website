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
  console.log(req.userDetail);
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
  // let tags = req.body.tags;
  req.body.tags = req.body.tags.split(",");
  req.body.directedBy = req.body.directedBy.split(",");
  req.body.writtenBy = req.body.writtenBy.split(",")
  let movieObj = req.body;
  let imgPath = "/images/uploads/" + req.file.originalname;
  movieObj.imgSrc = imgPath;
  Movie.create(movieObj, (err, data) => {
    if (err) {
      return console.log(err)
    }
    console.log(data);
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
        console.log('old movie poster deleted');
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

// render detail view page  
function renderViewMovie(req, res, next) {
  let movieId = req.params.id;
  Movie.findById(movieId).populate("comments").exec((err, movie) => {
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
      console.log("commnet deleted successfully");
    })
    //delele the public/image/imgName into the folder 
    let deleteImagePath = path.join(__dirname, "../public" + movie.imgSrc);
    fs.unlink(deleteImagePath, (err) => {
      if (err) {
        return console.log(err);
      }
      console.log('movie deleted succesfully');
    })
    // console.log(movie);
    res.redirect("/");
  })
  return;
}

// add comments in the movie
function addComment(req, res) {
  let movieId = req.params.id;
  //  let commentObj = req.body;
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

function deleteComment(req , res){
  let commentId = req.params.id;
  Comment.findById(commentId , (err , comment)=>{
    if(err){return console.log(err)} 
    console.log(comment);

    Movie.updateOne({id:comment.movieId} , {$pull: {comments :[commentId]}} , (err)=>{
      if(err){ return console.log(err)}
      console.log( "movie model se delete kar diya")
      Comment.findByIdAndRemove(commentId , (err , data)=>{
        if(err){return console.log(err)}
        console.log(data);
        console.log("commnet se v delete kar diya")
        res.redirect("/movie/"+comment.movieId);
      })
    })
    
    // Movie.find
    // Movie.findById(comment.movieId , (err , movie)=>{
    //   if(err){console.log(err)}
    //   console.log("movie detail" , movie);
    // })
    //  delete from the movie schema
    //  delete from the comment schema
  })
}

// {
//   _id: 5e53f97c4f8e3c565ad2644e,
//   comment: ';wsjbcwbjcbhwyugucwvcjhwvcywvcvwygcvwhvc',
//   movieId: 5e535c007d8b59200cbe072f,
//   userId: 5e52586d8ea82659655134d5,
//   username: 'jay',
//   __v: 0
// }


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