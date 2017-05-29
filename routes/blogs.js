var Post = require('../lib/post.js');

/* Get single post */
exports.post = function(req, res, next) {
    var id = req.params.id;
    Post.getById(id, function(err, post) {
        if (err) return next(err);
        res.render('work/blog',
        {
            id: post.post_id,
            title: post.post_title,
            date: post.post_date,
            content: post.post
        });
    })
};

/* Get a page of posts, give page number */
exports.pageview = function(req, res, next) {
    var page = req.page;
    Post.getByRange(page.number, page.perpage, "blog", function(err, posts){
        if (err) return next(err);
        res.render('work/blogs', {
            posts: posts,
            page: page.number+1,
            pages: page.count
        });
    })
};

exports.form = function(req, res, next) {
    var post_id = req.params.id;
    if (typeof post_id === 'undefined') {
        res.render('admin/upload/blog', {
            id: -1
        });
    } else {
        Post.getById(post_id, function(err, post) {
            if (err) return next(err);
            res.render('admin/upload/blog', {
                id: post_id,
                title: post.post_title,
                content: post.post
            });
        }); 
    }
};

/* Create/ Edit post, depends on if id is defined*/
exports.submit = function(req, res, next) {
    var data = req.body;
    var post = new Post({
        id: data.id,
        title: data.title,
        content: data.content,
        description: "",
        type: "blog"
    });
    post.save(function(err) {
        if (err) return next(err);
    });
    res.redirect('/work');
};

exports.delete = function(req, res, next) {
    var id = req.params.id; //TODO: security
    Post.delete(id, function(err) {
        if (err) return next(err);
    });
};
