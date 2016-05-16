var mysql   = require('mysql');
var db  = require('./db_connection.js');

/* DATABASE CONFIGURATION */
var connection = mysql.createConnection(db.config);

exports.GetAll = function(callback) {
    connection.query('SELECT * FROM video_games;',
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


 exports.GetByID = function(game_id, callback) {
     console.log(game_id, 'in game dal');
     var query = 'SELECT * FROM video_games WHERE game_id=' + game_id;
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

exports.Insert = function(game_title, game_description, callback) {
    console.log("game info is: ", game_title);

    var dynamic_query = 'INSERT INTO video_games (title, description) VALUES (' +
        '\'' + game_title + '\', ' +
        '\'' + game_description + '\'' +
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

exports.Update = function(game_id, title, description, callback) {
    console.log(game_id, title, description);
    var values = [title, description, game_id];
    connection.query('UPDATE video_games SET title = ?, description = ? WHERE game_id = ?', values,
        function(err, result){
            callback(err, result);
        });
}

var Delete = function(game_id, callback) {
//function Delete(movie_id, callback) {
    console.log("game_id for deleting is: ", game_id);
    var qry = 'DELETE FROM video_games WHERE game_id = ?';
    connection.query(qry, [game_id],
        function (err) {
            callback(err);
        });
}

exports.GetAvgRating = function(game_id, callback){
    var query = 'CALL Game_GetAvgRating(?)';
    var query_data = [game_id];

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

exports.GetEsrbRatings = function(callback) {
    connection.query('SELECT * FROM esrb_ratings;',
        function (err, result) {
            if(err) {
                console.log(err);
                callback(true);
                return;
            }
            console.log(result);
            callback(false, result);
        }
    );
}

exports.Game_esrb = function(game_id, callback){
    var query = 'CALL Game_esrb(?)';
    var query_data = [game_id];
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

exports.Game_rating = function(game_id, user_id, callback){
    var query = 'CALL CheckRating(?,?)';
    var query_data = [user_id, game_id];

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

exports.Rate = function(game_id, user_id, rating, callback) {
    var query = 'INSERT INTO game_rating (game_id, user_id, rating) VALUES (' +
        '\'' + game_id + '\', ' +
        '\'' + user_id + '\', ' +
        '\'' + rating + '\'' +
        ');';
    console.log(query);

    connection.query(query,
        function (err, result) {
            if(err) {
                callback(true);
                return;
            }
            callback(false, result);
        }
    );
}

exports.getNewGame = function(callback) {
    connection.query('SELECT max(game_id) as highest FROM video_games;', function(err, result) {
       if(err) throw err;
        callback(false, result);
    });
}

exports.insertEsrb = function(game_id, rating_id, callback) {
    console.log(game_id, rating_id);
    var query = 'INSERT INTO game_esrb_rating(game_id, rating_id) values(' + game_id + ',' + rating_id + ')';
    var params = [game_id, rating_id];
    connection.query(query, function(err, result) {
        if(err) throw err;
        callback(false, result);
    });
}

exports.DeleteById = Delete;