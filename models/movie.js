 var mongoose = require("mongoose");
 var Schema = mongoose.Schema;

 var movieSchema = Schema({
   title: {
     type: String
   },
   storyline: {
     type: String
   },
   imgSrc: {
     type: String
   },
   rating: {
     type: String
   },
   tags: [String],
   directedBy: [String],
   writtenBy: [String],
   runtime: {
     type: String
   },
   releaseDate: {
     type: String
   },
   createdBy: {
     type: Schema.Types.ObjectId,
     ref: "User"
   },
   comments: [{
     type: Schema.Types.ObjectId,
     ref: "Comment"
   }]
 })
 var Movie = mongoose.model("Movie", movieSchema);

 module.exports = Movie;