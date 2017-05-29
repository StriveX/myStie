var Post = require('../lib/post.js');

exports.blogList = function(req, res, next) {
    var page = req.page;
    Post.getList("blog", function (err, posts) {
        if (err) return next(err);
        res.render('admin/index', {
            posts: posts
        });
    });
};