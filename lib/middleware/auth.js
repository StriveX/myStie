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
    	console.log(res.locals.user);
		if ( res.locals.user.group == level ) {
	        next();
	    } else {
	        res.render('invalid', {
		    	title: 'No Access',
		    	message: 'Sorry, you do not have access to this page.'
		  	});
	    }
	}
}