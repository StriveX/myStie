var Blog = require('../lib/blog/post.js');

exports.list = function(req, res, next) {
    var page = req.page;
    var type = req.params.type || 'overview';
    var overview = req.params.perpage==null?false:true;
    Blog.getRange(page.number, page.perpage, type, function(err, posts){
    	if (err) return next(err);
    	res.render('public/posts', {
    		posts: posts,
    		page: page.number,
            reqpage: !overview,
    		pages: page.count
    	});
    	//res.end(JSON.stringify(posts));
    })
};

exports.submit = function(req, res, next) {
    var data = req.body;
    Blog.save(data, function(err) {
        if (err) return next(err);
    });
    res.redirect('/blog/' + data.category);
}

