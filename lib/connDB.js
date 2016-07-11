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

/*
Create table for user.
User type:
0 - admin
1 - family
2 - friend_unapproved
3 - friend_approved
4 - employer
5 - visitor
*/
var user_type = {};
user_type["admin"] = 0;
user_type["family"] = 1;
user_type["friend_unapproved"] = 2;
user_type["friend_approved"] = 3;
user_type["employer"] = 4;
user_type["visitor"] = 5;
connection.query("CREATE TABLE IF NOT EXISTS users (" +
  "user_id int NOT NULL AUTO_INCREMENT," +
  "name varchar(255) NOT NULL," +
  "salt varchar(255) DEFAULT NULL," +
  "pass varchar(255) DEFAULT NULL," +
  "email varchar(255) DEFAULT NULL," +
  "group tinyint," +
  "PRIMARY KEY (user_id));", function(err, result) {
	if (err) {
    console.err("Create 'users' table failed.");
    return err;
  }
});

/*
Create table for organization.
*/
connection.query("CREATE TABLE IF NOT EXISTS organizations (" +
  "org_id int NOT NULL AUTO_INCREMENT," +
  "name varchar(255) NOT NULL," +
  "website varchar(255) NOT NULL," +
  "group tinyint," +
  "PRIMARY KEY (user_id));", function(err, result) {
  if (err) {
    console.err("Create 'organizations' table failed.");
    return err;
  }
});

/*
Create table for post.
Post type:
1 - blog
2 - picture
3 - status
4 - moment
*/
var post_type = {};
post_type["blog"] = 1;
post_type["picture"] = 2;
post_type["status"] = 3;
post_type["moment"] = 4;
connection.query("CREATE TABLE IF NOT EXISTS posts (" +
  "post_id int NOT NULL AUTO_INCREMENT," +
  "post_title varchar(255) NOT NULL," +
  "post longtext," +
  "post_date date," +
  "post_type tinyint," +
  "PRIMARY KEY (post_id));", function(err, result) {
  if (err) {
    console.err("Create 'posts' table failed.");
    return err;
  }
});

module.exports = connection;
