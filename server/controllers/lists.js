// this is our friends.js file located at /server/controllers/friends.js
// note the immediate function and the object that is returned
// First add the following two lines at the top of the friends controller so that we can access our model through var Friend
// need to require mongoose to be able to run mongoose.model()
var mongoose = require('mongoose');
var List = mongoose.model('List');
module.exports = (function() {
  return {
	// notice how index in the factory(client side) is calling the index method(server side)
    index: function(req, res) {
    	List.find({}).sort('date').exec(function(err, results){
    		if(err){
    			console.log(err);
    		}else {
    			res.json(results);
    		}
    	})
    },
    create: function(req, res){
        console.log(req.body);
    	List.create(req.body, function(err, results){
    		if(err){
    			console.log(err);
    		}else{
    			res.json(results);
    		}
    	})    	
    },
    delete: function(req, res){
    	List.remove({_id: req.body._id}, function(err, results){
    		if(err){
    			console.log(err);
    		}else{
    			res.json(results);
    		}
	        
	    })
    },
    toggle: function(req, res){
        if(req.body.completed == "Incomplete"){
            List.update({_id: req.body._id}, {completed: 'Completed'}, [], function(err, results){
                if(err){
                    console.log(err);
                }else{
                    res.json(results);
                }
            });
        }else{
            List.update({_id: req.body._id}, {completed: 'Incomplete'}, [], function(err, results){
                if(err){
                    console.log(err);
                }else{
                    res.json(results);
                }
            });
        }
    },
    findOne: function(req,res){
        console.log(req.body.id);
        List.findOne({_id:req.body.id}, function(err, results){
            if(err){
                console.log(err);
            }else{
                res.json(results);
            }
        });
    },
    update: function(req, res){
        console.log(req.body);
        List.update({_id:req.body._id}, {$set: {name: req.body.name, desc: req.body.desc, category: req.body.category, date: req.body.date}}, [], function(err, results){
            if(err){
                console.log(err);
            }else{
                res.json(results);
            }
        })
    },
    indexCompleted: function(req, res) {
        List.find({completed:"Completed"}).sort('date').exec(function(err, results){
            if(err){
                console.log(err);
            }else {
                res.json(results);
            }
        })
    },
    indexIncomplete: function(req, res) {
        List.find({completed:"Incomplete"}).sort('date').exec(function(err, results){
            if(err){
                console.log(err);
            }else {
                res.json(results);
            }
        })
    }
  }
})();