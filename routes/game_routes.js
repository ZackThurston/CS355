var express = require('express');
var router = express.Router();
var gameDal = require('../model/game_dal');

router.get('/all', function(req, res) {
    gameDal.GetAll(function (err, result) {
            if (err) throw err;
            res.render('displayAllGames.ejs', {rs: result, local: req});
        }
    );
});

 router.get('/', function (req, res) {
     gameDal.GetByID(req.query.game_id, function (err, result) {
         if (err) throw err;
         gameDal.GetAvgRating(req.query.game_id, function (err, rating) {
             if (err) throw err;
             if( rating.average == null){
                 rating.average = 0;
             }
             gameDal.Game_esrb(req.query.game_id, function(err, esrb_rating) {
                 if (err) throw err;
                 if( typeof req.session.user === 'undefined') {
                     req.session.user = {};
                     req.session.user.user_id = 0;
                 }
                 console.log("req.session stuff is: ", req.session.user);
                 gameDal.Game_rating(req.query.game_id, req.session.user.user_id, function(err, game_rating) {
                     if (err) throw err;
                     console.log("game rating is: ", game_rating);
                     if(game_rating === null){
                         game_rating = {rating: null};
                     }
                     res.render('displaygameInfo.ejs', {user_rating: game_rating, local: req, rs: result, avg_rating: rating, esrb: esrb_rating, game_id: req.query.game_id});
                 });
             });
         });
     });
 });

router.get('/create', function (req, res) {
    gameDal.GetEsrbRatings(function(er, result){
        console.log("esrb result is: ", result);
        res.render('gameCreateForm.ejs', {local: req, esrb: result});
    });
});

router.get('/save', function(req, res, next) {
    console.log("title = " + req.query.title);
    console.log("tagline = " + req.query.tagline);

    gameDal.Insert(req.query, function(err, result){
        if(err) {
            res.send(err);
        }
        else {
            res.send("Successfully saved the game.")
        }
    });
});

router.get('/rate', function (req, res) {
   gameDal.Rate(req.query.game_id, req.query.user_id, req.query.rating, function(err, rate){
       if(err) {
           res.send(err);
       }
       else {
           gameDal.GetAll(function (err, result) {
                   if (err) throw err;
                   result.message = "Game successfully rated!";
                   res.render('displayAllGames.ejs', {rs: result, rate: rate, local: req});
               }
           );
       }

   });
});

router.get('/edit', function(req, res){
    console.log('/edit game_id:' + req.query.game_id);
    console.log(req.query);
    gameDal.GetByID(req.query.game_id, function(err, game_result){
        if(err) {
            console.log(err);
            res.send('error: ' + err);
        }
        else {
            console.log(game_result);
            res.render('game_edit_form', {rs: game_result, local: req});
/*            genreDal.GetAll(function(err, genre_result){
                console.log(genre_result);
                res.render('game/game_edit_form', {rs: game_result, genres: genre_result});
            });
*/

        }
    });
});

router.post('/update_game', function(req,res){
    console.log(req.body);
    gameDal.Update(req.body.game_id, req.body.title, req.body.description,
        function(err, result){
            var message;
            if(err) {
                console.log(err);
                message = 'error: ' + err;
            }
            else {
                message = 'success';
            }
            gameDal.GetAll(function (err, result) {
                    if (err) throw err;
                    result.message = "Successfully edited \"" + req.body.title + "\"!";
                    res.render('displayAllGames.ejs', {rs: result, local: req});
                }
            );

        });
});

router.get('/delete', function(req, res){
    console.log(req.query);
    gameDal.GetByID(req.query.game_id, function(err, result) {
        if(err){
            res.send("Error: " + err);
        }
        else if(result.length != 0) {
            gameDal.DeleteById(req.query.game_id, function (err) {
                gameDal.GetAll(function (err, result) {
                        if (err) throw err;
                        result.message = req.query.title + " successfully deleted!";
                        res.render('displayAllGames.ejs', {rs: result, local: req});
                    }
                );
            });
        }
        else {
            console.log(result);
            res.send('game does not exist in the database.');
        }
    });
});

router.get('/insert', function(req, res){
    console.log("rating id is: ", req.query.rating_id);
    gameDal.Insert(req.query.title, req.query.description, function(err, result){
        var response = {};
        if(err) throw err;
        gameDal.getNewGame(function(err, game){
            if(err) throw err;
            console.log(game);
            gameDal.insertEsrb(game[0].highest, req.query.rating_id, function(err, result) {
               if(err) throw err;
                gameDal.GetAll(function (err, result) {
                        if (err) throw err;
                        result.message = req.query.title + " successfully added!";
                        res.render('displayAllGames.ejs', {rs: result, local: req});
                    }
                );
            });
        });
    });
});

module.exports = router;