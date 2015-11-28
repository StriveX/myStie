var User = require('../lib/user');

exports.form = function(req, res) {
	res.render('register', {title: 'Sign up'});
};

exports.submit = function(req, res, next) {
	var data = req.body.user;
	console.log("register submit: ", data);
	User.getByName(data.name, function(err, user){
		if (err) return next(err);
		if (user) {
			res.error("Username already exists.");
			res.redirect('back');
		} else {
			user = new User({
				name: data.name,
				email: data.email,
				pass: data.pass
			});
			user.save(function(err) {
				console.log("error");
				if (err) return next(err);
				req.session.uid = user.id;
				res.redirect('/dataloop/');
			});
		}
	});
};