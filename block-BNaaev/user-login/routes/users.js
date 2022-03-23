var express = require('express');
var router = express.Router();

//require User details
var User=  require('../models/User')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('users');
});

router.get('/register',(req,res,next) => {
  res.render('register.ejs');
});

//post req
router.post('/register',(req,res,next) => {
  User.create(req.body,(err,user) => {
    console.log(err,user);
  })
  res.render('register');
});
// router.get('/login' ,(req,res,next) =>{
//   res.render('login');
// })
module.exports = router;
