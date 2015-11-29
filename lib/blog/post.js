var connection = require('../connDB');
module.exports = Post;

function Post(obj) {
	for (var key in obj){
		this[key] = obj[key];
	}
}

Post.getRange = function(page, perpage, type, fn) {
	console.log(page, perpage, type);
    connection.query(
    	"SELECT post_id, post_title, post_desc, DATE_FORMAT(post_date, '%d %b %y') " +
    	"FROM blog_post p, blog_type b " + 
    	"WHERE p.post_type = b.blog_type_id" +
    	" AND b.blog_type_name = ? LIMIT ?, ?;", 
    	[type, page, perpage], 
    	function(err, rows){
    		console.log("post page result", err, rows, type);
        	if (err) return fn(err);
        	return fn(null, rows);
    });
};

Post.count = function(type, fn){
    var sql = "SELECT COUNT(*) AS count FROM blog_post ";
    //if (type) sql += "WHERE type = ?";
  	connection.query(sql,
  		function(err, result) {
  			if (err) return fn(err);
  			fn(err, result[0].count);
  	});
};

Post.save = function(data, fn) {
    connection.query("SELECT blog_type_id FROM blog_type where blog_type_name = ?",
        [data.category],
        function (err, result) {
            if (err) return fn(err);
            var type_id = result[0].blog_type_id;
            var sql = "INSERT INTO blog_post VALUES (DEFAULT, ?, ?, ?, CURDATE(), ?)";
            connection.query(sql,
                [data.title, data.description, data.content, type_id],
                function(err){
                    if (err) return fn(err);
            });
        });
}