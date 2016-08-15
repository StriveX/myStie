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
};



exports.preview = function(req, res, next) {
    Post.getByRange(0, 3, "blog", function(err, posts){
        if (err) return next(err);
        res.render('home', {
            posts: posts,
        });
    })
};

exports.pageview = function(req, res, next) {
    var page = req.page;
    Post.getByRange(page.number, page.perpage, "blog", function(err, posts){
        if (err) return next(err);
        res.render('public/blog', {
            posts: posts,
            page: page.number,
            pages: page.count
        });
    })
};

/* Get list of posts*/
exports.list = function(req, res, next) {
    var page = req.page; // from page middleware
    // var type = req.params.type || 'overview';
    Post.getByRange(page.number, page.perpage, "blog", function(err, posts){
    	if (err) return next(err);
        res.render('public/blog', {
            posts: posts,
            page: page.number,
            pages: page.count
        });	
    })
};

exports.form = function(req, res, next) {
    var psot_id = req.params.id;
    if (typeof psot_id === 'undefined') { //TODO
        res.render('forms/post', {
            isEdit: false
        });
    } else {
        Post.getById(psot_id, function(err, post) {
            if (err) return next(err);
            res.render('forms/post', {
                isEdit: true,
                id: psot_id,
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
        id: data.id,
        title: data.title,
        content: data.content,
        type: "blog"
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
