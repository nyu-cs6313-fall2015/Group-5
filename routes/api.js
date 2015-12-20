var express = require('express');
var router = express.Router();
//var forum = require('../models/forum');
var mongoose = require('mongoose');

function find (collec, query, callback) {
    mongoose.connection.db.collection(collec, function (err, collection) {
    collection.find(query).toArray(callback);
    });
}

router.get('/forum', function(req, res, next) {
    find('forum', {}, function(err, docs) {
        res.json(docs);
    })
});

//router.get('/:id', function(req, res, next) {
//  Todo.findById(req.params.id, function (err, post) {
//    if (err) return next(err);
//    res.json(post);
//  });
//});

router.get('/forum/:id', function(req, res, next) {
    var posts = find('thread', {"forum_id": ObjectID(req.params.id)}, function(err, docs) {
        return docs;
    })
    res.json(docs);
//    var users = find('user', {})
//    find('forum', {}, function(err, docs) {
//        res.json(docs);
//    })
});

router.get('/user', function(req, res, next) {
    find('user', {}, function(err, docs) {
        res.json(docs);
    })
});

router.get('/thread', function(req, res, next) {
    find('thread', {}, function(err, docs) {
        res.json(docs);
    })
});

router.get('/post', function(req, res, next) {
    find('post', {}, function(err, docs) {
        res.json(docs);
    })
});


module.exports = router;
