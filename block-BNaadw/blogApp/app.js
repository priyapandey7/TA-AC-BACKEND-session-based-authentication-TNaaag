var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
mongoose = require("mongoose")
passport = require("passport")
var flash = require('flash');
var session = require('express-session');
LocalStrategy = require("passport-local"),
passportLocalMongoose =
    require("passport-local"),
User = require("./models/User");


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const articleRouter = require('./routes/articles');

//connect with db
mongoose.connect(
  'mongodb://localhost/blogApp',
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    console.log('Connected To Database: ', err ? false : true);
  }
);
 
var app = express();

app.use(require("express-session")({
  secret: "express work",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use(
//   session({
//     secret: process.env.SECRET,
//     resave: false,
//     saveUninitialized: false,
//     store: new MongoStore({ mongooseConnection: mongoose.connection }),
//     store: MongoStore.create({ mongoUrl: 'mongodb://localhost/blogApp' }),
//   })
// );

app.use(flash());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/articles', articleRouter);

/* ================== ROUTES =====================  */
 
// Showing home page
app.get("/", function (req, res) {
    res.render("home");
});
 
// Showing secret page
app.get("/secret", isLoggedIn, function (req, res) {
    res.render("secret");
});
 
// Showing register form
app.get("/register", function (req, res) {
    res.render("register");
});
 
// Handling user signup
app.post("/register", function (req, res) {
    var username = req.body.username
    var password = req.body.password
    User.register(new User({ username: username }),
            password, function (err, user) {
        if (err) {
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(
            req, res, function () {
            res.render("secret");
        });
    });
});
 
//Showing login form
app.get("/login", function (req, res) {
    res.render("login");
});
 
//Handling user login
app.post("/login", passport.authenticate("local", {
    successRedirect: "/secret",
    failureRedirect: "/login"
}), function (req, res) {
});
 
//Handling user logout
app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
});
 
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect("/login");
}
 
// var port = process.env.PORT || 3000;
// app.listen(port, function () {
//     console.log("Server Has Started!");
// });
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(3000,() =>{
  console.log('server is listning on port 3k');
})

module.exports = app;
