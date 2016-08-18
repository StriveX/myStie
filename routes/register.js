var User = require('../lib/user');
var connection = require('../lib/connDB');

exports.form = function(req, res) {
	res.render('register', {title: 'Sign up'});
};

exports.submit = function(req, res, next) {
	var data = req.body.user;
	console.log("register submit: ", data);
	User.getByName(data.name, function(err, user){
		if (err) return next(err);
		if (user) {
			// res.err("Username already exists.");
			// res.redirect('back');
			res.json({status: 'failed', message: "Username already exists."});
		} else {
			user = new User({
				name: data.name,
				email: data.email,
				pass: data.pass
			});
			if (data.type == "employer") {
				user.type = connection.user_type["employer"];
			} else if (data.type == "friend") {
				user.type = connection.user_type["friend_unapproved"];
			}
			user.save(function(err) {
				if (err) return next(err);
				req.session.uid = user.user_id;
				if (data.type == "employer") {
					User.saveOrginization(data.orgname, data.website, user.id, function (err) {
						if (err) return next(err);
						res.json({status: 'success', message: ""});
					});
				} else {
					res.json({status: 'success', message: ""});
				}
			});
		}
	});
};