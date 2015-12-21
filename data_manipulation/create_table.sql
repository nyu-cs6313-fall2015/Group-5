DROP TABLE new_forum;
CREATE TABLE new_forum
SELECT t2.* FROM
	(SELECT DISTINCT(forumid) FROM carderscc_01.thread) AS t1
	LEFT JOIN
	(SELECT forumid, title FROM carderscc_01.forum) AS t2
	ON t1.forumid = t2.forumid;
    
DROP TABLE new_thread;
CREATE TABLE new_thread
SELECT threadid, forumid, title FROM carderscc_01.thread;

DROP TABLE new_post;
CREATE TABLE new_post
SELECT postid, t4.threadid, userid, forumid, title, FROM_UNIXTIME(dateline) AS date, content FROM
	(SELECT * FROM
			(SELECT postid, threadid, userid, title, dateline, pagetext AS content
			FROM carderscc_01.post
			WHERE userid != 0
		UNION
			SELECT postid, threadid, userid, title, dateline, pagetext AS content
			FROM
				(SELECT postid, threadid, username, title, dateline, pagetext
				FROM carderscc_01.post
				WHERE userid = 0) AS t1
			JOIN
				(SELECT username, userid
				FROM carderscc_01.user) AS t2 
			ON t1.username = t2.username
	        WHERE userid IS NOT NULL) AS t3
		WHERE title != "" AND content != "") AS t4
LEFT JOIN
	(SELECT threadid, forumid FROM new_thread) AS t5
ON t4.threadid = t5.threadid;


DROP TABLE new_user;
CREATE TABLE new_user
SELECT t2.*
FROM
	(SELECT DISTINCT(userid)
	FROM new_post) AS t1
LEFT JOIN
	(SELECT userid, username
    FROM carderscc_01.user) AS t2
ON t1.userid = t2.userid;