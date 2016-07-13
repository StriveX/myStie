module.exports = function(perpage, fn) {
	perpage = perpage || 5;
	return function(req, res, next) {
		var page = Math.max(parseInt(req.params.page || '1', 10), 1) - 1; // page start from 0
		fn(function(err, total){
			if (err) return next(err);
			req.page = res.locals.page = {
				number: page,
				perpage: perpage,
				total: total,
				count: Math.ceil(total / perpage)
			};
			next();
		});
	}
};