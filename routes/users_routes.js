var express = require('express');
var router = express.Router();
var usersDal = require('../model/users_dal');
var stateDal = require('../model/state_dal');

/* GET users listing. */
router.get('/all', function(req, res) {
  usersDal.GetAll(function (err, result) {
        if (err) throw err;
        res.render('displayAllUsers.ejs', {rs: result, local: req});
      }
  );
});

router.get('/', function (req, res) {
    usersDal.GetByID(req.query.user_id, function (err, result) {
            if (err) throw err;
            console.log("results has: ", result);
        console.log("req.session.user has: ", req.session.user);
        usersDal.GetFriends(req.query.user_id, function(err, friends) {
            if (err) throw err;
            usersDal.GetYourFriends(req.query.user_id, function(err, yourFriends) {
                if (err) throw err;
                console.log("right before the render user info");
                res.render('displayUserInfo.ejs', {rs: result, local: req, list: friends, yours: yourFriends});
            });
        });
    });
});

router.get('/create', function (req, res, next) {
    stateDal.GetAll(function(err, result) {
        if(err){
            res.send("Error: " + err);
        }
        else{
            res.render('userFormCreate.ejs', {state: result, local: req});
        }
    })
});

router.get('/save', function(req, res, next) {

    usersDal.Insert(req.query, function(err, result){
        if(err) {
            res.send(err);
        }
        else {
            usersDal.GetAll(function (err, result) {
                    if (err) throw err;
                    res.render('displayAllUsers.ejs', {rs: result, local: req});
                }
            );
        }
    });
});

router.get('/follow', function(req, res, next) {

    usersDal.Follow(req.query.user_id, req.query.friend_id, function(err, result){
        if(err) {
            res.send(err);
        }
        else {
            usersDal.GetAll(function (err, result) {
                    if (err) throw err;
                    res.render('displayAllUsers.ejs', {rs: result, local: req});
                }
            );
        }
    });
});

router.get('/unfollow', function(req, res, next) {

    usersDal.unFollow(req.query.user_id, req.query.friend_id, function(err, result){
        if(err) {
            res.send(err);
        }
        else {
            usersDal.GetAll(function (err, result) {
                    if (err) throw err;
                    res.render('displayAllUsers.ejs', {rs: result, local: req});
                }
            );
        }
    });
});

module.exports = router;


router.get('/edit', function(req, res){
    usersDal.GetByID(req.query.user_id, function(err, user_result){
        if(err) {
            console.log(err);
            res.send('error: ' + err);
        }
        else {
            console.log(user_result);
            res.render('user_edit_form', {rs: user_result, local: req});
            /*            genreDal.GetAll(function(err, genre_result){
             console.log(genre_result);
             res.render('users/user_edit_form', {rs: user_result, genres: genre_result});
             });
             */

        }
    });
});

router.post('/update_user', function(req,res){
    usersDal.Update(req.body.user_id, req.body.username, req.body.password,
        function(err, result){
            var message;
            if(err) {
                console.log(err);
                message = 'error: ' + err;
            }
            else {
                message = 'success';
            }
            usersDal.GetAll(function (err, result) {
                    if (err) throw err;
                    res.render('displayAllUsers.ejs', {rs: result, local: req});
                }
            );

        });
});

router.get('/delete', function(req, res){
    console.log(req.query);
    usersDal.GetByID(req.query.user_id, function(err, result) {
        if(err){
            res.send("Error: " + err);
        }
        else if(result.length != 0) {
            usersDal.DeleteById(req.query.user_id, function (err) {
                usersDal.GetAll(function (err, result) {
                        if (err) throw err;
                        res.render('displayAllUsers.ejs', {rs: result, local: req});
                    }
                );
        });
        }
        else {
            console.log(result);
            res.send('User does not exist in the database.');
        }
    });
});

module.exports = router;
