 var mongoose = require("mongoose");
 var Schema = mongoose.Schema;
 
 var movieSchema = Schema({
   title:{
     type: String
   },
   storyline:{
     type: String
   },
   imgSrc:{
     type:String
   },
   comments :[{
     type: Schema.Types.ObjectId,
     ref: "Comment"
   }] 
 })
 var Movie = mongoose.model("Movie" , movieSchema);
 
 module.exports = Movie;