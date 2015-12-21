var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var async = require('async');


var forums = require('../models/forums');
var threads = require('../models/threads');
var users = require('../models/users');
var posts = require('../models/posts');



router.get('/threads', function(req, res, next) {
 threads.findOne(function (err, data) {
   if (err) return next(err);
   res.json(data);
 });
});

router.get('/posts', function(req, res, next) {
 posts.findOne(function (err, data) {
   if (err) return next(err);
   res.json(data);
 });
});

router.get('/users', function(req, res, next) {
 users.findOne(function (err, data) {
   if (err) return next(err);
   res.json(data);
 });
});


function getUserPostsInForum(forumid, userid, callback) {
    posts
    .aggregate([
        {
            $match:
            {
                "forumid": forumid,
                "userid": userid
            }
        },
        { $project:
            {   
                "_id": 1
            }
        }
    ])
    .exec(function(err, data) {
        if (err) return err;
        data = data.reduce(function (prev, next) {
            prev.push(next._id);
            return prev;
        }, []);
        callback(data);
    })
}

function getThreadsByPosts(postids, callback) {
    posts
    .aggregate([
        {
            $match:
            {
                "_id": { $in: postids }
            }
        },
        { $group: 
            {
                _id: "$threadid", 
                posts: { $push: {postid: "$_id", date: "$date"} },
                users: {$addToSet: "$userid"}
            }
        },
        { $project:
            {
                threadid: "$_id",
                posts: "$posts",
                number_of_posts: { $size: "$posts" },
                number_of_users: { $size: "$users" }
            }
        }
    ])
    .exec(function(err, data) {
        if (err) return err;
        posts.populate(data, {path: "threadid", select: 'title -_id'}, function(err,data) {
            if (err) return err;
            data = data.map(function (thread) {
                thread.title = thread.threadid.title;
                delete thread.threadid;
                return thread;
            })
            callback(data);
        });
    })
}

router.get('/users/:forumid/:userid', function(req, res, next) {
    var forumid = mongoose.Types.ObjectId(req.params.forumid);
    var userid = mongoose.Types.ObjectId(req.params.userid);
    getUserPostsInForum(forumid, userid, function(postids) {
        getThreadsByPosts(postids, function(data) {
            res.json(data);
        })
    })
})

router.get('/forums', function(req, res, next) {
    posts
    .aggregate([
        { $group: 
            {
                _id: "$forumid", 
                threads: {$addToSet: "$threadid"},
                users: {$addToSet: "$userid"}
            }
        },
        { $project:
            {
                forumid: "$_id",
                number_of_threads: { $size: "$threads" },
                number_of_users: { $size: "$users" }
            }
        }
    ])
    .exec(function(err, data) {
        if (err) res.send(err);
        // res.json(data);
        posts.populate(data, {path: "forumid", select: 'title -_id'}, function(err,data) {
            if (err) return err;
            data = data.map(function (forum) {
                forum.title = forum.forumid.title.replace(new RegExp("<.*>(.*)<.*>"), "$1");
                delete forum.forumid;
                return forum;
            })
            res.json(data);
        });
    })
})
// router.get('/threads/:postids', function(req, res, next) {
//     var postids = req.params.postid;

// })

router.get('/forums/:forumid', function(req, res, next) {
    var forumid = req.params.forumid;
    var data = {};
    async.parallel([
        function(callback) {
            getThreadsInForum(forumid, function(threads) {
                data.threads = threads;
                callback();
            })
        },
        function(callback) {
            getUsersInForum(forumid, function(users) {
                data.users = users;
                callback();
            })
        }
    ], function() {
        res.json(data);
    })
})


function getThreadsInForum(forumid, callback) {
    posts
    .aggregate([
        {
            $match:
            {
                "forumid": mongoose.Types.ObjectId(forumid)
            }
        },
        { $group: 
            {
                _id: "$threadid", 
                posts: { $push: {postid: "$_id", date: "$date"} },
                users: {$addToSet: "$userid"}
            }
        },
        { $project:
            {
                threadid: "$_id",
                posts: "$posts",
                number_of_posts: { $size: "$posts" },
                number_of_users: { $size: "$users" }
            }
        }
    ])
    .exec(function(err, data) {
        if (err) return err;
        posts.populate(data, {path: "threadid", select: 'title -_id'}, function(err,data) {
            if (err) return err;
            data = data.map(function (thread) {
                thread.title = thread.threadid.title;
                delete thread.threadid;
                return thread;
            })
            callback(data);
        });
    })
}

function getUsersInForum(forumid, callback) {
    posts
    .aggregate([
        {
            $match:
            {
                "forumid": mongoose.Types.ObjectId(forumid)
            }
        },
        { $group: 
            {
                _id: "$userid", 
                posts: { $push: {postid: "$_id", date: "$date"} },
                threads: {$addToSet: "$threadid"}
            }
        },
        { $project:
            {
                userid: "$_id",
                posts: "$posts",
                number_of_posts: { $size: "$posts" },
                number_of_threads: { $size: "$threads" }
            }
        }
    ])
    .exec(function(err, data) {
        if (err) return err;
        posts.populate(data, {path: "userid", select: 'username -_id'}, function(err,data) {
            if (err) return err;
            data = data.map(function (user) {
                user.username = user.userid.username;
                delete user.userid;
                return user;
            })
            callback(data);
        });
    })
}


module.exports = router;
