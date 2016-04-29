var passport = require('passport');
var bcrypt = require('bcrypt');
var lists = require('./../controllers/lists.js');
var users = require('./../controllers/users.js');
var mongoose = require('mongoose');
var User = mongoose.model('User');





module.exports = function(app) {
	// GET ALL USERS
	// app.get('/users', function(req, res) {
	// 	users.show(req, res);
	// });

	// // FROM [LOGIN FACTORY] - LOGIN USER OR CREATE NEW USER
	// app.post('/login', function(req, res) {
	// 	users.find(req, res);
	// });

	// FROM [TOPIC FACTORY] - CREATE NEW TOPIC
	app.post('/addTask', function(req, res) {
		lists.create(req, res);
	});
	app.post('/tasks', function(req, res){
		lists.index(req, res);
	});
	app.post('/deleteTask', function(req, res){
		lists.delete(req,res);
	});
	app.post('/toggleTask', function(req, res){
		lists.toggle(req,res);
	});
	app.get('/editTask/:id', function(req, res){
		console.log(req.params);
		console.log(req.body);
		res.render('/edit_event', {taskId: req.params.id});
	})
	app.post('/findTask', function(req, res){
		lists.findOne(req,res);
	})
	app.post('/editTask', function(req, res){
		lists.update(req, res);
	})
    app.post('/register', function(req, res, next) {
      console.log('did a register route', req.body);
      passport.authenticate('local-register', function(err, user, info) {
        if (err) {
          return res.status(401).json(info); 
        }
        if (!user) {
          return res.status(401).json(info);
        } 
        return res.json(info);
      })(req, res, next);
    });

    app.post('/login', function(req, res, next) {
      passport.authenticate('local-login', function(err, user, info) {
        if (err) {
          return res.status(401).json(info); 
        }
        if (!user) {
          return res.status(401).json(info);
        }
        req.logIn(user, function(loginErr) {
          if (loginErr) { return next(loginErr); }
          console.log('success')
          return res.json(user);
        });    
      })(req, res, next);
    });

    app.get('/logout', function(req, res){
      req.logout();
      res.json(true);
    });

    //middleware to check if we're logged in
    function isLoggedIn(req, res, next) {
        // if user is authenticated in the session, carry on 
        if (req.isAuthenticated()){
          return next();
        }
        else{
          console.log('unauthorized access attempt!');
          // if they aren't redirect them to the home page
          res.redirect('/');
        }
    
    }

    app.get('/profile', isLoggedIn, function(req, res){
      User.findOne({_id: req.user._id})
        .select('_id name local.email')
        .exec(function(err, user){
          if(err) console.log(err);
          res.json(user)
      })
    })

    
    app.post('/completed', function(req, res){
    	lists.indexCompleted(req, res);
    });
    app.post('/incomplete', function(req, res){
    	lists.indexIncomplete(req, res);
    });
}









