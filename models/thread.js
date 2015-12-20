var mongoose = require('mongoose');
var threadSchema = new mongoose.Schema({
    _id: Number,
    forum_id: Number,
    title: String
//    number_of_users: Number,
//    number_of_posts: Number,
//    posts: [{
//        user_id: Number,
//        date: Date
//    }],
});
module.exports = mongoose.model('thread', threadSchema);