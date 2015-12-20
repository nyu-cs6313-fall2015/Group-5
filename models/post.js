var mongoose = require('mongoose');
var postSchema = new mongoose.Schema({
    _id: Number,
    user_id: {type: Number, index: true},
    forum_id: {type: Number, index: true},,
    thread_id: {type: Number, index: true},,
    title: String,
    content: String,
    date: Date
});
module.exports = mongoose.model('post', postSchema);