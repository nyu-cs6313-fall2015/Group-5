var mongoose = require('mongoose');
var threadSchema = new mongoose.Schema({
    forumid: mongoose.Schema.Types.ObjectId,
    title: String
});
module.exports = mongoose.model('threads', threadSchema);