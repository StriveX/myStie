var Connection = require('./connDB');
module.exports = Entry;

// ***** Entry *****
// * name - the entry name
// * user - the owner (default public)
// * private
// * table - assoicate table's name storing the data
// * description


function Entry(obj) {
	for (var key in obj){
		this[key] = obj[key];
	}
}

Entry.prototype.save = function(fn) {
	var entry = this;
	Connection.connect(function(connection) {
		connection.query("INSERT INTO entries (name, private, userid, data_table, description) " +
			"VALUES (?,?,?,?,?)",
			[entry.name, entry.private, entry.userid, entry.table, entry.description],
			function(err){
				return fn(err);
		});
	});
};

Entry.prototype.create = function(data, fn) {
	var entry = this;
	var sql = "CREATE TABLE " + entry.name + "_data (";
	sql += "cid INT NOT NULL AUTO_INCREMENT";
	console.log("IMPORTANT:", data.num, data);
	for (i=0; i<data.num; i++) {
		var tempField = "field" + (i+1);
		var tempType = "type" + (i+1);
		sql += ", c_" + data[tempField] + " " + data[tempType] + " NOT NULL";
	}
	sql += ", userid INT,";
	sql += " PRIMARY KEY(cid),";
	sql += " FOREIGN KEY (userid) REFERENCES users(id))"
	console.log("create table sql", sql);
	Connection.connect(function(connection) {
		connection.query(sql, function(err) {
			return fn(err);
		});
	});
};

Entry.remove = function(name, fn) {
	var entry = this;
	Connection.connect(function(connection) {
		connection.query("DROP TABLE ??",
			[name],
			function(err) {
				fn(err);
		});
		connection.query("DELETE FROM entries WHERE data_table = ?",
			[name],
			function(err) {
				fn(err);
		});
	});
}

Entry.getRange = function(from, to, fn) {
	Connection.connect(function(connection) {
		connection.query("SELECT * FROM entries",
			function(err, rows) {
				if (err) return fn(err);
				fn(err, rows);
		});	
	});
};

Entry.getByName = function(name, fn) {
	Connection.connect(function(connection) {
	    connection.query("SELECT * FROM entries WHERE data_table=?", [name], function(err, rows){
	        if (err) return fn(err);
	        //if (rows.length > 1) console.log("ERROR: user duplicate name");
	        var entry = new Entry(rows[0]);
	        if (rows.length > 0) return fn(null, entry);
	        fn(null, null);
	    });
	});
};

Entry.describe = function(name, fn) {
	Connection.connect(function(connection) {
		connection.query("DESCRIBE ??", [name], function(err, columnInfos){
	        if (err) return fn(err);
	        console.log("column info", columnInfos);
	        /*columnInfos.foreach(function(columnInfo) {
	        	columnInfo['Field'] = columnInfo['Field'].slice(2);
	        });*/
			for (var i=0;i<columnInfos.length;i++) {
	        	columnInfos[i]['Field'] = columnInfos[i]['Field'].slice(2);
	        };
	        if (columnInfos.length > 0) return fn(null, columnInfos);
	        fn(null, null);
	    });
	});
}

Entry.count = function(fn){
	Connection.connect(function(connection) {
	  	connection.query("SELECT COUNT(*) AS count FROM entries",
	  		function(err, result) {
	  			if (err) return fn(err);
	  			fn(err, result[0].count);
	  	});
	});
};