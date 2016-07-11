var connection = require('../connDB');
module.exports = Post;

function Post(obj) {
	for (var key in obj){
		this[key] = obj[key];
	}
}

Post.getById = function(id, fn) {
    connection.query("SELECT * FROM posts WHERE post_id = ?",
        [id],
        function(err, rows) {
            if (err) return fn(err);
            return fn(null, rows[0]);
        });
}

Post.getByRange = function(page, perpage, type, fn) {
	console.log(page, perpage, type);
    connection.query(
    	"SELECT post_id, post_title, DATE_FORMAT(post_date, '%d %b %y') " +
    	"FROM posts" + 
    	"WHERE post_type = ? LIMIT ?, ?;", 
    	[post_type[type], page, perpage], 
    	function(err, rows){
    		console.log("post page result", err, rows, type);
        	if (err) return fn(err);
        	return fn(null, rows);
    });
};

Post.count = function(fn){
  	connection.query("SELECT COUNT(*) AS count FROM posts ",
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
        var type_id = result[0].blog_type_id;
        connection.query("INSERT INTO posts VALUES (DEFAULT, ?, ?, CURDATE(), ?)",
            [post.title, post.content, post_type[post.type]],
            function(err){
                if (err) return fn(err);
        });
    }
}

Post.prototype.update = function(fn) {
    var post = this;
    connection.query("UPDATE posts SET post_title=?, post=? " +
        "WHERE post_id = ?",
        [post.title, post.content, post_type[post.type], post.id],
        function(err){
            if (err) return fn(err);
    });
}

Post.delete = function(id, fn) {
    connection.query("DELETE FROM posts WHERE post_id = ?",
        [id],
        function(err){
            if (err) return fn(err);
    });
}