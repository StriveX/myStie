var Entry = require('../lib/entry');

exports.list = function(req, res, next) {
    console.log("here");
    //userid = res.locals.user.id==null?res.locals.user.id:1;
    var userid = 1;
    if (res.locals.user!=null) userid = res.locals.user.id;
    Entry.getRange(1, 0, function(err, entries) {
        if (err) return next(err);
        res.render('dlindex', {                 // entries.ejs: display entry list on home page
            title: 'Entries',
            entries: entries
        });
    });
};

exports.form = function(req, res) {
    res.render('post', { title: 'Post' });     // new_entry.ejs: create new entry
};

exports.submit = function(req, res, next) {
    var data = req.body.entry;
    console.log("start", data);
/*    if (!res.locals.user) {
        res.error("You are log out.");
    }
    console.log("session user", res.locals.user);*/
    var owner = 1;
    if (data.private=='1') {
        owner = res.locals.user.id;
    }
    Entry.getByName(data.name+'_data', function(err, entry){
        if (entry) {
            res.error("Collection named " +data.name + " already exists!");
            res.redirect('back');
        } else { // entry is null
            var newEntry = new Entry({
                "name": data.name,
                "private": data.private,
                "userid": owner,
                "table": data.name + "_data",
                "description": data.description
            });
            newEntry.create(data, function(err) {
                if (err) return next(err);
                newEntry.save(function(err) {
                    if (err) return next(err);
                    res.redirect('/dataloop/'+data.name);
                });
            });
        }
    });
};
