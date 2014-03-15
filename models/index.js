var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/linegrams');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));


var Schema = mongoose.Schema;

var userSchema = new Schema({
  id: String,
  username: String,
  full_name: String,
  profile_picture: String,
  bio: String,
  website: String,
  counts: {
    media: Number,
    follows: Number,
    followed_by: Number
  }
});

User = mongoose.model('User', userSchema);

module.exports = {"User": User};
