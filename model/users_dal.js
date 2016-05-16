var mysql   = require('mysql');
var db  = require('./db_connection.js');

/* DATABASE CONFIGURATION */
var connection = mysql.createConnection(db.config);

exports.GetAll = function(callback) {
    connection.query('SELECT * FROM gamers;',
        function (err, result) {
            if(err) {
                console.log(err);
                callback(true);
                return;
            }
            else {
                callback(false, result);
            }
        }
    );
}


exports.GetByID = function(user_id, callback) {
    var query = 'SELECT * FROM gamers WHERE user_id=' + user_id;
    console.log(query);
    connection.query(query,
        function (err, result) {
            if(err) {
                console.log(err);
                callback(true);
                return;
            }
            callback(false, result);
        }
    );
}
// gets everyone following you
exports.GetFriends = function(user_id, callback) {
    var query = 'select f.user_id, username, f.friend_id from friends f join gamers g on f.friend_id = g.user_id where f.user_id =' + user_id;
    console.log(query);
    connection.query(query,
        function (err, result) {
            if(err) {
                console.log(err);
                callback(true);
                return;
            }
            callback(false, result);
        }
    );
}
//gets everyone you're following
exports.GetYourFriends = function(user_id, callback) {
    var query = 'select g.user_id, g.username, f.friend_id from gamers g join friends f on f.user_id = g.user_id where f.friend_id =' + user_id;
    console.log(query);
    connection.query(query,
        function (err, result) {
            if(err) {
                console.log(err);
                callback(true);
                return;
            }
            callback(false, result);
        }
    );
}

exports.Insert = function(username, password, callback) {
    console.log(username, password);

    var dynamic_query = 'INSERT INTO gamers (username, password) VALUES (' +
        '\'' + username + '\', ' +
        '\'' + password + '\'' +
        ');';

    console.log(dynamic_query);

    connection.query(dynamic_query,
        function (err, result) {

            if(err) {
                console.log(err);
                callback(true);
                return;
            }
            callback(false, result);
        }
    );
}

exports.Follow = function(user_id, friend_id, callback) {

    var dynamic_query = 'INSERT INTO friends (user_id, friend_id) VALUES (' +
        '\'' + user_id + '\', ' +
        '\'' + friend_id + '\'' +
        ');';

    console.log(dynamic_query);

    connection.query(dynamic_query,
        function (err, result) {

            if(err) {
                console.log(err);
                callback(true);
                return;
            }
            callback(false, result);
        }
    );
}

exports.unFollow = function(user_id, friend_id, callback) {
    var qry = 'DELETE FROM friends WHERE user_id = ? and friend_id = ?';
    console.log("in unfollow, user id and friend id is: ", friend_id);
    connection.query(qry, [user_id, friend_id],
        function (err) {
            callback(err);
        });
}

exports.Update = function(user_id, username, password, callback) {
    var values = [username, password, user_id];
    connection.query('UPDATE gamers SET username = ?, password = ? WHERE user_id = ?', values,
        function(err, result){
            callback(err, result);
        });
}

var Delete = function(user_id, callback) {
//function Delete(user_id, callback) {
    console.log('Error trying to delete   ', user_id);
    var qry = 'DELETE FROM gamers WHERE user_id = ?';
    connection.query(qry, [user_id],
        function (err) {
            callback(err);
        });
}

exports.DeleteById = Delete;

exports.GetByUsername = function(username, password, callback){
    var query = 'CALL User_GetByUsername(?, ?)';
    var query_data = [username, password];

    connection.query(query, query_data, function(err, result) {
        if(err){
            callback(err, null);
        }
         else if(result[0].length == 1) {
            callback(err, result[0][0]);
         }
         else {
            callback(err, null);
         }
    });
}