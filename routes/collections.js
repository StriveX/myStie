var Collection = require('../lib/collection');
var Entry = require('../lib/entry');
var Data = require('../lib/data');

exports.form = function(req, res, next) {
    var page = req.page;
    console.log("##page: ", page);
    console.log("#collection: ", req.params.name);
    var table = req.params.name + '_data';
    Entry.describe(table, function(err, columnInfo) {
        Collection.getByName(table, function(err, collection) {
            if (err) return next(err);
            res.render('data', {                 // entries.ejs: display entry list on home page
                title: req.params.name,
                table: table,
                columnInfos: columnInfo,
                collections: collection
            });
        });
    });
};

exports.submit = function(req, res, next) {
    var data = req.body;
    var uid = 1;
    if (res.locals.user) {
        uid = res.locals.user.uid;
    }
    Data.save(uid, data, req.params.name, function(err) {
        if (err) return next(err);
    });
};

exports.remove = function(req, res, next) {
    var name = req.params.name;
    console.log("name", name);
    Entry.remove(name, function(err) {
        if (err) next(err);
        res.redirect('/');
    });     // About how to organize functions of entry and collection, need to be considered
}
