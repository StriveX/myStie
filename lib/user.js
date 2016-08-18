var bcrypt = require('bcrypt');
var connection = require('./connDB');

module.exports = User;

function User(obj) {
    for (var key in obj) {
        this[key] = obj[key];
    }
}

User.prototype.save = function(fn) {
    if (this.id) {
        this.update(fn);
    } else {
        var user = this;
        user.hashPassword(function(err) {
            if (err) return fn(err);
            user.update(fn);
        });
    }
};

User.prototype.update = function(fn) {
    var user = this;
    connection.query("INSERT INTO users (name, email, salt, pass, type) " +
        "VALUES (?,?,?,?,?)",
        [user.name, user.email, user.salt, user.pass, user.type],
        function(err,result) {
            if (err) return fn(err);
            user.id = result.insertId;
            fn(err)
    });
};

User.prototype.hashPassword = function(fn) {
    var user = this;
    bcrypt.genSalt(12, function(err, salt){
        if (err) return fn(err);
        user.salt = salt;
        bcrypt.hash(user.pass, salt, function(err, hash) {
            if (err) return fn(err);
            user.pass = hash;
            fn();
        });
    });
};

/*
var tobi = new User({
  name: 'Tobi',
  pass: 'im a ferret'
});

tobi.save(function(err){
  if (err) throw err;
  console.log('user id %d', tobi.id);
});
*/

User.saveOrginization = function(name, website, user_id, fn) {
    connection.query("INSERT INTO organizations (name, website, user_id) " +
        "VALUES (?,?,?)",
        [name, website, user_id],
        function(err,result) {
            if (err) return fn(err);
            fn(err)
        });
};

User.getByName = function(name, fn) {
    connection.query("SELECT user_id, name, salt, pass, type FROM users " +
        "WHERE name=?", 
        [name], 
        function(err, rows){
            if (err) return fn(err);
            //if (rows.length > 1) console.log("ERROR: user duplicate name");
            var user = new User(rows[0]);
            if (rows.length > 0) return fn(null, user);
            fn(null, null);
        });
};

User.getById = function(id, fn) {
    connection.query("SELECT user_id, name, type FROM users " +
        "WHERE user_id=?", 
        [id], 
        function(err, rows) {
            if (err) return fn(err);
            var user = new User(rows[0]);
            if (rows.length > 0) return fn(null, user);
            return fn(null, null);      // necessary???
        });
};

User.authenticate = function(name, pass, fn) {
    User.getByName(name, function(err, user){
        if (err) return fn(err);
        if (!user) return fn();
        bcrypt.hash(pass, user.salt, function(err, hash){
            if (err) return fn(err);
            if (hash == user.pass) {
                return fn(null, user);
            }
            fn();
        });
    });
};
