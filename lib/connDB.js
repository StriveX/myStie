var mysql = require('mysql');

var host = 'localhost';
var user = 'root';
var password = 'zx0228033018';
var databse = 'mysite';
var port = 3306;

var connection = mysql.createConnection({
	    host: host,
	    user: user,
	    password: password,
	    port: port
	});

connection.query('USE mysite');

connection.query("CREATE TABLE IF NOT EXISTS users (" +
  "user_id int NOT NULL AUTO_INCREMENT," +
  "name varchar(255) NOT NULL," +
  "salt varchar(255) DEFAULT NULL," +
  "pass varchar(255) DEFAULT NULL," +
  "email char(255) DEFAULT NULL," +
  "group_id int," +
  "PRIMARY KEY (user_id)," +
  "FOREIGN KEY (group_id) REFERENCES user_groups(group_id));", function(err, result) {
	if (err) return err;
});

connection.query("CREATE TABLE IF NOT EXISTS user_groups (" +
  "group_id int NOT NULL AUTO_INCREMENT," +
  "group_name varchar(255) NOT NULL," +
  "PRIMARY KEY (`group_id`));", function(err, result) {
	if (err) return err;
});
/* insert into user_groups (group_id, group_name) 
values(1, 'onwer'),(2, 'admin'),(3,'family'),(4,'friend'),
      (5,'employer'),(6,'classmate'),(7,'other'); */

connection.query("CREATE TABLE IF NOT EXISTS entries (" +
  "id int NOT NULL AUTO_INCREMENT," +
  "name varchar(255) DEFAULT NULL," +
  "private tinyint(1) DEFAULT 0," +
  "userid int DEFAULT NULL," +
  "data_table varchar(255) DEFAULT NULL," +
  "description text," +
  "PRIMARY KEY (id)," +
  "FOREIGN KEY (userid) REFERENCES users (id));", function(err, result) {
	if (err) return err;
});

connection.query("CREATE TABLE IF NOT EXISTS blog_post (" +
  "post_id int NOT NULL AUTO_INCREMENT," +
  "post_title varchar(255) NOT NULL," +
  "post_desc text," +
  "post longtext NOT NULL," +
  "post_date date," +
  "post_type tinyint," +
  "PRIMARY KEY (post_id));", function(err, result) {
  if (err) return err;
});

connection.query("CREATE TABLE IF NOT EXISTS blog_type (" +
  "blog_type_id tinyint NOT NULL AUTO_INCREMENT," +
  "blog_type_name varchar(255) NOT NULL," +
  "PRIMARY KEY (blog_type_id));", function(err, result) {
  if (err) return err;
});

/*exports.connect = function(fn) {
    
    fn(connection);
};*/

module.exports = connection;
