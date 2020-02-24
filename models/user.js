var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    require: true
  },
  password: {
    type: String,
    require: true
  }
})


var User = mongoose.model("User", userSchema);
module.exports = User;