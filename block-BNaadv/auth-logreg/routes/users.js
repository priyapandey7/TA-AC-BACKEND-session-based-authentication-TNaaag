var express = require('express');
var router = express.Router();

// require users model -User.js
var User = require('../models/User');

router.get('/', function (req, res, next) {
  res.render('dashboard');
});

router.get('/register', function (req, res, next) {
  res.render('register', { error: req.flash('error')[0] });
});
//for capturing form data
router.post('/register', function (req, res, next) {
  // save the data
  User.create(req.body, (err, user) => {
    if (err) {
      if (err.name === 'MongoError') {
        req.flash('error', 'This Email is already registered!');
        return res.redirect('/users/register');
      }
      if (err.name === 'ValidationError') {
        req.flash('error', err.message);
        return res.redirect('/users/register');
      }
    }
    res.redirect('/users/login');
  });
});

//login routes
router.get('/login', function (req, res, next) {
  var error = req.flash('error')[0];
  res.render('login', { error });
});

router.post('/login', function (req, res, next) {
  var { email, password } = req.body;
  if (!email || !password) {
    req.flash('error', 'Email/Password is required!');
    return res.redirect('/users/login');
  }
  User.findOne({ email }, (err, user) => {
    if (err) return next(err);
    if (!user) {
      req.flash('error', 'User not registered!');
      return res.redirect('/users/login');
    }
    //compare passwords
    user.verifyPassword(password, (err, result) => {
      if (!result) {
        req.flash('error', 'Wrong Password!');
        return res.redirect('/users/login');
      }
      //persist loggedin user info
      req.session.userId = user._id;
      res.redirect('/users');
    });
  });
});

router.get('/logout', (req, res, next) => {
  req.session.destroy();
  res.clearCookie('connect.sid');
  res.redirect('/users/login');
});

module.exports = router;