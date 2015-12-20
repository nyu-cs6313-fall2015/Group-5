var mongoose = require('mongoose');
var userSchema = new mongoose.Schema({
    _id: Number,
    name: String
//    number_of_threads: Number,
//    number_of_posts: Number,
//    posts: [{
//        user_id: Number,
//        date: Date
//    }],
});
module.exports = mongoose.model('user', userSchema);