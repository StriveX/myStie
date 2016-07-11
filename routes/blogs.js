var Post = require('../lib/post.js');

/* Get single post */
exports.post = function(req, res, next) {
    var id = req.params.id;
    Post.getById(id, function(err, post) {
        if (err) return next(err);
        res.render('public/post',
        {
            title: post.post_title,
            date: post.post_date,
            content: post.post
        });
    })
}

/* Get list of posts*/
exports.list = function(req, res, next) {
    var page = req.page; // from page middleware
    var type = req.params.type || 'overview';
    Post.getByRange(page.number, page.perpage, type, function(err, posts){
    	if (err) return next(err);
        res.render('public/blog', {
            posts: posts,
            type: type,
            page: page.number,
            pages: page.count
        });	
    })
};

exports.form = function(req, res, next) {
    var id = req.params.id;
    if (typeof id === 'undefined') { //TODO
        res.render('forms/post', {
            isEdit: false
        });
    } else {
        Post.getById(id, function(err, post) {
            if (err) return next(err);
            res.render('fomrs.public', {
                isEdit: true,
                title: post.post_title,
                content: post.post
            });
        }); 
    }
}

/* Create/ Edit post, depends on if id is defined*/
exports.submit = function(req, res, next) {
    var data = req.body;
    var post = new Post({
        title: data.title,
        content: data.content,
        type: data.type
    });
    post.save(function(err) {
        if (err) return next(err);
    });
    res.redirect('/');
}

exports.delete = function(req, res, next) {
    var id = req.params.id; //TODO: security
    Post.delete(id, function(err) {
        if (err) return next(err);
    });
}
