var express = require('express');
var router = express.Router();
var usersDal = require('../model/users_dal');

/* GET home page. */
router.get('/', function(req, res, next) {
  var data = {
    title : 'Express'
  }
  if( req.session.user === undefined){
    res.render('index', {stuff: data, local: req});
  }
  else {
    data.username = req.session.user.username;
    res.render('index', {stuff: data, local: req});
  }
});

router.get('/authenticate', function(req, res) {
  usersDal.GetByUsername(req.query.username, req.query.password, function (err, user) {
    if (err) {
      res.send(err);
    }
    else if (user == null) {
      console.log("why is it getting stuck here?");
      var data = {msg : "User not found."}
      res.redirect('login.ejs');
    }
    else {
      console.log("the original url thing is: ", req.session.originalUrl);
      req.session.user = user;
      if(req.session.originalUrl === '/login' || typeof req.session.originalUrl === 'undefined') {
        req.session.originalUrl = '/'; //don't send user back to login, instead forward them to the homepage.
      }
      console.log("about to send back the url to ajax: ", req.session.originalUrl);
      res.json({url: req.session.originalUrl});
    }
  });
});

router.get('/newUser', function(req, res) {
  usersDal.Insert(req.query.username, req.query.password, function(err, user) {
    if(err) throw err;
    res.render('index.ejs', {local: req});
  });
});

router.get('/login', function(req, res) {
  if( typeof req.session.user !== 'undefined' && req.session.user.user_id > 0) {
    res.redirect('/'); //user already logged in so send them to the homepage.
  }
  req.session.destroy( function(err) {
    res.render('login.ejs', {local: req});
  });
});

router.get('/logout', function(req, res) {
  req.session.destroy( function(err) {
    res.render('logout.ejs', {local: req});
  });
});

router.get('/register', function(req, res) {
  res.render('register.ejs', {local: req});
});

router.get('/about', function(req, res) {
  res.render('about.ejs', {local: req});
});

module.exports = router;
