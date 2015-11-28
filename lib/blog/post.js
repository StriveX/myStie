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

Post.count = function(fn){
  	connection.query("SELECT COUNT(*) AS count FROM blog_post",
  		function(err, result) {
  			if (err) return fn(err);
  			fn(err, result[0].count);
  	});
};