var mongoose = require('mongoose');
var forumSchema = new mongoose.Schema({
    _id: Number,
    title: String
//    number_of_users: Number,
//    number_of_threads: Number
});
module.exports = mongoose.model('forum', forumSchema);