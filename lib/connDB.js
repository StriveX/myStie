var mysql = require('mysql');
module.exports = Connection;

var host = 'localhost';
var user = 'root';
var password = 'zx0228033018';
var databse = 'mysite';
var port = 3306;

function Connection(obj) {
	for (var key in obj){
		this[key] = obj[key];
	}
}

Connection.connect = function(fn) {
    var connection = mysql.createConnection({
	    host: host,
	    user: user,
	    password: password,
	    port: port
	});
    connection.query('USE mysite');
    fn(connection);
};
