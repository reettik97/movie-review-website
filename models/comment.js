var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var commentSchema = Schema({
  userId:{
    type : Schema.Types.ObjectId,
    ref : "User"
  },
  comment: {
    type: String
  },
  movieId: {
    type: Schema.Types.ObjectId,
    ref: "Movie",
    require: true
  }
})

var Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;