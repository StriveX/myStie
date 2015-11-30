var Post = require('../lib/blog/post.js');

exports.list = function(req, res, next) {
    var page = req.page;
    var type = req.params.type || 'overview';
    var fullpage = req.params.fullpage;  // if params.fullpage not defined (fullpage null) => fullpage
    Post.getByRange(page.number, page.perpage, type, function(err, posts){
    	if (err) return next(err);
        if (!fullpage) {
            res.render('public/fullpage', {
                posts: posts,
                type: type,
                page: page.number,
                pages: page.count
            });
        } else {
            res.render('public/section', {
                posts: posts
            });
        }
    	
    })
};

exports.submit = function(req, res, next) {
    var data = req.body;
    Post.save(data, function(err) {
        if (err) return next(err);
    });
    res.redirect('/blog/' + data.category);
}

exports.post = function(req, res, next) {
    var id = req.params.id;
    Post.getById(id, function(err, post) {
        if (err) return next(err);
        res.render('public/post',
        {
            title: post.post_title,
            date: post.post_date,
            content: post.post,
            //type: post.type
        });
    })
}