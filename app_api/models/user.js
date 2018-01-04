var mongoose = require('mongoose');
var db = require('./db');

var userSchema = new mongoose.Schema(
    {
        username: String,
        password: String,
        head: String,
        nick: String,
        registerTime: String,
        lastLoginTime: String
    }
);

module.exports = db.model('User', userSchema);