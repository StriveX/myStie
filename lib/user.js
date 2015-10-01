var mysql = require('mysql');
var bcrypt = require('bcrypt');
var Connection = require('./connDB');
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
        //if (err) return fn(err);
        //user.id = id; //id from todo
        user.hashPassword(function(err) {
            if (err) return fn(err);
            user.update(fn);
        });
    }
};

User.prototype.update = function(fn) {
    var user = this;
    Connection.connect(function(connection) {
        connection.query("INSERT INTO users (name, email, salt, pass) " +
            "VALUES (?,?,?,?)",
            [user.name, user.email, user.salt, user.pass],
            function(err,result) {
                if (err) return fn(err);
                user.id = result.insertId;
                fn(err)
        });
    });
}

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

User.getByName = function(name, fn) {
    Connection.connect(function(connection) {
        connection.query("SELECT * FROM users WHERE name=?", [name], function(err, rows){
            if (err) return fn(err);
            //if (rows.length > 1) console.log("ERROR: user duplicate name");
            var user = new User(rows[0]);
            if (rows.length > 0) return fn(null, user);
            fn(null, null);
        });
    });
};

User.getById = function(id, fn) {
    Connection.connect(function(connection) {
        connection.query("SELECT * FROM users WHERE id=?", [id], function(err, rows) {
            if (err) return fn(err);
            var user = new User(rows[0]);
            if (rows.length > 0) return fn(null, user);
            return fn(null, null);      // necessary???
        });
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




