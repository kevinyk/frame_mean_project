var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports = (function() {
  return {

     new: function(req, res){
                    User.create(req.body, function(err, results) {
                        if(err) {
                            console.log(err);
                        }
                        else {
                            res.json(results);
                        }
                    })
            },

    index: function(req, res){
                User.find({}, function(err, data){
                    if(err) {
                        console.log(err);
                    }
                    else {
                    res.json(data);
                    }
                })
        },


    findOne: function(req, res){
                User.findOne({_id: req.params.id}, function(err, data){
                    console.log(req.params.id)
                    if(err) {
                        console.log(err);
                    }
                    else {
                    res.json(data);
                    console.log(data)
                    }
                })
        },


    edit: function(req, res) {
                User.update({_id: req.params.id},{$set: req.body}, function(err, data) {
                        if(err) {
                            console.log(err);
                        }
                        res.json(data);
                    })
    }

   }
})();