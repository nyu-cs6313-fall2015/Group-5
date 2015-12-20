var data;

var Dispatcher = {
    init: function(forum) {
        this.forum = forum;
        this.forum.threads = alterThreads(this.forum.threads);
        this.forum.users = alterUsers(this.forum.users);
    },
    vizThread: function(filter) {
        var threads = this.forum.threads;
        if (typeof filter != "undefined") {
            threads = filter.map(function (i) {
                return threads[i];
            })
        }
        viz_thread(threads);
        d3.selectAll("td").style({
            "padding": "0px",
            "vertical-align": "middle"
        });
    },
    vizUser: function(filter) {
        var users = this.forum.users;
        if (typeof filter != "undefined") {
            users = filter.map(function (i) {
                return users[i];
            })
        }
        viz_user(users);
        d3.selectAll("td").style({
            "padding": "0px",
            "vertical-align": "middle"
        });
    },
    viz : function() {
        this.vizThread();
        this.vizUser();
    }

}

d3.json("dual_data.json", function (d) {
    data = d.data;
    viz_forum_list(data);
    viz_thread();
    viz_user();
});

function viz_forum_list(dataset) {
    var table_rows = viz_table_structure(dataset, "#search_result",
        "<th>Forum Name</th><th># of Threads</th><th># of Users</th>",
        ["forumtitle", "numberofthreads", "numberofusers"],
        ["50%", "25%", "25%"]);


    var opened = false;

    table_rows.on("click", function(d, i) {
            d3.select("#search_result").style({
                "display": "none",
            });
            d3.select("#cover").style({
                "display": "none"
            });
            d3.select("#forum_search").html(dataset[i].forumtitle
                + ' <span class="caret"></span>');
            opened = false;
            Dispatcher.init(dataset[i]);
            Dispatcher.viz();
        });
    table_rows.append("td").text(function(d) {return d.forumtitle;});
    table_rows.append("td").text(function(d) {return d.numberofthreads;});
    table_rows.append("td").text(function(d) {return d.numberofusers;});

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
}


function viz_thread(threads) {
    var width = [0.2, 0.25, 0.25, 0.3].map(function (d) {
        return d * d3.select("#thread").node().getBoundingClientRect().width;
    });
    var table_rows = viz_table_structure(threads, "#thread",
        "<th>Thread title</th><th># of Users</th><th># of Posts</th><th>Time Series</th>",
        ["title", "userNum", "postNum", "timeSeries"],
        width);
    if (typeof threads == "undefined") {
        return;
    }
    table_rows.on("click", function(d) {
        var filter = d.posts.reduce(function (prev, next) {
            if (prev.indexOf(next.userIndex) < 0) {
                prev.push(next.userIndex);
            }
            return prev;
        },[])
        Dispatcher.vizUser(filter);
    })
    //threads = alterThreads(threads);


    //var height = table_rows.node().getBoundingClientRect().height;
    var height = 18;
    viz_name(threads, "title", table_rows, width[0], height)
    viz_number(threads, "userNum", table_rows, width[1], height, Dispatcher.forum.numberofusers);
    viz_number(threads, "postNum", table_rows, width[2], height, Dispatcher.forum.numberofposts);
    viz_time_series(threads, table_rows, width[3], height);
}

function viz_user(users, filter) {
    var width = [0.2, 0.25, 0.25, 0.3].map(function (d) {
        return d * d3.select("#user").node().getBoundingClientRect().width;
    });
    table_rows = viz_table_structure(users, "#user",
        "<th>User Name</th><th># of Threads</th><th># of Posts</th><th>Time Series</th>",
        ["username", "threadNum", "postNum", "timeSeries"],
        width);
    if (typeof users == "undefined") {
        return;
    }
    table_rows.on("click", function(d) {
        var filter = d.posts.reduce(function (prev, next) {
            if (prev.indexOf(next.threadindex) < 0) {
                prev.push(next.threadindex);
            }
            return prev;
        },[])
        Dispatcher.vizThread(filter);
    })

    //users = alterUsers(users);

    var height = 18;
    viz_name(users, "username", table_rows, width[0], height);
    viz_number(users, "threadNum", table_rows, width[1], height, Dispatcher.forum.numberofthreads);
    viz_number(users, "postNum", table_rows, width[2], height, Dispatcher.forum.numberofusers);
    viz_time_series(users, table_rows, width[3], height);
}

// temporary functions
function ThreadUserNum(obj) {
    var num = 0;
    var useridarray = Array();
    for (var i = 0; i < obj.length; i++) {
        if (useridarray.indexOf(obj[i]["userid"]) > -1) {} else {
            num += 1;
            useridarray.push(obj[i]["userid"])
        }
    }
    return num;
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
            if (k === "timeSeries") {
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

function alterThreads(threads) {
    threads = threads.map(function (thread) {
        thread.userNum = ThreadUserNum(thread.posts);
        thread.postNum = thread.posts.length;
        return thread;
    });

    return threads;
}

function alterUsers(users) {
    users = users.map(function (user) {
        user.threadNum = user.posts.reduce(function (prev, next) {
            prev.add(next.threadindex);
            return prev;
        },new Set()).size;
        user.postNum = user.posts.length;
        return user;
    });
    return users;
}

function viz_time_series(dataset, table_rows, width, height) {

    var scale = 50; // Merge data to how many blocks

    var scaleX = d3.scale.linear();
    var scaleY = d3.scale.linear();
    scaleX.range([0, width-3]);
    scaleY.range([0, height]);

    var postss = dataset.map(function (d) {
        return rescale(d.posts, scale, scaleX, scaleY);
    })

    table_rows.append("td")
        .data(postss)
        .append("svg")
        .style({
            "height": height,
            "width": width,
            "vertical-align": "middle"
        })
        .selectAll("rect")
        .data(function(posts) {return posts;})
        .enter().append("rect")
        .attr("fill", "blue")
        .attr("class", "bar")
        .attr("x", function(d) { return d.x; })
        .attr("width", function(d) { return width/scale; })
        .attr("y", function(d) { return d.y; })
        .attr("height", function(d) { return height - d.y; })
        .on("mouseover", function(d) {
            var format = d3.time.format("%Y-%m-%d");
            showTooltip("<p>Date: "+format(new Date(d.date))+"</p>"
            +"<p># of Post:" + d.value + "</p>");
        })
        .on("mouseout", function() {
            hideTooltip();
        });


}

function rescale(posts, scale, scaleX, scaleY) {
    var minDate = d3.min(posts, function(d) { return d.date; });
    var maxDate = d3.max(posts, function(d) { return d.date; });
    var slot = Math.floor((maxDate - minDate) / scale);
    posts = posts.map(function (d) {
        return {
            "date": Math.floor((d.date - minDate) / slot) * slot + minDate
        }
    })

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



    //var maxNum = dataset.reduce(function (prev, next) {
    //    if (next[numberfield] > prev) {
    //        prev = next[numberfield];
    //    }
    //    return prev;
    //}, 0);

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
        .attr("fill", "blue");
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