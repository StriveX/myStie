var User = require('../lib/user');

exports.form = function(req, res) {
	res.render('login', {title:'Login'});
};

exports.submit = function(req, res, next) {
	var data = req.body.user;
	User.authenticate(data.name, data.pass, function(err, user) {
		if (err) return next(err);
		if (user) {
			req.session.uid = user.id;
			req.session.group = user.group_name;
			var redirect_to = req.session.redirect_to ? req.session.redirect_to : '/';
			delete req.session.redirect_to;
			res.redirect(redirect_to);
		} else {
			res.error("Invalid user or password.");
			res.redirect('back');
		}
	});
};

exports.logout = function(req, res) {
	req.session.destroy(function(err){
		if (err) throw err;
/*		var redirect_to = req.session.redirect_to ? req.session.redirect_to : '/';
		delete req.session.redirect_to;
		res.redirect(redirect_to);*/
	})
};