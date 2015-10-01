var express = require('express');
var res = express.response;	
// res is object in express, add message function for it
// message will be used by other component, e.g. register, to add message to session.message

res.messages = function(msg, type) {
	type = type || 'info';
	var sess = this.req.session;
	sess.messages = sess.messages || []; //empty sess.messages
	sess.messages.push({type:type, string:msg});
};

res.error = function(msg) {
	return this.messages(msg, 'error');
}

// middlewire used by app.js to render message view (see.message.ejs)
module.exports = function(req, res, next) {
	res.locals.messages = req.session.messages || []; //copt to local.message from session.messages is define, empty otherwise
	res.locals.removeMessages = function() {
		req.session.messages = [];
	};
	next();
};