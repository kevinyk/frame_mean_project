var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var morgan = require('morgan');
var flash    = require('connect-flash');
var session      = require('express-session');
var bodyParser = require('body-parser'); 
var cookieParser = require('cookie-parser');

var session = require('express-session');
var bcrypt = require('bcrypt');

var passport = require('passport');
var app = express();

// app.use(session());
app.use(bodyParser.json());
app.use(session({ secret: 'ilovescotchscotchyscotchscotch', resave: true,
   saveUninitialized: true })); // session secret
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, './client')));
app.use(session({
    secret: 'whats4lunch',
    saveUninitialized: true,
    resave: false,
    //set cookie to httpOnly if we want to be able to read it in angular
    cookie: {
      httpOnly: false
    }
  }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash()); 

require('./server/config/mongoose.js');
require('./server/config/routes.js')(app);

var User = mongoose.model('User');


app.use(passport.initialize());
app.use(passport.session());

var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done) {
        done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id).select('_id').exec(function(err, user) {
      done(err, user);
  });
});




//register strategy
//we don't really have to write it this way, we could just do this
//in a route - but here we go!
passport.use('local-register', new LocalStrategy({
      // by default, local strategy uses username and password, 
      //we will override with email
      usernameField: 'email',
      passwordField: 'password',
      // allows us to pass back the entire request to the callback
      passReqToCallback: true
  },
  function(req, email, password, done) {


      console.log("EAAAMAMFDSFMDSMF:: " + email);
      // asynchronous
      // User.findOne wont fire unless data is sent back
      process.nextTick(function() {
        console.log(req.body, 'post data');
        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'local.email' :  email }, function(err, user) {
            // if there are any errors, return the error
            if (err)
                return done(err, false, 
                  { success: false, 
                    message: 'Registration failed for... reasons.' }
                );
            // check to see if theres already a user with that email
            if (user) {
                return done(null, false, 
                  { success: false, message: 'Email already exists.' }
                );
            } else {

                // if there is no user with that email
                // create the user
                var newUser = new User({name: req.body.name});

                // set the user's local credentials
                newUser.local.email = email;
                newUser.local.password = newUser.generateHash(password);

                // save the user
                newUser.save(function(err) {
                    if (err) return done(null, false, { success: false, 
                    message: 'Registration failed for... reasons.' });
                    return done(null, {_id: newUser._id}, 
                      { success: true, message: 'Registration successful!' }
                    );
                });
            }

        });    

      });

}));

//local login strategy
passport.use('local-login', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true 
},
  function(req, email, password, done) {
    // console.log('in login strat:', req.body);
    // find a user whose email is the same as the forms email
    // we are checking to see if the user trying to login already exists
    User.findOne({'local.email': email}, function(err, user) {
        // if there are any errors, return the error before anything else
        if (err) return done(err, false, 
          { success: false, message: 'authentication failed' }
        );
        // if no user is found, return false for user
        if (!user) return done(null, false,
          { success: false, message: 'authentication failed' }
        ); 
        // if the user is found but the password is wrong
        if (!user.validPassword(password))
            return done(null, false, 
              { success: false, message: 'authentication failed' }
            ); 
        // all is well, return successful user
        return done(null, {_id: user._id});
    });
}));




app.listen(8000, function() {
    console.log('LISTENING ON PORT 8000');
});