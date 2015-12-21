var mongoose = require('mongoose');
var userSchema = new mongoose.Schema({
    username: String
});
module.exports = mongoose.model('users', userSchema);