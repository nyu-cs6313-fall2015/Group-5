var data;
viz_forum_list();
var lastclick;
var forum_meta;
var user_meta;
var thread_meta;

function refresh() {
    d3.selectAll("td").style({
            "padding": "0px",
            "vertical-align": "middle"
        });
}
var Dispatcher = {
    init: function(forumid) {
        d3.json("/api/forums/"+forumid, function (forum) {
            this.forum = forum;
            user_meta = {
                max_number_of_posts: d3.max(forum.users, function(d) {return d.number_of_posts}),
                max_number_of_threads: d3.max(forum.users, function(d) {return d.number_of_threads})
            }
            thread_meta = {
                max_number_of_posts: d3.max(forum.threads, function(d) {return d.number_of_posts}),
                max_number_of_users: d3.max(forum.threads, function(d) {return d.number_of_users})
            }
            this.viz();
        }.bind(this))
    },
    vizThread: function() {
        var threads = this.forum.threads;
        viz_thread(threads);
        // d3.selectAll("td").style({
        //     "padding": "0px",
        //     "vertical-align": "middle"
        // });
    },
    vizUser: function() {
        var users = this.forum.users;
        viz_user(users);
        // d3.selectAll("td").style({
        //     "padding": "0px",
        //     "vertical-align": "middle"
        // });
    },
    viz: function() {
        this.vizThread();
        this.vizUser();
    }
}


function viz_forum_list() {
    d3.json('/api/forums', function(dataset) {
        var fields = ["title", "number_of_threads", "number_of_users", "_id", "first_post_date", "<last_post_date></last_post_date>"];

        var table_rows = viz_table_structure(dataset, "#search_result",
            "<th>Forum Name</th><th># of Threads</th><th># of Users</th>",
            fields,
            ["50%", "25%", "25%"]);


        var opened = false;

        table_rows.on("click", function(d, i) {
                d3.select("#search_result").style({
                    "display": "none",
                });
                d3.select("#cover").style({
                    "display": "none"
                });
                d3.select("#forum_search").html(dataset[i][fields[0]]
                    + ' <span class="caret"></span>');
                opened = false;
                forum_meta = d;
                Dispatcher.init(d[fields[3]]);
            });
        table_rows.append("td").html(function(d) {return d[fields[0]];});
        table_rows.append("td").text(function(d) {return d[fields[1]];});
        table_rows.append("td").text(function(d) {return d[fields[2]];});
        refresh();

        d3.select("#forum_search")
            .on("click", function() {
                if (!opened) {
                    d3.select("#search_result").style({
                        "display": "table"
                    });
                    d3.select("#cover").style({
                        "display": "block"
                    });
                    opened = true;
                } else {
                    d3.select("#search_result").style({
                        "display": "none",
                    });
                    d3.select("#cover").style({
                        "display": "none"
                    });
                    opened = false;
                }
            })
        d3.select("#cover")
            .on("mousedown", function() {
                d3.select("#search_result").style({
                    "display": "none",
                });
                d3.select("#cover").style({
                    "display": "none"
                });
                opened = false;
            })
    })
}


function viz_thread(threads) {
    var width = [0.2, 0.25, 0.25, 0.3].map(function (d) {
        return d * (d3.select("h4").node().getBoundingClientRect().width);
    });
    var fields = ["title", "number_of_users", "number_of_posts", "posts", "_id"];
    var table_rows = viz_table_structure(threads, "#thread",
        "<th>Thread title</th><th># of Users</th><th># of Posts</th><th>Time Series</th>",
        fields,
        width);
    table_rows.on("click", function(d, i) {
        d3.select(lastclick).classed("info", false);
        d3.select(this).classed("info", true);
        lastclick = this;
        var thread_users = threads[i].posts.map(function(post) {return post.userid;});
        var filtered_users = Dispatcher.forum.users.filter(function (user){
            return thread_users.includes(user._id);
        })
        viz_user(filtered_users);
        // d3.json("/users"+forum_meta.forumid+"/"+d[fields[4]], function(users){
        //     viz_user(users);
        // });
    })


    //var height = table_rows.node().getBoundingClientRect().height;
    var height = 18;
    viz_name(threads, fields[0], table_rows, width[0], height)
    viz_number(threads, fields[1], table_rows, width[1], height, thread_meta.max_number_of_users);
    viz_number(threads, fields[2], table_rows, width[2], height, thread_meta.max_number_of_posts);
    viz_time_series(threads, fields[3], table_rows, width[3], height);
    refresh();
}

function viz_user(users) {
    var width = [0.2, 0.25, 0.25, 0.3].map(function (d) {
        return d * (d3.select("h4").node().getBoundingClientRect().width);
    });
    var fields = ["username", "number_of_threads", "number_of_posts", "posts", "_id"];
    var table_rows = viz_table_structure(users, "#user",
        "<th>User Name</th><th># of Threads</th><th># of Posts</th><th>Time Series</th>",
        fields,
        width);
    table_rows.on("click", function(d, i) {
        d3.select(lastclick).classed("info", false);
        d3.select(this).classed("info", true);
        lastclick = this;
        var user_threads = users[i].posts.map(function(post) {return post.threadid;});
        var filtered_threads = Dispatcher.forum.threads.filter(function (thread){
            return user_threads.includes(thread._id);
        })
        viz_thread(filtered_threads);
        // d3.json("/api/threads/"+forum_meta._id+"/"+d[fields[4]], function(threads){
        //     viz_thread(threads);
        // });
    })


    //var height = table_rows.node().getBoundingClientRect().height;
    var height = 18;
    viz_name(users, fields[0], table_rows, width[0], height)
    viz_number(users, fields[1], table_rows, width[1], height, user_meta.max_number_of_threads);
    viz_number(users, fields[2], table_rows, width[2], height, user_meta.max_number_of_posts);
    viz_time_series(users, fields[3], table_rows, width[3], height);
    refresh();
}


