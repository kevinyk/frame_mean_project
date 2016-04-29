var mongoose = require('mongoose');

var ListSchema = new mongoose.Schema({
	_user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	name: String,
	desc: String,
	category: String,
	completed: String,
	date: Date

})

mongoose.model('List', ListSchema);