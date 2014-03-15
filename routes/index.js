
/*
 * GET home page.
 */
var models = require('../models');

exports.index = function(req, res){
  res.render('index', { title: 'Express' }); //{docs: data} takes the place of swig tags {% for page in docs%}{{page.title}} {% endfor %}
};

exports.user = function(req, res){
  res.render('user', { title: 'Express' });
};

exports.profile = function(req, res){
  res.render('profile', { title: 'Express' });
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