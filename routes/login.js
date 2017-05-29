var User = require('../lib/user');

exports.form = function(req, res) {
	res.render('login');
};

exports.submit = function(req, res, next) {
	var data = req.body.user;
	User.authenticate(data.name, data.pass, function(err, user) {
		if (err) return next(err);
		if (user) {
			req.session.uid = user.user_id;
			res.locals.user = user;
			res.redirect(req.session.returnTo || '/');
			req.session.returnTo = '/';
		} else {
			res.error("Invalid username or password.");
			res.redirect("back");
		}
	});
};

exports.logout = function(req, res) {
	req.session.destroy(function(err){
		if (err) throw err;
		res.redirect('/home');
	})
};