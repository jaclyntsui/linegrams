//MODULE DEPENDENCIES
var express = require('express');
var swig = require('swig');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var app = express();


//INSTAGRAM DEPENDENCIES
var passport = require('passport');
var InstagramStrategy = require('passport-instagram').Strategy;
// var INSTAGRAM_CLIENT_ID = "2342600818a2402694ca489bca54392f";
// var INSTAGRAM_CLIENT_SECRET = "dfe7d95a48494ec6b3c425fb198a2962";
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
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

//Use the InstagramStrategy within Passport.
passport.use(new InstagramStrategy({
    clientID: INSTAGRAM_CLIENT_ID,
    clientSecret: INSTAGRAM_CLIENT_SECRET,
    callbackURL: "http://192.168.1.78:3000/auth/instagram/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
    	User.findOne({ instagramId: profile.id }, function(err, user){
    		if(err)
    			return done(err);
    		if(user){
    			return done(null, user);
    		} else {
    			var newUser = new User();
    			newUser.id = profile._json.data.id;
    			newUser.username = profile._json.data.username;
    			newUser.full_name = profile._json.data.username;
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

   // To keep the example simple, the user's Instagram profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Instagram account with a user record in your database,
      // and return that user instead.
app.get('/auth/instagram',
  passport.authenticate('instagram'),
  function(req, res, profile){
    // The request will be redirected to Instagram for authentication, so this
    // function will not be called.
  });
app.get('/auth/instagram/callback',
  passport.authenticate('instagram', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/#/profile');
  });
app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/')
}



//ROUTES
app.get('/', routes.index);
app.get('/users/:username', routes.user);
app.get('/profile', routes.profile);
app.get('/about', routes.about);
// app.get('/features', routes.features);
// app.get('/contact_us', routes.contact_us);
// app.post('/submit', routes.submit_form);


//LAUNCH
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
