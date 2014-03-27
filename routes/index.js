
/*
 * GET home page.
 */
var models = require('../models');
Instagram = require('instagram-node-lib');
var nodemailer = require('nodemailer');
var request = require('request');
var cheerio = require('cheerio');
var j = request.jar();
request = request.defaults({jar: j});


Instagram.set('client_id', '2342600818a2402694ca489bca54392f');
Instagram.set('client_secret', 'dfe7d95a48494ec6b3c425fb198a2962');

exports.index = function(req, res){
	console.log(req.user);
  res.render('index', { title: 'Linegrams' });
};

exports.user = function(req, res){
  res.render('user', { title: 'Express' });
};

exports.profile = function(req, res){
request.get("https://instagram.com/accounts/login/", function(err, response, body) {
  $ = cheerio.load(body);
  var csrf = $("input[name='csrfmiddlewaretoken']").val();
  // console.log(csrf);
  // console.log(j);

  request.post("https://instagram.com/accounts/login/", {
    jar: j,
    headers: {
        'Referer': 'https://instagram.com/accounts/login/',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/33.0.1750.152 Safari/537.36'
    },
    form: {
      csrfmiddlewaretoken: csrf,
      username: "linegrams",
      password: "" }
	}, function(err, response, body) {

	  request.get("https://instagram.com/api/v1/direct_share/inbox/", function(err, response, body) {
        data = JSON.parse(body);
        console.log(req.user.username, "USER");
        console.log("PRE:", data.shares);

        data.shares = data.shares.filter(function(share) {
        	return share.user.username === req.user.username;
        });
        console.log("POST", data.shares);
        	res.render("profile", {data: data});
      });
	});
});
};

exports.about = function(req, res){
  res.render('about', { title: 'Express' });
};

exports.features = function(req, res){
  res.render('features', { title: 'Express' });
};

exports.contact_us = function(req, res){
  res.render('contact_us');
};

exports.logout = function(req, res){
	req.logout();
  res.render('/');
};

exports.submit_form = function(req, res){
	var models = require('../models');
	var name = req.body.name;
	var email = req.body.email;
	var subject = req.body.subject;
	var message = req.body.message;
  var contact = new models.Contact({
  	'name': name,
  	'email': email,
  	'subject': subject,
  	'message': message
  });
  contact.save();
  res.redirect('/');

	var smtpTransport = nodemailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {
        user: "linegrams@gmail.com",
        pass: ""
    }
});
// CONSTRUCT EMAIL SENDING MODULE
  var mailOptions = {
    'from': "Linegrams <linegrams@gmail.com>", // sender address
    'to': "linegrams@gmail.com", // list of receivers
    'subject': subject, // Subject line
    'text': message + email // plaintext body
  };

//SEND EMAIL(SENT SUCCESSFULLY OR FAILED)
  smtpTransport.sendMail(mailOptions, function(error, response){
    if(error){
        console.log("Failed attempt, please try again!", error);
    } else{
        console.log("Email sent successfully!");
   	}
  });
};


