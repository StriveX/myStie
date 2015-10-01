var Connection = require('./connDB');
module.exports = Data;

function Data(obj) {
	for (var key in obj){
		this[key] = obj[key];
	}
}

// prototype defines a class function: e.g. call Data.save(..)
Data.save = function(uid, data, table, fn) {
	var sql = "INSERT INTO ?? VALUES (DEFAULT, ";
	for (var key in data) {
		sql += data[key] + ", ";
	}
	sql += uid + ")";
	console.log("insert sql", sql);
	Connection.connect(function(connection) {
		connection.query(sql,
			[table],
			function(err){
				if (err) return fn(err);
		});
	});
};

// otherwise, it's a function defined in this module and will be used
// when this file is included
Data.getRange = function(from, to, fn) {
	Connection.connect(function(connection) {
		connection.query("SELECT * FROM entry WHERE id BETWEEN ? AND ?",
			[,],
			function(err, rows) {
				if (err) return fn(err);
		});
	});
};