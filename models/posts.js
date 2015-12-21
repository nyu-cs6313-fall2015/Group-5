var mongoose = require('mongoose');
var postSchema = new mongoose.Schema({
    userid: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    forumid: { type: mongoose.Schema.Types.ObjectId, ref: 'forums' },
    threadid: { type: mongoose.Schema.Types.ObjectId, ref: 'threads' },
    title: String,
    content: String,
    date: Date
});
module.exports = mongoose.model('posts', postSchema);