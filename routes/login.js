var User = require('../lib/user');

exports.form = function(req, res) {
	res.render('login', {title:'Login'});
};

exports.submit = function(req, res, next) {
	var data = req.body.user;
	User.authenticate(data.name, data.pass, function(err, user) {
		if (err) return next(err);
		if (user) {
			req.session.uid = user.user_id;
			res.locals.user = user;
			// req.session.utype = user.type;
			res.status(200).render('menu');
		} else {
			res.error("Invalid user or password.");
			res.status(500).json({result: 'failed'});
		}
	});
};

exports.logout = function(req, res) {
	req.session.destroy(function(err){
		if (err) throw err;
		res.redirect('/home');
	})
};