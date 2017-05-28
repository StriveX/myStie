var connection = require('./connDB');
module.exports = Post;

function Post(obj) {
	for (var key in obj){
		this[key] = obj[key];
	}
}

Post.getById = function(id, fn) {
    connection.query("SELECT post_id, post_title, post, DATE_FORMAT(post_date, '%d %b') AS post_date " +
        "FROM posts " +
        "WHERE post_id = ?",
        [id],
        function(err, rows) {
            if (err) return fn(err);
            return fn(null, rows[0]);
        });
};

Post.getByRange = function(start, perpage, type, fn) {
    console.log(start, perpage, type);
    connection.query(
        "SELECT post_id, post_title, post_desp, post, DATE_FORMAT(post_date, '%D %b, %Y') AS post_date " +
        "FROM posts " +
        "WHERE posts.post_type =? " +
        "ORDER BY post_date DESC " +
            "LIMIT ?, ? ;",
        [connection.post_type[type], start, perpage],
        function(err, rows){
            if (err) return fn(err);
            return fn(null, rows);
        });
};

Post.getAll = function(type, fn) {
    connection.query(
        "SELECT post_id, post_title, post, DATE_FORMAT(post_date, '%D %b, %Y') AS post_date " +
        "FROM posts " +
        "WHERE posts.post_type =? " +
        "ORDER BY post_date DESC ",
        [connection.post_type[type]],
        function(err, rows){
            if (err) return fn(err);
            return fn(null, rows);
        });
};

Post.count = function(fn, type){
  	connection.query("SELECT COUNT(*) AS count FROM posts " +
        "WHERE posts.post_type =? ",
        [connection.post_type[type]],
  		function(err, result) {
  			if (err) return fn(err);
  			fn(err, result[0].count);
  	});
};

Post.prototype.save = function(fn) {
    if (this.id) {
        this.update(fn);
    } else {
        var post = this;
        connection.query("INSERT INTO posts VALUES (DEFAULT, ?, ?, CURDATE(), ?, ?)",
            [this.title, this.content, connection.post_type[this.type], this.description],
            function(err){
                if (err) return fn(err);
        });
    }
};

Post.prototype.update = function(fn) {
    var post = this;
    connection.query("UPDATE posts SET post_title=?, post=? " +
        "WHERE post_id = ?",
        [post.title, post.content, post.id],
        function(err){
            if (err) return fn(err);
    });
};

Post.delete = function(id, fn) {
    connection.query("DELETE FROM posts WHERE post_id = ?",
        [id],
        function(err){
            if (err) return fn(err);
    });
};