var Post = require('../lib/post.js');
var path = require('path');
var fs = require('fs');
var join = path.join;

var thumb = require('node-thumbnail').thumb;

// exports.post = function(req, res, next) {
//     var id = req.params.id;
//     Post.getById(id, function(err, post) {
//         if (err) return next(err);
//         res.render('public/post',
//             {
//                 title: post.post_title,
//                 date: post.post_date,
//                 content: post.post
//             });
//     })
// };

exports.pageview = function(req, res, next) {
    Post.getByRange(0, 10, "picture", function(err, gallery){
        if (err) return next(err);
        res.render('life/gallery', {
            gallery: gallery
        });
    })
};

exports.form = function(req, res){
    res.render('photos/upload', {
        title: 'Photo upload'
    });
};

exports.submit = function (dir) {
    return function(req, res, next){
        var img = req.file;
        var data = req.body;
        var path_full = join(dir, "fulls", img.originalname);
        var path_thumb = join(dir, "thumbs");

        data.filename = img.originalname;

        fs.writeFile(path_full, img.buffer, function(err){
            if (err) return next(err);

            thumb({
                source: path_full, // could be a filename: dest/path/image.jpg
                destination: path_thumb,
                concurrency: 1,
                suffix: "",
                width: 500,
                overwrite: true
            }, function(files, err, stdout, stderr) {
                if (err) return next(err);
                var post = new Post({
                    id: data.id,           // None
                    title: data.title,     // title, show on webpage
                    content: data.content, // content, show on webpage
                    description: data.filename,     // name, filename in file system
                    type: "picture"
                });
                post.save(function(err) {
                    if (err) return next(err);
                });
                res.redirect('/life');
            });
        });
    };
};

exports.download = function(dir){
    return function(req, res, next){
        var id = req.params.id;
        Post.findById(id, function(err, photo){
            if (err) return next(err);
            var path = join(dir, photo.path);
            res.download(path, photo.name+'.jpeg');
        });
    };
};
