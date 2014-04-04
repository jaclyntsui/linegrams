var MONGODB_URI = process.env.MONGOLAB_URI || "mongodb://localhost/linegrams";
var mongoose = require('mongoose');
mongoose.connect(MONGODB_URI);
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

var contactSchema = new Schema({
	name: String,
	email: String,
	subject: String,
	message: String
})

var entrySchema = new Schema({
	tags: [String],
	photo_id: String
})

User = mongoose.model('User', userSchema);
Entry = mongoose.model('Entry', entrySchema);
Contact = mongoose.model('Contact', contactSchema);

exports.User = User;
exports.Entry = Entry;
exports.Contact = Contact;

// var entry = new Entry({
// 	tags: ["Hello Test", "Yo"],
// 	photo_id: "asdfasdf"
// })
// entry.save();