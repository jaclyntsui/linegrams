
/*
 * GET home page.
 */
var models = require('../models');
Instagram = require('instagram-node-lib');

Instagram.set('client_id', '2342600818a2402694ca489bca54392f');
Instagram.set('client_secret', 'dfe7d95a48494ec6b3c425fb198a2962');

exports.index = function(req, res){
  res.render('index', { title: 'Linegrams' }); //{docs: data} takes the place of swig tags {% for page in docs%}{{page.title}} {% endfor %}
};

exports.user = function(req, res){
  res.render('user', { title: 'Express' });
};

exports.profile = function(req, res){
	// console.log("Inside Profile: ", req.user);
	Instagram.users.recent({
		user_id: req.user.instagram_id,
		access_token: req.user.token,
		complete: function(data) {
			// console.log("Instagram API:", data);
			res.render("profile", {data: data});
		}
	});


  // res.render('profile', { title: 'Express' });
};

exports.about = function(req, res){
  res.render('about', { title: 'Express' });
};

exports.features = function(req, res){
  res.render('features', { title: 'Express' });
};

exports.contact_us = function(req, res){
  res.render('contact_us', { title: 'Express' });
};

exports.submit_form = function(req, res){
	var generateUrlName = function(name) {
  if (typeof name != "undefined" && name !== "") {
    // Removes all non-alphanumeric characteres from name
    // And make spaces underscore
    return name.replace(/[\s]/ig,"_").replace(/[^\w]/ig,"");
  } else {
    // Generates random 5 letter string
    return Math.random().toString(36).substring(2,7);
  }
};

	var models = require('../models');
	var name = req.body.name;
	var email = req.body.email;
	var subject = req.body.subject;
	var body = req.body.message; //message is from the textarea name in contact_us.html
	var url_name = generateUrlName(name);
  var page = new models.Page({
  	'name': name,
  	'email': email,
  	'subject': subject,
  	'body': body,
  	// 'url_name' = url_name
  });
  page.save();

  res.render('/');
};