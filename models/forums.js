var mongoose = require('mongoose');
var forumSchema = new mongoose.Schema({
    title: String
});
module.exports = mongoose.model('forums', forumSchema);