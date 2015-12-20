var mysql_host = 'localhost';
var mysql_user = 'root';
var mysql_password = '123';
var mysql_database = 'carderscc_01'





var mysql = require('mysql');
var connection = mysql.createConnection({
    host: mysql_host,
    user: mysql_user,
    password: mysql_password,
    database: mysql_database
});

connection.connect();

connection.query('SELECT forumid AS _id, title FROM carderscc_01.forum', function (err, rows, fields) {
    if (err) throw err;
    console.log('The solution is: ', rows[0]._id);
});

connection.end();