//MODULE DEPENDENCIES
var express = require('express');
var swig = require('swig');
var filters = require('./filters')(swig);
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var app = express();
var nodemailer = require('nodemailer');
var request = require('request');
var cheerio = require('cheerio');


//INSTAGRAM DEPENDENCIES
var passport = require('passport');
var InstagramStrategy = require('passport-instagram').Strategy;
var INSTAGRAM_CLIENT_ID = "2342600818a2402694ca489bca54392f";
var INSTAGRAM_CLIENT_SECRET = "dfe7d95a48494ec6b3c425fb198a2962";
var User = require('./models/index.js').User;


//ENVIRONMENTS
app.engine('html', swig.renderFile);
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
swig.setDefaults({ cache: false});
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.session({ secret: 'keyboard cat' }));

//INSTAGRAM API ENVIRONMENTS
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
//what is an express.sesion? secret? keyboard cat?

// DEVELOPMENT ONLY
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//INSTGRAM API
passport.serializeUser(function(user, done) {
  done(null, user._id.toString());
});
passport.deserializeUser(function(_id, done) {
	User.findOne({_id: _id}, function(err, userDoc) {
	  done(null, userDoc);
	});
});

var callbackURL = process.env.INSTAGRAMURL||"http://192.168.1.78:3000/auth/instagram/callback";

//Use the InstagramStrategy within Passport.
passport.use(new InstagramStrategy({
    clientID: INSTAGRAM_CLIENT_ID,
    clientSecret: INSTAGRAM_CLIENT_SECRET,
    callbackURL: callbackURL
  },
  function(accessToken, refreshToken, profile, done) {
  	console.log("What instagram auth sent me: ", profile);
    process.nextTick(function () {
    	User.findOne({ instagram_id: profile.id }, function(err, userDoc){
    		if(err)
    			return done(err);
    		if(userDoc){
    			return done(null, userDoc);
    		} else {
    			var newUser = new User();
    			newUser.instagram_id = profile._json.data.id;
    			newUser.username = profile._json.data.username;
    			newUser.full_name = profile._json.data.full_name;
    			newUser.profile_picture = profile._json.data.profile_picture;
    			newUser.bio = profile._json.data.bio;
    			newUser.website = profile._json.data.website;
    			newUser.token = accessToken;
    			newUser.save(function(err){
    				if(err)
    					throw err;
    				return done(err, newUser);
    			})
    		}
    	})
    });
  }
));

app.get('/auth/instagram',
  passport.authenticate('instagram'),
  function(req, res, profile){
    // The request will be redirected to Instagram for authentication, so this
    // function will not be called.
  });
app.get('/auth/instagram/callback',
  passport.authenticate('instagram', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/profile');
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

function ensureAuthenticated(req, res, next) {
	// console.log("inside authentication: ", req)
  if (req.isAuthenticated()) {
  	return next();
  } else {
	  res.redirect('/');
	}
}


//ROUTES
app.get('/', routes.index);
app.get('/users/:username', routes.user);
app.get('/profile', ensureAuthenticated, routes.profile);
app.get('/about', routes.about);
app.get('/features', routes.features);
app.get('/contact_us', routes.contact_us);
app.post('/contact_us', routes.submit_form);


//LAUNCH
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
