
/*
 * GET home page.
 */
var models = require('../models');
Instagram = require('instagram-node-lib');
var request = require('request');
var nodemailer = require('nodemailer');

Instagram.set('client_id', '2342600818a2402694ca489bca54392f');
Instagram.set('client_secret', 'dfe7d95a48494ec6b3c425fb198a2962');

exports.index = function(req, res){
	console.log(req.user);
  res.render('index', { title: 'Linegrams' }); //{docs: data} takes the place of swig tags {% for page in docs%}{{page.title}} {% endfor %}
};

exports.user = function(req, res){
  res.render('user', { title: 'Express' });
};



exports.profile = function(req, res){
// var requrl = 'https://instagram.com/api/v1/direct_share/inbox?access_token='+req.user.token;
// 	console.log(requrl);
// request(requrl, function (error, response, body) {
//   if (!error && response.statusCode == 200) {
//     console.log(body) // Print the google web page.
//   }
//   console.log(body);
//   res.render("profile", {directShares: JSON.parse(body)});
	Instagram.users.recent({
		user_id: req.user.instagram_id,
		access_token: req.user.token,
		complete: function(data) {
			console.log(data[0]);
			res.render("profile", {data: data});
		}
	});
}

exports.about = function(req, res){
  res.render('about', { title: 'Express' });
};

exports.features = function(req, res){
  res.render('features', { title: 'Express' });
};

exports.contact_us = function(req, res){
  res.render('contact_us');
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