function viz_table_structure(dataset, div_table, thhtml, thdata, width) {
    d3.select(div_table).html("");
    var table = d3.select(div_table)
        .attr("class", "table table-hover table-condensed table-border table-bordered");
    table.append("thead").append("tr")
        .html(thhtml);

    var descending = false;
    table.selectAll("th")
        .data(thdata)
        .style({
            "width": function(d, i) {
                return width[i]+"px";
            }.bind(this)
        })
        .on("click", function (k) {
            if (k === "posts") {
                return;
            }
            if (descending) {
                descending = false;
                table_rows.sort(function (a, b) {
                    return d3.ascending(a[k], b[k]);
                })
            } else {
                descending = true;
                table_rows.sort(function (a, b) {
                    return d3.descending(a[k], b[k]);
                })
            }});

    if (typeof dataset == "undefined") {
        return;
    }
    var table_rows = table.append("tbody")
        .selectAll("tr").data(dataset)
        .enter().append("tr")

    return table_rows;
}

function viz_time_series(dataset, postfield, table_rows, width, height) {

    var scaleX = d3.time.scale();
    // var scaleY = d3.time.scale();
    scaleX.domain([new Date(forum_meta.first_post_date), new Date(forum_meta.last_post_date)]);
    // scaleY.domain([forum_meta.last_post_date, 0]);
    scaleX.range([0, width]);
    // scaleY.range([0, height]);

    table_rows.append("td")
        .append("svg")
        .style({
            "height": height,
            "width": width,
            "vertical-align": "middle"
        })
        .selectAll("rect")
        .data(function(d) {return d.posts;})
        .enter().append("rect")
        .attr({
            "x": function(d) { return scaleX(new Date(d.date)); },
            "width": 1,
            "y": 0,
            "height": height,
            "fill": "rgba(0,0,0,0.6)",
            "opcaity": 0.1
        })
        .on("mouseover", function(d) {
            var format = d3.time.format("%Y-%m-%d");
            showTooltip("Date: "+format(new Date(d.date)));
        })
        .on("mouseout", function() {
            hideTooltip();
        });


}

function rescale(posts, scale, scaleX, scaleY) {
    posts = posts.map(function (d) {
        d.date = new Date(d.date);
    });
    var minDate = d3.min(posts, function(d) { return d.date; });
    var maxDate = d3.max(posts, function(d) { return d.date; });
    var slot = Math.floor((maxDate - minDate) / scale);
    // posts = posts.map(function (d) {
    //     return {
    //         "date": Math.floor((d.date - minDate) / slot) * slot + minDate
    //     }
    // })
    posts = posts.reduce(function (prev, next) {
        var matched = false;
        prev.forEach(function (d) {
            if (d.date == next.date) {
                ++d.value;
                matched = true;
                return;
            }
        })
        if (matched) {
            return prev;
        }
        prev.push({
            "date": next.date,
            "value": 1
        })
        return prev;
    }, []);
    scaleX.domain([minDate, maxDate]);
    scaleY.domain([d3.max(posts, function(post) { return post.value; }), 0]);
    posts.forEach(function (post) {
        post.x = scaleX(post.date);
        post.y = scaleY(post.value);
    })
    return posts;
}




function viz_name(dataset, namefield, table_rows, width, height) {

    // create a row for each object in the data
    table_rows.append("td").text(function (d) {
            return d[namefield].slice(0, 10);
        }.bind(this))
        .style({
            "width": width + "px",
            "height": height + "px",
            "text-align": "middle"
        })
        .on("mouseover", function (d) {
            showTooltip(d[namefield]);
        })
        .on("mouseout", function (d) {
            hideTooltip();
        });
}



// functions for viz_number



function viz_number(dataset, numberfield, table_rows, width, height, maxNum) {

    var scale = function (userNum) {
        return (userNum / maxNum) * width;
    }
    table_rows.append("td")
        .on("mouseover", function(d) {
            showTooltip(d[numberfield] + "/" + maxNum);
        })
        .on("mouseout", function() {
            hideTooltip();
        })
        .append("svg")
        .style({
            "height": height,
            "width": scale(maxNum),
            "padding": 0,
            "vertical-align": "middle"
        })
        .append("rect")
        .attr("width", function (d) {
            return scale(d[numberfield]);
        })
        .attr("height", height)
        .attr("fill", "rgba(0,0,0,0.6)");
}

function showTooltip(html) {
    var tooltip = d3.select("#tooltip");
    tooltip.html(html);
    tooltip.style({
        'display': "block",
        'top': d3.event.pageY + 10 + 'px',
        'left': d3.event.pageX + 10 + 'px'
    });
}

function hideTooltip() {
    var tooltip = d3.select("#tooltip");
    tooltip.style({
        'display': "none",
    });
}