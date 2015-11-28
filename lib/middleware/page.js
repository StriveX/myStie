module.exports = function(fn) {
	//perpage = perpage || 15;
	return function(req, res, next) {
		var page = Math.max(parseInt(req.params.page || '1', 10), 1) - 1; // which page request
		var perpage = Math.max(parseInt(req.params.perpage || '5', 10), 1);
		fn(function(err, total){
			if (err) return next(err);
			req.page = res.locals.page = {
				number: page,
				perpage: perpage,
				//from: page * perpage,
				//to: page * perpage + perpage -1,
				total: total,
				count: Math.ceil(total / perpage)
			};
			console.log("page defined: ", req.page);
			next();
		});
	}
};