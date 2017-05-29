exports.restrict = function(req, res, next){
    if ( !req.session.uid ) {
        req.session.redirect_to = req.path;
        res.redirect('/login');
    } else {
        next();
    }
};

exports.permission = function (level) {	
    return function(req, res, next) {
    	var user = res.locals.user;
    	if (!user || res.locals.user.type != level) {
			req.session.returnTo = req.path;
			res.redirect('/login');
		} else {
	        next();
	    }
	}
};