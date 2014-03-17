var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/linegrams');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));


var Schema = mongoose.Schema;

var userSchema = new Schema({
  instagram_id: String,
  username: String,
  full_name: String,
  profile_picture: String,
  bio: String,
  website: String,
  token: String,
  counts: {
    media: Number,
    follows: Number,
    followed_by: Number
  }
});

var entrySchema = new Schema({
	tags: [String],
	photo_id: String
})

User = mongoose.model('User', userSchema);
Entry = mongoose.model('Entry', entrySchema);
// module.exports = {"User": User};
exports.User = User;
exports.Entry = Entry;

var entry = new Entry({
	tags: ["Hello Test", "Yo"],
	photo_id: "asdfasdf"
})
entry.save();